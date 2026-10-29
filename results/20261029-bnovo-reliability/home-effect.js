    const host = document.getElementById(widgetId);
    if (!host) return;
    const uid = new URL(s.booking).pathname.split('/').filter(Boolean).pop();
    let stopped = false, controller;
    const connect = () => { if (!stopped && !controller && window.__tangerinBooking) controller = window.__tangerinBooking.attach(host, uid); };
    window.addEventListener('tangerin:booking-ready', connect);
    connect();
    return () => { stopped = true; window.removeEventListener('tangerin:booking-ready', connect); controller?.dispose(); };
