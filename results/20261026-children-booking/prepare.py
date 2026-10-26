from pathlib import Path
import copy,hashlib,json,re,urllib.request
p=Path(__file__).resolve().parent;base=p.parent.parent/'source';sha=lambda b:hashlib.sha256(b).hexdigest()
raw=urllib.request.urlopen('https://tangerin.ru/api/content').read();api=json.loads(raw)
entries={e['key']:e for e in api['entries']};edits=[]
def edit(key,transforms):
    entry=entries[key];body=entry['data']['body']
    for a,b in transforms:assert body.count(a)==1,a[:80];body=body.replace(a,b)
    edits.append({'key':key,'kind':entry['kind'],'beforePublished':entry['data'],'transforms':[{'before':a,'after':b} for a,b in transforms]})
    entry['data']=copy.deepcopy(entry['data']);entry['data']['body']=body
key='vse-dlya-otdyha/s-detmi';body=entries[key]['data']['body']
hero=re.search(r'<div class="oct-hero-copy" id="sc-hero-copy-children">.*?</div></div><div class="children-hero-media">',body,re.S).group()
contacts=re.search(r'<div class="contact-four">.*?</div>',hero,re.S).group()
newhero='<div class="oct-hero-copy" id="sc-hero-copy-children"><p class="oct-eyebrow">Для гостей</p><h1>Для гостей с детьми</h1><p>В «Танжерине» мы позаботились о том, чтобы детям было удобно и интересно, а родители могли спокойно отдохнуть.</p></div><div class="children-hero-media">'
panel='<section class="children-request"><div class="children-request-copy"><h2>Как сообщить, что понадобится ребёнку</h2><p>Сообщите нам заранее, что понадобится вашему ребёнку, — при бронировании или в удобном мессенджере.<br>Мы всё подготовим к вашему приезду.</p><p class="children-contact-label">Выберите удобный способ связи</p>'+contacts+'</div><img class="children-request-decoration" src="/brand/orange-pair.webp" alt="" aria-hidden="true" width="250" height="290"></section>'
edit(key,[(hero,newhero),('Единоразовая оплата на весь период проживания.</p>','Единоразовая оплата за весь период проживания.</p><p>Соберём и подготовим кроватку к вашему приезду.</p>'),('<li>Книги</li></ul></div>','<li>Книги</li></ul><p>Предоставим по предварительному запросу.</p></div>'),('<div class="rs-back-bottom">',panel+'<div class="rs-back-bottom">')])
body=entries['site-footer']['data']['body'];start=body.index('<div class="site-footer-intro">');end=body.index('<nav aria-label="Все разделы сайта"',start);intro=body[start:end];logo=intro[:intro.index('</a>')+4]+'</div>'
footer_contacts=re.search(r'<div class="contact-four">.*?</div>',body,re.S).group()
edit('site-footer',[(intro,logo),(footer_contacts,'')])
(p/'content-patch.json').write_text(json.dumps({'edits':edits},ensure_ascii=False,indent=2),encoding='utf8')
(p/'preview-content.json').write_text(json.dumps(api,ensure_ascii=False),encoding='utf8')
payload=p/'payload';guards=[];additions=[];replacements=[]
def save(rel,after,newrel=None):
    old=(base/'runtime'/rel).read_bytes();blob=after.encode() if isinstance(after,str) else after
    assert old!=blob
    dest=payload/(newrel or rel);dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(blob)
    if newrel:guards.append({'path':rel,'sha256':sha(old)});additions.append({'path':newrel,'sha256':sha(blob)})
    else:replacements.append({'path':rel,'beforeSha256':sha(old),'afterSha256':sha(blob)})
scope='html:root body:has(#main):has(#main):has(#main):has(#main) #main#main'
child=scope+' #additional-services#additional-services #sc-uniform-copy-children'
assets=[('1m2h-house-cards-20261026.css','1m2h-children-booking-v3-20261026.css'),('1iyslc2xp3jm8-booking-20261022.js','1iyslc2xp3jm8-horizontal-v2-20261026.js'),('3cltmr-faq-menu-v2-20261022.js','3cltmr-horizontal-v2-20261026.js')]
def booking(s,jsx,fn,sitevar):
    assert s.count('function '+fn+'(){')==1
    s=s.replace('function '+fn+'(){','function '+fn+'({widgetId="_bn_widget_"}){')
    s=s.replace('document.getElementById("_bn_widget_")','document.getElementById(widgetId)')
    s=s.replace('id:"_bn_widget_",className:"bnovo-search-form"','id:widgetId,className:"bnovo-search-form"')
    s=s.replace('id:"_bnovo_link_",href:"https://bnovo.ru/"','id:widgetId==="_bn_widget_"?"_bnovo_link_":"_bnovo_link_top_",href:"https://bnovo.ru/"')
    s=s.replace('},['+sitevar+'.booking]);','},['+sitevar+'.booking,widgetId]);')
    s=s.replace('type:"vertical",uid','type:host.clientWidth<700?"vertical":"horizontal",uid')
    if fn=='D':
        s=s.replace('let stopped=false,mounting=false,cleanupBooking;','let stopped=false,mounting=false,cleanupBooking,bookingLayout;')
        s=s.replace('      mounting=true;\n      window.Bnovo_Widget.init','      mounting=true;bookingLayout=host.clientWidth<700?"vertical":"horizontal";\n      window.Bnovo_Widget.init')
        resize='const sizeObserver=new ResizeObserver(()=>{if(bookingLayout&&bookingLayout!==(host.clientWidth<700?"vertical":"horizontal")){cleanupBooking?.();host.querySelector("iframe")?.parentElement?.remove();mounting=false;mount();}});sizeObserver.observe(host);'
        s=s.replace('    observer.observe(host);','    observer.observe(host);'+resize)
        s=s.replace('stopped=true;observer.disconnect();cleanupBooking?.();','stopped=true;observer.disconnect();sizeObserver.disconnect();cleanupBooking?.();')
    marker='(0,'+jsx+'.jsx)("section",{className:"booking-section section botanical-section",id:"booking"'
    start=s.index(marker);end=s.index(',(0,'+jsx+'.jsx)("section",{className:"section rules-band',start)
    block=s[start:end]
    block=block.replace('(0,'+jsx+'.jsx)("br",{})','" "')
    s=s[:start]+block+s[end:]
    top=block.replace('id:"booking"','id:"booking-top"').replace('(0,'+jsx+'.jsx)('+fn+',{})','(0,'+jsx+'.jsx)('+fn+',{widgetId:"_bn_widget_top_"})')
    target='(0,'+jsx+'.jsx)("section",{id:"home-benefits"';assert s.count(target)==1
    return s.replace(target,top+','+target)
for index,(old,new) in enumerate(assets):
    rel='.next/static/chunks/'+old;blob=(base/'runtime'/rel).read_bytes()
    assert urllib.request.urlopen('https://tangerin.ru/_next/static/chunks/'+old).read()==blob
    s=blob.decode()
    if index==0:s+='\n'+(p/'changes.css').read_text(encoding='utf8').replace('CHILD',child).replace('SCOPE',scope)
    elif index==1:s=booking(s,'e','D','s')
    else:
        assert s.count('type:"vertical",uid')==1
        s=s.replace('type:"vertical",uid','type:host.clientWidth<700?"vertical":"horizontal",uid')
        s=s.replace('let mounting=false;','let mounting=false,bookingLayout;')
        s=s.replace('      mounting=true;\n      window.Bnovo_Widget.init','      mounting=true;bookingLayout=host.clientWidth<700?"vertical":"horizontal";\n      window.Bnovo_Widget.init')
        resize='const sizeObserver=new ResizeObserver(()=>{if(!host.isConnected){sizeObserver.disconnect();return;}if(bookingLayout&&bookingLayout!==(host.clientWidth<700?"vertical":"horizontal")){host.querySelector("iframe")?.parentElement?.remove();mounting=false;mount();}});sizeObserver.observe(host);'
        s=s.replace('    observer.observe(section);','    observer.observe(section);'+resize)
    save(rel,s,'.next/static/chunks/'+new)
rel='.next/server/chunks/ssr/src_components_landing_tsx_0km0ti4._.js'
s=(base/'runtime'/rel).read_text(encoding='utf8');save(rel,booking(s,'b','S','a'))
for route in ['page','[...slug]/page','preview/page','editor-preview/page','_not-found/page']:
    rel='.next/server/app/'+route+'_client-reference-manifest.js';s=(base/'runtime'/rel).read_text(encoding='utf8')
    for old,new in assets:s=s.replace(old,new)
    save(rel,s)
manifest=json.loads((base/'runtime-manifest.json').read_text(encoding='utf8'));rows={r['path']:r for r in manifest['entries']}
for item in additions+replacements:
    blob=(payload/item['path']).read_bytes();rows[item['path']]={'path':item['path'],'type':'file','bytes':len(blob),'sha256':sha(blob)}
rows=sorted(rows.values(),key=lambda r:r['path']);summary={'files':sum(r['type']=='file' for r in rows),'links':sum(r['type']=='link' for r in rows),'bytes':sum(r.get('bytes',0) for r in rows),'treeSha256':sha(json.dumps(rows,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode())}
(p/'runtime-expected.json').write_text(json.dumps({'summary':summary,'entries':rows},ensure_ascii=False,indent=2),encoding='utf8')
plan={'productionRoot':'/var/www/gosti/releases/20260925-2/.next/standalone','backup':'/var/www/gosti/backups/20261026-children-booking','runtimeBefore':manifest['summary'],'runtimeAfter':summary,'publishedAPI':sha(raw),'guards':guards,'additions':additions,'replacements':replacements}
(p/'plan.json').write_text(json.dumps(plan,indent=2),encoding='utf8');print(json.dumps({'runtimeFiles':len(additions)+len(replacements),'cmsRows':len(edits)}))
