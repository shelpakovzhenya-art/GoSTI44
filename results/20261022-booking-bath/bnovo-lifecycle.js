// Bnovo.open registers a document click callback for its iframe but exposes no destroy API.
// Own those synchronous registrations so a detached React widget cannot receive clicks.
(()=>{
  if(window.__tangerinOpenBooking)return;
  const cleanups=new Map();
  window.__tangerinOpenBooking=(host,options)=>{
    cleanups.get(host)?.();
    const registered=[],add=document.addEventListener;
    document.addEventListener=function(type,listener,settings){
      if(this===document&&type==='click'&&typeof listener==='function'){
        const guarded=function(event){
          if(host.isConnected&&host.querySelector('iframe')?.contentWindow)listener.call(this,event);
        };
        registered.push({type,listener:guarded,settings});
        return add.call(this,type,guarded,settings);
      }
      return add.call(this,type,listener,settings);
    };
    try{window.Bnovo_Widget.open(host.id,options);}finally{document.addEventListener=add;}
    const cleanup=()=>{
      for(const item of registered)document.removeEventListener(item.type,item.listener,item.settings);
      registered.length=0;cleanups.delete(host);
    };
    cleanups.set(host,cleanup);
    return cleanup;
  };
  new MutationObserver(()=>{
    for(const [host,cleanup]of cleanups)if(!host.isConnected)cleanup();
  }).observe(document.documentElement,{childList:true,subtree:true});
})();
