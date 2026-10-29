  let watched, footerController, wasHome;
  function start() {
    const section = document.getElementById('footer-booking');
    const host = document.getElementById('_bn_widget_footer_');
    if (!section || !host) return;
    const home = !!document.getElementById('_bn_widget_');
    section.hidden = home;
    if (host === watched) {
      if (home !== wasHome) { wasHome = home; footerController?.resume(); }
      return;
    }
    footerController?.dispose(); watched = host; wasHome = home;
    const link = section.closest('footer')?.querySelector('.site-legal-links a[href^="https://reservationsteps.ru/rooms/index/"]');
    if (!link) return;
    const uid = new URL(link.href).pathname.split('/').filter(Boolean).pop();
    footerController = window.__tangerinBooking.attach(host, uid, () => !section.hidden);
  }
