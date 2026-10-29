const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'booking-manager.js'),'utf8');
function env(config={}) {
 let now=0,serial=0,sdkRequests=0,opens=0,popups=0,releases=0;
 const timers=new Map(),hosts=new Map(),resizes=[];
 const later=(fn,ms=0)=>{let id=++serial;timers.set(id,{fn,at:now+ms});return id;};
 class E {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.events={};this.hidden=false;this.isConnected=true;this.clientWidth=900;this.attributes={};this.style={setProperty:(k,v)=>this.style[k]=v,removeProperty:k=>delete this.style[k]};}
  addEventListener(k,fn,o){(this.events[k]??=[]).push({fn,once:o?.once});}
  removeEventListener(k,fn){this.events[k]=(this.events[k]||[]).filter(x=>x.fn!==fn);}
  dispatchEvent(e){for(const x of [...(this.events[e.type]||[])]){if(x.once)this.removeEventListener(e.type,x.fn);x.fn(e);}}
  setAttribute(k,v){this.attributes[k]=v;}
  removeAttribute(k){delete this.attributes[k];}
  append(...es){for(const e of es){e.parentElement=this;this.children.push(e);if(this===doc.head&&e.tagName==='SCRIPT')scriptAdded(e);}}
  after(e){e.parentElement=this.parentElement;this.parentElement.children.push(e);}
  remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(e=>e!==this);this.isConnected=false;}
  all(){return this.children.flatMap(e=>[e,...e.all()]);}
  querySelector(s){if(s==='iframe')return this.all().find(e=>e.tagName==='IFRAME')||null;return null;}
  querySelectorAll(s){return s==='script[data-tangerin-bnovo]'?this.all().filter(e=>e.tagName==='SCRIPT'&&e.dataset.tangerinBnovo):[];}
 }
 const doc=new E('document');doc.head=new E('head');doc.body=new E('body');doc.documentElement=doc;doc.append(doc.head,doc.body);doc.hidden=false;
 doc.createElement=t=>new E(t);doc.getElementById=id=>hosts.get(id)||null;
 doc.querySelectorAll=s=>doc.head.querySelectorAll(s);doc.querySelector=s=>doc.querySelectorAll(s)[0]||null;
 function api(){return {init:cb=>cb(),createBnovoBookPopup(){popups++;},loadScript(url,cb){later(cb,config.contentDelay?.(opens)||0);},open(id,opts){
   const call=++opens,host=hosts.get(id),wrap=new E(),frame=new E('iframe');wrap.append(frame);host.append(wrap);host.lastOptions=opts;
   this.loadScript('popup',()=>this.createBnovoBookPopup());
   this.loadScript('widget',()=>{if(config.blank?.(call))return;const d=new E('document');d.readyState='complete';d.getElementById=id=>['from','to','guests_count'].includes(id)?{value:id==='guests_count'?'2':'01-11-2026'}:null;d.querySelector=()=>({});frame.contentDocument=d;});
 }};}
 const win=new E('window');win.document=doc;win.__tangerinOpenBooking=(host,opts)=>{win.Bnovo_Widget.open(host.id,opts);return()=>{releases++;};};
 function scriptAdded(el){sdkRequests++;const n=sdkRequests;if(config.sdkHang?.(n))return;later(()=>{if(config.sdkError?.(n)){el.onerror?.();el.dispatchEvent({type:'error'});}else{win.Bnovo_Widget=api();el.onload?.();el.dispatchEvent({type:'load'});}},config.sdkDelay||0);}
 const ctx={window:win,document:doc,Promise,Map,URL,Event:class{constructor(type){this.type=type;}},Date:{now:()=>now},setTimeout:later,clearTimeout:id=>timers.delete(id),MutationObserver:class{observe(){}},ResizeObserver:class{constructor(fn){this.fn=fn;}observe(h){resizes.push({h,fn:this.fn});}disconnect(){}}};
 vm.createContext(ctx);vm.runInContext(source,ctx);
 function host(id){const h=new E();h.id=id;hosts.set(id,h);doc.body.append(h);return h;}
 async function advance(ms){const end=now+ms;for(let guard=0;guard<20000;guard++){for(let n=0;n<8;n++)await Promise.resolve();const next=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(!next||next[1].at>end){now=end;return;}timers.delete(next[0]);now=next[1].at;next[1].fn();}throw new Error('Timer loop');}
 return {win,doc,ctx,host,advance,resize:h=>resizes.filter(r=>r.h===h).forEach(r=>r.fn()),get requests(){return sdkRequests},get opens(){return opens},get popups(){return popups},get releases(){return releases}};
}
const uid='07c095b2-87d7-41ee-894d-76339e9f891a',results=[];
async function scenario(name,run){await run();results.push({name,passed:true});}
(async()=>{
 await scenario('baseline: failed script remains sticky',async()=>{
  const e=env({sdkError:()=>true}); // Stop the new warm request, then test the old load function separately.
  await e.advance(1); const h=e.host('old');const baseline=fs.readFileSync(path.join(__dirname,'3cltmr-hydration-20261026.js'),'utf8');
  const i=baseline.indexOf('    function load(){'),j=baseline.indexOf('    loadWatched=load;',i);e.ctx.host=h;e.ctx.section={hidden:false};e.ctx.mount=()=>{};
  vm.runInContext(baseline.slice(i,j)+'load();',e.ctx);await e.advance(1);const n=e.requests;vm.runInContext('load();',e.ctx);await e.advance(20000);assert.equal(e.requests,n);assert.equal(h.querySelector('iframe'),null);
 });
 await scenario('SDK error recovers automatically',async()=>{const e=env({sdkError:n=>n===1}),h=e.host('one');e.win.__tangerinBooking.attach(h,uid);await e.advance(5000);assert.equal(h.dataset.tangerinBookingState,'ready');assert.equal(e.requests,2);});
 await scenario('SDK timeout is replaced and recovers',async()=>{const e=env({sdkHang:n=>n===1}),h=e.host('one');e.win.__tangerinBooking.attach(h,uid);await e.advance(8500);assert.equal(h.dataset.tangerinBookingState,'ready');assert.equal(e.requests,2);});
 await scenario('empty iframe is not success; it is remounted',async()=>{const e=env({blank:n=>n===1}),h=e.host('one');e.win.__tangerinBooking.attach(h,uid);await e.advance(12000);assert.equal(h.dataset.tangerinBookingState,'ready');assert.equal(e.opens,2);assert.equal(e.releases,1);});
 await scenario('permanent failure is bounded with a working direct URL',async()=>{const e=env({blank:()=>true}),h=e.host('one');e.win.__tangerinBooking.attach(h,uid);await e.advance(300000);assert.equal(e.opens,3);assert.equal(h.dataset.tangerinBookingState,'failed');const panel=e.doc.body.children.find(x=>x.className==='tangerin-booking-recovery');assert.equal(panel.hidden,false);assert.equal(panel.children[1].children[1].href,'https://reservationsteps.ru/rooms/index/'+uid);});
 await scenario('late response from timed out attempt cannot touch detached iframe',async()=>{const e=env({contentDelay:n=>n===1?14000:0}),h=e.host('one');e.win.__tangerinBooking.attach(h,uid);await e.advance(18000);assert.equal(h.dataset.tangerinBookingState,'ready');assert.equal(e.opens,2);assert.equal(h.querySelector('iframe').contentDocument.readyState,'complete');});
 await scenario('two home forms share the SDK and one popup listener',async()=>{const e=env(),a=e.host('top'),b=e.host('bottom');e.win.__tangerinBooking.attach(a,uid);e.win.__tangerinBooking.attach(b,uid);await e.advance(500);assert.equal(e.requests,1);assert.equal(e.opens,2);assert.equal(e.popups,1);assert.equal(a.dataset.tangerinBookingState,'ready');assert.equal(b.dataset.tangerinBookingState,'ready');});
 await scenario('SPA unmount cancels pending work',async()=>{const e=env({sdkDelay:2000}),h=e.host('one'),c=e.win.__tangerinBooking.attach(h,uid);c.dispose();h.isConnected=false;await e.advance(10000);assert.equal(e.opens,0);});
 await scenario('untouched form adapts to resize; used form is preserved',async()=>{const e=env(),h=e.host('one');e.win.__tangerinBooking.attach(h,uid);await e.advance(500);h.clientWidth=390;e.resize(h);await e.advance(500);assert.equal(e.opens,2);assert.equal(h.lastOptions.type,'vertical');h.querySelector('iframe').contentDocument.dispatchEvent({type:'pointerdown'});h.clientWidth=900;e.resize(h);await e.advance(500);assert.equal(e.opens,2);});
 await scenario('online event restores failed SDK',async()=>{let broken=true;const e=env({sdkError:()=>broken}),h=e.host('one');e.win.__tangerinBooking.attach(h,uid);await e.advance(10000);assert.equal(h.dataset.tangerinBookingState,'failed');broken=false;e.win.dispatchEvent({type:'online'});await e.advance(1000);assert.equal(h.dataset.tangerinBookingState,'ready');});
 await scenario('hidden footer starts after returning from home',async()=>{const e=env(),h=e.host('footer');let active=false;const c=e.win.__tangerinBooking.attach(h,uid,()=>active);await e.advance(500);assert.equal(e.opens,0);active=true;c.resume();await e.advance(500);assert.equal(h.dataset.tangerinBookingState,'ready');});
 await scenario('manual retry restores exhausted attempts',async()=>{let broken=true;const e=env({blank:()=>broken}),h=e.host('manual');e.win.__tangerinBooking.attach(h,uid);await e.advance(40000);assert.equal(h.dataset.tangerinBookingState,'failed');broken=false;const panel=e.doc.body.children.find(x=>x.className==='tangerin-booking-recovery');panel.children[1].children[0].dispatchEvent({type:'click'});await e.advance(500);assert.equal(h.dataset.tangerinBookingState,'ready');assert.equal(panel.hidden,true);});
 console.log(JSON.stringify({passed:results.length,scenarios:results},null,2));fs.writeFileSync(path.join(__dirname,'recovery-tests.json'),JSON.stringify({passed:results.length,scenarios:results},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
