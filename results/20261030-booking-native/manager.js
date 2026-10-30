/* Local date selector: no remote SDK/iframe is needed to display or submit. */
(() => {
 if(window.__tangerinBooking)return;
 const states=new Map();
 const template="<form class=\"tn-booking-form\" action=\"https://reservationsteps.ru/rooms/index/07c095b2-87d7-41ee-894d-76339e9f891a\" method=\"get\"><label>Заезд<input class=\"tn-arrival\" type=\"date\" required aria-label=\"Дата заезда\"></label><label>Выезд<input class=\"tn-departure\" type=\"date\" required aria-label=\"Дата выезда\"></label><label>Гостей<select name=\"adults\" aria-label=\"Количество гостей\"><option value=\"1\">1</option><option value=\"2\" selected>2</option><option value=\"3\">3</option><option value=\"4\">4</option><option value=\"5\">5</option><option value=\"6\">6</option><option value=\"7\">7</option><option value=\"8\">8</option><option value=\"9\">9</option><option value=\"10\">10</option><option value=\"11\">11</option><option value=\"12\">12</option><option value=\"13\">13</option><option value=\"14\">14</option><option value=\"15\">15</option><option value=\"16\">16</option><option value=\"17\">17</option><option value=\"18\">18</option><option value=\"19\">19</option><option value=\"20\">20</option><option value=\"21\">21</option><option value=\"22\">22</option><option value=\"23\">23</option><option value=\"24\">24</option><option value=\"25\">25</option></select></label><button type=\"submit\">Показать наличие ↗</button></form>";
 const iso=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
 const next=s=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+1);return iso(d)};
 const fmt=s=>s.split('-').reverse().join('-');
 function attach(host,uid,active=()=>true){
  if(states.has(host))return states.get(host);
  if(!/^[0-9a-f-]{36}$/i.test(uid))return {dispose(){},resume(){}};
  if(!host.querySelector('.tn-booking-form'))host.innerHTML=template;
  const form=host.querySelector('form'),arrival=form.querySelector('.tn-arrival'),departure=form.querySelector('.tn-departure');
  form.action='https://reservationsteps.ru/rooms/index/'+uid;
  const today=iso(new Date());arrival.min=today;arrival.value=arrival.value||today;departure.min=next(arrival.value);departure.value=departure.value||departure.min;
  const change=()=>{if(!arrival.value)return;departure.min=next(arrival.value);if(!departure.value||departure.value<=arrival.value)departure.value=departure.min};
  arrival.addEventListener('change',change);
  const submit=e=>{e.preventDefault();change();if(!form.reportValidity())return;const url=new URL(form.action);url.searchParams.set('dfrom',fmt(arrival.value));url.searchParams.set('dto',fmt(departure.value));url.searchParams.set('adults',form.elements.adults.value);url.searchParams.set('lang','ru');for(const k of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']){const v=new URLSearchParams(location.search).get(k);if(v)url.searchParams.set(k,v)}location.assign(url.href)};
  form.addEventListener('submit',submit);host.dataset.tangerinBookingState='ready';host.removeAttribute('aria-busy');host.style.removeProperty('display');
  const controller={resume(){if(host.querySelector("form")!==form){states.delete(host);attach(host,uid,active)}},recover(){},dispose(){form.removeEventListener('submit',submit);arrival.removeEventListener('change',change);states.delete(host)}};states.set(host,controller);return controller;
 }
 window.__tangerinBooking={attach,warm(){}};window.dispatchEvent(new Event('tangerin:booking-ready'));
 new MutationObserver(()=>{for(const [host,state]of states)if(!host.isConnected)state.dispose()}).observe(document.documentElement,{childList:true,subtree:true});
})();
