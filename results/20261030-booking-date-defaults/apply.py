from pathlib import Path
import json,hashlib,shutil,subprocess
b=Path('/var/www/gosti/releases/20260925-2/.next/standalone');p=Path(__file__).parent;bk=Path('/var/www/gosti/backups/20261030-booking-date-defaults');r=json.loads((p/'target.json').read_text());f=b/r['path'];assert hashlib.sha256(f.read_bytes()).hexdigest()==r['sha'];assert not bk.exists();bk.mkdir();d=bk/r['path'];d.parent.mkdir(parents=True);shutil.copy2(f,d);f.write_bytes(f.read_bytes().replace(r['old'].encode(),r['new'].encode()));subprocess.run(['node','--check',str(f)],check=True)
old='3cltmr-booking-native-v2-20261030.js';new='3cltmr-booking-native-v3-20261030.js';f=b/'.next/static/chunks'/old;s=f.read_text();needle='states.delete(host);attach(host,uid,active)}},recover(){}';replacement='states.delete(host);attach(host,uid,active)}else{if(!arrival.value)arrival.value=iso(new Date());if(!departure.value)departure.value=next(arrival.value)}},recover(){}';assert s.count(needle)==1;s=s.replace(needle,replacement);f=b/'.next/static/chunks'/new;f.write_bytes(s.encode());subprocess.run(['node','--check',str(f)],check=True)
for f in (b/'.next/server').rglob('*.js'):
 raw=f.read_bytes()
 if old.encode()in raw:
  d=bk/f.relative_to(b);d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(f,d);f.write_bytes(raw.replace(old.encode(),new.encode()))
subprocess.run(['systemctl','restart','gosti'],check=True)
