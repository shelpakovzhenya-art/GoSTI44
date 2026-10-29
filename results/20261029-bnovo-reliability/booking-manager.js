/* Own loading/recovery; retain Bnovo's official SDK, UID, form and submit flow. */
(() => {
  if (window.__tangerinBooking) return;
  const sdkURL = 'https://widget.reservationsteps.ru/js/bnovo.js';
  const states = new Map();
  let pendingSDK;
  function sdk() {
    if (window.Bnovo_Widget?.init && window.Bnovo_Widget?.open) return Promise.resolve(window.Bnovo_Widget);
    if (pendingSDK) return pendingSDK;
    pendingSDK = new Promise((resolve, reject) => {
      document.querySelectorAll('script[data-tangerin-bnovo]').forEach(el => el.remove());
      const script = document.createElement('script');
      script.src = sdkURL; script.async = true; script.dataset.tangerinBnovo = 'true';
      let finished = false;
      const finish = error => {
        if (finished) return;
        finished = true; clearTimeout(timer);
        script.onload = script.onerror = null;
        if (error) { script.remove(); reject(error); }
        else if (window.Bnovo_Widget?.init && window.Bnovo_Widget?.open) resolve(window.Bnovo_Widget);
        else { script.remove(); reject(new Error('Bnovo SDK unavailable')); }
      };
      const timer = setTimeout(() => finish(new Error('Bnovo SDK timeout')), 6000);
      script.onload = () => finish();
      script.onerror = () => finish(new Error('Bnovo SDK network error'));
      document.head.append(script);
    }).catch(error => { pendingSDK = null; throw error; });
    return pendingSDK;
  }
  function fields(host) {
    try {
      const frame = host.querySelector('iframe'), doc = frame?.contentDocument;
      if (!doc || doc.readyState === 'loading') return null;
      const from = doc.getElementById('from'), to = doc.getElementById('to'), guests = doc.getElementById('guests_count');
      return from?.value && to?.value && guests?.value && doc.querySelector('button[type="submit"],button:not([type]),input[type="submit"]') ? { frame, doc } : null;
    } catch { return null; }
  }
  function attach(host, uid, active = () => true) {
    if (states.has(host)) return states.get(host);
    if (!/^[0-9a-f-]{36}$/i.test(uid)) return { dispose() {}, resume() {} };
    let stopped = false, generation = 0, attempts = 0, running = false, ready = false, dirty = false;
    let checkTimer, retryTimer, slowTimer, resizeTimer, release, layout;
    const panel = document.createElement('div');
    panel.className = 'tangerin-booking-recovery';
    const status = document.createElement('p'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    const actions = document.createElement('div'); actions.className = 'tangerin-booking-recovery-actions';
    const retry = document.createElement('button'); retry.type = 'button'; retry.textContent = 'Повторить загрузку';
    const link = document.createElement('a'); link.href = 'https://reservationsteps.ru/rooms/index/' + uid; link.textContent = 'Открыть бронирование';
    actions.append(retry, link); panel.append(status, actions); host.after(panel);
    const alive = token => !stopped && host.isConnected && active() && generation === token;
    const clearTimers = () => { clearTimeout(checkTimer); clearTimeout(retryTimer); clearTimeout(slowTimer); };
    const clearFrame = () => {
      release?.(); release = null;
      const frame = host.querySelector('iframe');
      if (frame?.parentElement !== host) frame?.parentElement?.remove(); else frame?.remove();
    };
    function show(message, failed = false) {
      panel.hidden = !active(); status.textContent = message;
      retry.hidden = !failed; actions.hidden = !failed;
    }
    function fail(token) {
      if (!alive(token)) return;
      generation++; running = false; ready = false; clearTimers(); clearFrame();
      host.dataset.tangerinBookingState = 'failed'; host.removeAttribute('aria-busy');
      host.style.setProperty('display', 'none', 'important');
      show('Не удалось загрузить форму. Можно повторить попытку или перейти к бронированию.', true);
      retry.disabled = false;
      if (attempts < 3) retryTimer = setTimeout(start, attempts * 1500);
    }
    function start() {
      if (stopped || !host.isConnected || !active() || running || ready || attempts >= 3) return;
      running = true; attempts++; const token = ++generation;
      host.dataset.tangerinBookingState = 'loading'; host.setAttribute('aria-busy', 'true');
      host.style.removeProperty('display'); clearFrame();
      show('Загружаем форму бронирования…');
      slowTimer = setTimeout(() => {
        if (alive(token) && !ready) { status.textContent = 'Форма загружается дольше обычного. Можно открыть бронирование напрямую.'; actions.hidden = false; }
      }, 2500);
      // One shared request serves both home forms and the persistent footer.
      sdk().then(api => {
        if (!alive(token)) { running = false; return; }
        layout = host.clientWidth < 700 ? 'vertical' : 'horizontal';
        // The official popup listener is global; install it once, not per retry/form.
        if (api.createBnovoBookPopup && !api.__tangerinPopupOnce) {
          const popup = api.createBnovoBookPopup; let installed = false;
          api.createBnovoBookPopup = function() { if (!installed) { installed = true; return popup.apply(this, arguments); } };
          api.__tangerinPopupOnce = true;
        }
        api.init(() => {
          if (!alive(token)) return;
          // A response from an abandoned attempt must never write into a detached iframe.
          const load = api.loadScript;
          api.loadScript = function(url, callback) { return load.call(this, url, () => { if (alive(token)) callback?.(); }); };
          try {
            release = window.__tangerinOpenBooking(host, {
              type:layout,uid,lang:'ru',width:'100%',width_mobile:'100%',
              background:'#FFFDF8',background_mobile:'#FFFDF8',bg_alpha:'0',bg_alpha_mobile:'0',
              padding:'0',padding_mobile:'0',border_radius:'8',without_title:'on',
              button_font_size:'16',button_height:'48',font_type:'inter',
              title_color:'#234B3A',title_color_mobile:'#234B3A',title_size:'22',title_size_mobile:'22',
              inp_color:'#234B3A',inp_bordhover:'#234B3A',inp_bordcolor:'#9BA99E',inp_alpha:'100',
              btn_background:'#FF972F',btn_background_over:'#EF8620',btn_textcolor:'#234B3A',btn_textover:'#234B3A',
              btn_bordcolor:'#FF972F',btn_bordhover:'#EF8620',min_age:'0',max_age:'17',adults_default:'2',
              dates_preset:'on',dfrom_today:'on',dto_nextday:'on',switch_mobiles_width:'800'
            });
            const frame = host.querySelector('iframe'); if (frame) frame.title = 'Выбор дат и гостей — Bnovo';
          } finally { api.loadScript = load; }
        });
        const deadline = Date.now() + 9000;
        function check() {
          if (!alive(token)) { running = false; return; }
          const form = fields(host);
          if (form) {
            ready = true; running = false; clearTimers(); panel.hidden = true;
            host.dataset.tangerinBookingState = 'ready'; host.removeAttribute('aria-busy');
            form.doc.addEventListener('input', () => { dirty = true; }, { once:true });
            form.doc.addEventListener('change', () => { dirty = true; }, { once:true });
            form.doc.addEventListener('pointerdown', () => { dirty = true; }, { once:true });
            form.doc.addEventListener('keydown', () => { dirty = true; }, { once:true });
          } else if (Date.now() >= deadline) fail(token);
          else checkTimer = setTimeout(check, 200);
        }
        check();
      }).catch(() => fail(token));
    }
    retry.addEventListener('click', () => { clearTimers(); attempts = 0; running = ready = false; generation++; start(); });
    const resize = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        // Keep dates/guests already entered by the visitor; never replace a used form.
        if (ready && !dirty && active() && layout !== (host.clientWidth < 700 ? 'vertical' : 'horizontal')) {
          generation++; ready = running = false; attempts = 0; clearFrame(); start();
        }
      }, 180);
    });
    resize.observe(host);
    const controller = {
      resume() {
        if (stopped) return;
        if (!active()) { generation++; running = false; clearTimers(); panel.hidden = true; return; }
        if (ready && fields(host)) { panel.hidden = true; return; }
        if (ready) { ready = false; attempts = 0; }
        if (!running && attempts < 3) start();
      },
      recover() { if (!ready && !running && active()) { attempts = 0; start(); } },
      dispose() { stopped = true; generation++; clearTimers(); clearTimeout(resizeTimer); resize.disconnect(); release?.(); panel.remove(); states.delete(host); }
    };
    states.set(host, controller); start(); return controller;
  }
  const style = document.createElement('style');
  style.textContent = '.tangerin-booking-recovery[hidden],.tangerin-booking-recovery [hidden]{display:none!important}.tangerin-booking-recovery{font:400 16px/1.5 var(--font-manrope),Arial,sans-serif;color:#234b3a;padding:12px 0}.tangerin-booking-recovery p{font:inherit!important;margin:0 0 10px!important}.tangerin-booking-recovery-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.tangerin-booking-recovery-actions button,.tangerin-booking-recovery-actions a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border:1px solid #9ba99e;border-radius:8px;font:600 14px/1.4 var(--font-manrope),Arial,sans-serif;white-space:normal;text-align:center;text-decoration:none;color:#234b3a;background:#fffdf8;cursor:pointer}.tangerin-booking-recovery-actions a{background:#ff972f;border-color:#ff972f}.tangerin-booking-recovery-actions :focus-visible{outline:2px solid #234b3a;outline-offset:3px}';
  document.head.append(style);
  window.__tangerinBooking = { attach, warm: () => sdk().catch(() => {}) };
  window.__tangerinBooking.warm();
  window.dispatchEvent(new Event('tangerin:booking-ready'));
  window.addEventListener('online', () => states.forEach(state => state.recover()));
  window.addEventListener('pageshow', () => states.forEach(state => state.resume()));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) states.forEach(state => state.resume()); });
  new MutationObserver(() => { for (const [host,state] of states) if (!host.isConnected) state.dispose(); }).observe(document.documentElement, { childList:true, subtree:true });
})();
