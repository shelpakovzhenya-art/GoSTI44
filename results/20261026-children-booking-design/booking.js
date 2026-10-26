/* Local presentation adapter; the Bnovo SDK and booking behaviour are unchanged. */
;(() => {
  if (window.__tangerinChildrenBookingDesign) return;
  window.__tangerinChildrenBookingDesign = true;
  const styleId = 'tangerin-children-booking-grid';
  const css = `
    .bnovo {width:100%!important;min-width:0!important;}
    .bnovo .bnovo__form-items {display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;gap:12px!important;}
    .bnovo .bnovo__inputs {display:contents!important;}
    .bnovo .bnovo__field,.bnovo .bnovo__buttons {display:block!important;float:none!important;width:auto!important;min-width:0!important;margin:0!important;padding:0!important;flex:none!important;}
    .bnovo .bnovo__fields {display:block!important;margin:0!important;padding:0!important;}
    .bnovo .bnovo__button.openReceptionButton {width:100%!important;height:48px!important;padding:0 8px!important;font-size:14px!important;white-space:normal!important;line-height:1.2!important;}
    .bnovo .bnovo__input {font-size:14px!important;min-width:0!important;}
    .bnovo .bnovo__field-label {font-size:11px!important;}
    .bnovo .bnovo__guests {transform:none!important;left:0!important;right:auto!important;min-width:0!important;width:240px!important;max-width:calc(100vw - 2px)!important;box-sizing:border-box!important;}
    @media(max-width:360px){
      #ui-datepicker-div {left:0!important;width:100%!important;min-width:0!important;max-width:100%!important;box-sizing:border-box!important;padding:0 4px 2px!important;}
      #ui-datepicker-div table {width:100%!important;table-layout:fixed!important;}
      #ui-datepicker-div th,#ui-datepicker-div td {padding-left:0!important;padding-right:0!important;min-width:0!important;}
      #ui-datepicker-div td a {padding-left:0!important;padding-right:0!important;}
      #ui-datepicker-div .min-price-block {font-size:9px!important;white-space:normal!important;}
      #ui-datepicker-div .info-block {white-space:normal!important;}
    }
    @media(max-width:279px){
      .bnovo .bnovo__form-items {grid-template-columns:minmax(0,1fr)!important;}
    }
  `;
  let frame, doc, resize, contentWatch, queued = false;
  function refresh() {
    queued = false;
    const next = document.querySelector('#_bn_iframe__bn_widget_footer_');
    if (next !== frame) {
      resize?.disconnect(); contentWatch?.disconnect(); resize = null; doc = null; frame = next;
      if (frame) frame.addEventListener('load', schedule);
    }
    if (!frame) return;
    let current;
    try { current = frame.contentDocument; } catch { return; }
    const form = current?.querySelector('.bnovo__form-items');
    if (!form) return;
    const active = !!document.querySelector('#sc-uniform-copy-children');
    let style = current.getElementById(styleId);
    if (active && !style) {
      style = current.createElement('style'); style.id = styleId; style.textContent = css;
      current.head.append(style);
    } else if (!active && style) {
      style.remove();
      const height = Math.ceil(form.getBoundingClientRect().bottom);
      frame.contentWindow.hinit = height;
      frame.style.height = height + 'px';
      const link = frame.closest('#_bn_widget_footer_')?.querySelector('a');
      if (link) link.style.top = (height + 4) + 'px';
    }
    if (!active) { resize?.disconnect(); contentWatch?.disconnect(); doc = null; return; }
    if (doc !== current) {
      resize?.disconnect(); contentWatch?.disconnect(); doc = current;
      const syncSize = () => {
        if (!frame?.isConnected) { resize.disconnect(); contentWatch.disconnect(); return; }
        const height = Math.ceil(form.getBoundingClientRect().bottom);
        if (!height) return;
        const win = frame.contentWindow;
        // Keep the SDK's closed-form baseline in sync with the two-row layout.
        win.hinit = height;
        const open = [...current.querySelectorAll('#ui-datepicker-div,.bnovo__guests')]
          .some(e => win.getComputedStyle(e).display !== 'none' && win.getComputedStyle(e).visibility !== 'hidden');
        if (!open && frame.style.height !== height + 'px') frame.style.height = height + 'px';
        const link = frame.closest('#_bn_widget_footer_')?.querySelector('a');
        if (link && link.style.top !== (height + 4) + 'px') link.style.top = (height + 4) + 'px';
      };
      resize = new ResizeObserver(syncSize);
      resize.observe(form);
      contentWatch = new MutationObserver(syncSize);
      contentWatch.observe(current.body,{subtree:true,attributes:true,attributeFilter:['style','class']});
    }
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(refresh); } }
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  schedule();
})();
