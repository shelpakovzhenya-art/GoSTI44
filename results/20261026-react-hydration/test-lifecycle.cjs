const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const path=require('node:path');
const common=fs.readFileSync(path.join(__dirname,'payload/.next/static/chunks/3cltmr-hydration-20261026.js'),'utf8');
const home=fs.readFileSync(path.join(__dirname,'payload/.next/static/chunks/1iyslc2xp3jm8-hydration-20261026.js'),'utf8');
const baseline=fs.readFileSync(path.join(__dirname,'../../source/runtime/.next/static/chunks/3cltmr-children-booking-design-20261026.js'),'utf8');
function extract(s){return s.slice(s.indexOf('  function syncEmbeds() {'),s.indexOf('  function setChoice('));}
function setup(code){
 const hosts=[],callbacks={},queue=[];
 const context={hosts,choice:{external:true},copy:{externalTitle:'Map'},location:{origin:'https://tangerin.ru'},URL,Event:class{constructor(type){this.type=type}},queueMicrotask:fn=>queue.push(fn),document:{querySelectorAll:()=>hosts,createElement:()=>({dataset:{}}),dispatchEvent:e=>callbacks[e.type]?.(),addEventListener:(type,fn)=>callbacks[type]=fn}};
 vm.createContext(context);vm.runInContext(code,context);
 function host(react=true){let h={isConnected:true,dataset:{tangerinFrameSrc:'https://yandex.ru/map-widget/v1/'},frames:[],hasAttribute:()=>react,querySelector:()=>h.frames[0],classList:{add(){},remove(){}},append:f=>{f.remove=()=>h.frames.splice(h.frames.indexOf(f),1);h.frames.push(f)}};hosts.push(h);return h;}
 return {context,host,flush:()=>{while(queue.length)queue.shift()();}};
}
const old=setup(extract(baseline)),oldHost=old.host();old.context.syncEmbeds();assert.equal(oldHost.frames.length,1,'Baseline reproduces iframe insertion before React commit');
const helper=home.slice(home.indexOf('function tangerinEmbedCommitted('),home.indexOf('function F(){'));
const test=setup(extract(common)+helper+'document.addEventListener("tangerin:embeds-ready",syncEmbeds);');
let h=test.host();test.context.syncEmbeds();assert.equal(h.frames.length,0);
test.context.tangerinEmbedCommitted(h);assert.equal(h.frames.length,0);test.flush();assert.equal(h.frames.length,1);
test.context.syncEmbeds();assert.equal(h.frames.length,1,'No duplicate iframe');
test.context.choice.external=false;test.context.syncEmbeds();assert.equal(h.frames.length,0,'Revocation removes iframe');
test.context.choice.external=true;let detached=test.host();test.context.tangerinEmbedCommitted(detached);detached.isConnected=false;test.flush();assert.equal(detached.frames.length,0);
let cms=test.host(false);test.context.syncEmbeds();assert.equal(cms.frames.length,1,'Non-React CMS embeds continue to work');
let later=test.host();test.context.tangerinEmbedCommitted(later);test.context.choice.external=false;test.flush();assert.equal(later.frames.length,0,'Current consent wins over queued commit');
console.log('PASS: baseline race reproduced; pre-commit guard, post-commit mount, deduplication, revoke, detached host, CMS host, consent race');
