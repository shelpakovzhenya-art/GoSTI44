  let watched, loadWatched;
  function warmBnovo(){
    if(window.Bnovo_Widget||document.querySelector('script[data-tangerin-bnovo]'))return;
    const script=document.createElement('script');
    script.src='https://widget.reservationsteps.ru/js/bnovo.js';script.async=true;script.dataset.tangerinBnovo='true';
    document.head.append(script);
  }

  function start(){
    const section=document.getElementById('footer-booking');
    const host=document.getElementById('_bn_widget_footer_');
    if(!section||!host)return;

    // A persistent footer must follow the current route before its host guard.
    if(document.getElementById('_bn_widget_')){section.hidden=true;warmBnovo();return;}
    section.hidden=false;
    if(host===watched){if(!host.querySelector('iframe'))loadWatched?.();return;}
    watched=host;

    const link=section.closest('footer')?.querySelector('.site-legal-links a[href^="https://reservationsteps.ru/rooms/index/"]')||section.querySelector('.bnovo-fallback a[href]');
    if(!link)return;
    const uid=new URL(link.href).pathname.split('/').filter(Boolean).pop();
    if(!/^[0-9a-f-]{36}$/i.test(uid))return;
    let mounting=false;
    function mount(){
      if(!host.isConnected||section.hidden||host.querySelector('iframe')||mounting)return;
      mounting=true;
      window.Bnovo_Widget.init(()=>{
        if(!host.isConnected||section.hidden){mounting=false;return;}
        window.__tangerinOpenBooking(host,{
          type:"vertical",uid,lang:"ru",width:"100%",width_mobile:"100%",
          background:"#FFFDF8",background_mobile:"#FFFDF8",bg_alpha:"0",bg_alpha_mobile:"0",
          padding:"0",padding_mobile:"0",border_radius:"8",without_title:"on",
          button_font_size:"16",button_height:"48",font_type:"inter",
          title_color:"#234B3A",title_color_mobile:"#234B3A",title_size:"22",title_size_mobile:"22",
          inp_color:"#234B3A",inp_bordhover:"#234B3A",inp_bordcolor:"#9BA99E",inp_alpha:"100",
          btn_background:"#FF972F",btn_background_over:"#EF8620",btn_textcolor:"#234B3A",btn_textover:"#234B3A",
          btn_bordcolor:"#FF972F",btn_bordhover:"#EF8620",min_age:"0",max_age:"17",adults_default:"2",
          dates_preset:"on",dfrom_today:"on",dto_nextday:"on",switch_mobiles_width:"800"
        });
        const frame=host.querySelector('iframe');
        if(frame)frame.title='Выбор дат и гостей — Bnovo';
      });
    }
    function load(){
      if(!host.isConnected||section.hidden||host.querySelector('iframe'))return;
      if(window.Bnovo_Widget){mount();return;}
      let script=document.querySelector('script[data-tangerin-bnovo]');
      const fresh=!script;
      if(!script){script=document.createElement('script');script.src='https://widget.reservationsteps.ru/js/bnovo.js';script.async=true;script.dataset.tangerinBnovo='true';}
      script.addEventListener('load',mount,{once:true});
      if(fresh)document.head.append(script);
    }
    loadWatched=load;
    const observer=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){observer.disconnect();load();}},{rootMargin:'400px'});
    observer.observe(section);
    // Prepare during idle time; arriving at the section must not start the SDK download.
    if('requestIdleCallback'in window)requestIdleCallback(load,{timeout:250});else setTimeout(load,100);
  }

