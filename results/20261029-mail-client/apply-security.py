from pathlib import Path
import hashlib,shutil,subprocess
p=Path(__file__).resolve().parent
conf=Path('/etc/nginx/sites-available/gosti')
backup=Path('/var/www/gosti/backups/20261029-mail-client')
old=conf.read_bytes()
assert hashlib.sha256(old).hexdigest()=='8cd189546b14687ac2a94371120d5fbd71bc72afac056dedbfa3863eaabf634f'
assert backup.is_dir() and not (backup/'nginx.conf').exists()
headers='''add_header Strict-Transport-Security "max-age=2592000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "frame-ancestors 'self' https://metrika.yandex.ru https://metrica.yandex.com; object-src 'none'; base-uri 'self'" always;
    add_header Reporting-Endpoints 'csp="https://tangerin.ru/csp-report"' always;
    add_header Content-Security-Policy-Report-Only "default-src 'self'; script-src 'self' 'unsafe-inline' https://widget.reservationsteps.ru https://reservationsteps.ru https://mc.yandex.ru https://yastatic.net; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; media-src 'self' blob:; connect-src 'self' https:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; report-uri /csp-report; report-to csp" always;'''
s=old.decode();assert s.count('add_header Strict-Transport-Security "max-age=86400" always;')==2
s=s.replace('add_header Strict-Transport-Security "max-age=86400" always;',headers)
s=s.replace('add_header X-Robots-Tag "noindex, nofollow" always;','add_header X-Robots-Tag "noindex, nofollow" always;\n        '+headers)
s='limit_req_zone $binary_remote_addr zone=tangerin_csp:1m rate=5r/m;\n'+s
anchor='    location ~ ^/(api/preview)(/|$) { return 403; }'
assert s.count(anchor)==1
s=s.replace(anchor,'''    location = /csp-report {
        limit_req zone=tangerin_csp burst=10 nodelay;
        client_max_body_size 16k;
        access_log off;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /var/www/gosti/shared/csp-report.php;
        fastcgi_pass 127.0.0.1:9000;
    }
'''+anchor)
target=Path('/var/www/gosti/shared/csp-report.php');assert not target.exists()
shutil.copy2(conf,backup/'nginx.conf');shutil.copy2(p/'csp-report.php',target);target.chmod(0o644)
conf.write_text(s)
try:
 subprocess.run(['nginx','-t'],check=True)
 subprocess.run(['systemctl','reload','nginx'],check=True)
except Exception:
 conf.write_bytes(old)
 subprocess.run(['nginx','-t'],check=True)
 subprocess.run(['systemctl','reload','nginx'],check=True)
 raise
print('Security headers applied; CSP report-only, sanitized local reports; HSTS 30 days without subdomains/preload')

