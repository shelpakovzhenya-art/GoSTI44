(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,15057,75254,46897,e=>{"use strict";var t=e.i(71645);let r=(...e)=>e.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim();var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,t.forwardRef)(({color:e="currentColor",size:i=24,strokeWidth:a=2,absoluteStrokeWidth:o,className:s="",children:l,iconNode:u,...c},d)=>(0,t.createElement)("svg",{ref:d,...n,width:i,height:i,stroke:e,strokeWidth:o?24*Number(a)/Number(i):a,className:r("lucide",s),...c},[...u.map(([e,r])=>(0,t.createElement)(e,r)),...Array.isArray(l)?l:[l]])),a=(e,n)=>{let a=(0,t.forwardRef)(({className:a,...o},s)=>(0,t.createElement)(i,{ref:s,iconNode:n,className:r(`lucide-${e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,a),...o}));return a.displayName=`${e}`,a};e.s(["default",0,a],75254);let o=a("ArrowUpRight",[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]]);e.s(["ArrowUpRight",0,o],15057);let s=a("MapPin",[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]]);e.s(["MapPin",0,s],46897)},92161,e=>{"use strict";let t=(0,e.i(75254).default)("Menu",[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]]);e.s(["Menu",0,t],92161)},43432,e=>{"use strict";let t=(0,e.i(75254).default)("Phone",[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]]);e.s(["Phone",0,t],43432)},22016,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return y},useLinkStatus:function(){return v}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});let a=e.r(90809),o=e.r(43476),s=a._(e.r(71645)),l=e.r(95057),u=e.r(8372),c=e.r(18581),d=e.r(18967),f=e.r(5550),p=e.r(88540),h=e.r(91949),m=e.r(73668),g=e.r(9396);function y(t){var r;let n,i,a,[y,v]=(0,s.useOptimistic)(h.IDLE_LINK_STATUS),x=(0,s.useRef)(null),{href:j,as:w,children:_,prefetch:P=null,passHref:C,replace:E,shallow:S,scroll:O,onClick:k,onMouseEnter:R,onTouchStart:N,legacyBehavior:M=!1,onNavigate:$,transitionTypes:T,ref:z,unstable_dynamicOnHover:A,...I}=t;n=_,M&&("string"==typeof n||"number"==typeof n)&&(n=(0,o.jsx)("a",{children:n}));let L=s.default.useContext(u.AppRouterContext),U=!1!==P,D=!1===P?"none":!0===P?"full":"auto",F="none"!==D?"auto"===D?g.FetchStrategy.PPR:g.FetchStrategy.Full:g.FetchStrategy.PPR,B="string"==typeof(r=w||j)?r:(0,l.formatUrl)(r);if(M){if(n?.$$typeof===Symbol.for("react.lazy"))throw Object.defineProperty(Error("`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag."),"__NEXT_ERROR_CODE",{value:"E863",enumerable:!1,configurable:!0});i=s.default.Children.only(n)}let q=M?i&&"object"==typeof i&&i.ref:z,W,X=s.default.useCallback(e=>(null!==L&&(x.current=(0,h.mountLinkInstance)(e,B,L,F,U,v,W)),()=>{x.current&&((0,h.unmountLinkForCurrentNavigation)(x.current),x.current=null),(0,h.unmountPrefetchableInstance)(e)}),[U,B,L,F,v,W]),V={ref:(0,c.useMergedRef)(X,q),onClick(t){M||"function"!=typeof k||k(t),M&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(t),!L||t.defaultPrevented||function(t,r,n,i,a,o,l,u="none"){if("u">typeof window){let c,{nodeName:d}=t.currentTarget;if("A"===d.toUpperCase()&&((c=t.currentTarget.getAttribute("target"))&&"_self"!==c||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.nativeEvent&&2===t.nativeEvent.which)||t.currentTarget.hasAttribute("download"))return;if(!(0,m.isLocalURL)(r)){i&&(t.preventDefault(),location.replace(r));return}if(t.preventDefault(),o){let e=!1;if(o({preventDefault:()=>{e=!0}}),e)return}let{dispatchNavigateAction:f}=e.r(99781);s.default.startTransition(()=>{f(r,i?"replace":"push",!1===a?p.ScrollBehavior.NoScroll:p.ScrollBehavior.Default,n.current,l,u)})}}(t,B,x,E,O,$,T,D)},onMouseEnter(e){M||"function"!=typeof R||R(e),M&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),L&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===A)},onTouchStart:function(e){M||"function"!=typeof N||N(e),M&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),L&&U&&(0,h.onNavigationIntent)(e.currentTarget,!0===A)}};return(0,d.isAbsoluteUrl)(B)?V.href=B:M&&!C&&("a"!==i.type||"href"in i.props)||(V.href=(0,f.addBasePath)(B)),a=M?s.default.cloneElement(i,V):(0,o.jsx)("a",{...I,...V,children:n}),(0,o.jsx)(b.Provider,{value:y,children:a})}let b=(0,s.createContext)(h.IDLE_LINK_STATUS),v=()=>(0,s.useContext)(b);("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},5500,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"Image",{enumerable:!0,get:function(){return j}});let n=e.r(55682),i=e.r(90809),a=e.r(43476),o=i._(e.r(71645)),s=n._(e.r(74080)),l=n._(e.r(25633)),u=e.r(8927),c=e.r(87690),d=e.r(18556),f=e.r(65856),p=n._(e.r(1948)),h=e.r(18581),m={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0};function g(e,t,r,n,i,a,o){let s=e?.src;e&&e["data-loaded-src"]!==s&&(e["data-loaded-src"]=s,("decode"in e?e.decode():Promise.resolve()).catch(()=>{}).then(()=>{if(e.parentElement&&e.isConnected){if("empty"!==t&&i(!0),r?.current){let t=new Event("load");Object.defineProperty(t,"target",{writable:!1,value:e});let n=!1,i=!1;r.current({...t,nativeEvent:t,currentTarget:e,target:e,isDefaultPrevented:()=>n,isPropagationStopped:()=>i,persist:()=>{},preventDefault:()=>{n=!0,t.preventDefault()},stopPropagation:()=>{i=!0,t.stopPropagation()}})}n?.current&&n.current(e)}}))}function y(e){return o.use?{fetchPriority:e}:{fetchpriority:e}}"u"<typeof window&&(globalThis.__NEXT_IMAGE_IMPORTED=!0);let b="u"<typeof window?o.useEffect:o.useLayoutEffect,v=(0,o.forwardRef)(({src:e,srcSet:t,sizes:r,height:n,width:i,decoding:s,className:l,style:u,fetchPriority:c,placeholder:d,loading:f,unoptimized:p,fill:m,onLoadRef:v,onLoadingCompleteRef:x,setBlurComplete:j,setShowAltText:w,sizesInput:_,onLoad:P,onError:C,...E},S)=>{let O=(0,o.useRef)(!1),k=(0,o.useRef)(null);b(()=>{let{current:e}=O,{current:t}=k;e||null===t||(C&&(t.src=t.src),t.complete&&g(t,d,v,x,j,p,_),O.current=!0)},[e,d,v,x,C,p,_]);let R=(0,h.useMergedRef)(S,k);return(0,a.jsx)("img",{...E,...y(c),loading:f,width:i,height:n,decoding:s,"data-nimg":m?"fill":"1",className:l,style:u,sizes:r,srcSet:t,src:e,ref:R,onLoad:e=>{g(e.currentTarget,d,v,x,j,p,_)},onError:e=>{w(!0),"empty"!==d&&j(!0),C&&C(e)}})});function x({isAppRouter:e,imgAttributes:t}){let r={as:"image",imageSrcSet:t.srcSet,imageSizes:t.sizes,crossOrigin:t.crossOrigin,referrerPolicy:t.referrerPolicy,...y(t.fetchPriority)};return e&&s.default.preload?(s.default.preload(t.src,r),null):(0,a.jsx)(l.default,{children:(0,a.jsx)("link",{rel:"preload",href:t.srcSet?void 0:t.src,...r},"__nimg-"+t.src+t.srcSet+t.sizes)})}let j=(0,o.forwardRef)((e,t)=>{let r=(0,o.useContext)(f.RouterContext),n=(0,o.useContext)(d.ImageConfigContext),i=(0,o.useMemo)(()=>{let e=m||n||c.imageConfigDefault,t=[...e.deviceSizes,...e.imageSizes].sort((e,t)=>e-t),r=e.deviceSizes.sort((e,t)=>e-t),i=e.qualities?.sort((e,t)=>e-t);return{...e,allSizes:t,deviceSizes:r,qualities:i,localPatterns:"u"<typeof window?n?.localPatterns:e.localPatterns}},[n]),{onLoad:s,onLoadingComplete:l}=e,h=(0,o.useRef)(s);(0,o.useEffect)(()=>{h.current=s},[s]);let g=(0,o.useRef)(l);(0,o.useEffect)(()=>{g.current=l},[l]);let[y,b]=(0,o.useState)(!1),[j,w]=(0,o.useState)(!1),{props:_,meta:P}=(0,u.getImgProps)(e,{defaultLoader:p.default,imgConf:i,blurComplete:y,showAltText:j});return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(v,{..._,unoptimized:P.unoptimized,placeholder:P.placeholder,fill:P.fill,onLoadRef:h,onLoadingCompleteRef:g,setBlurComplete:b,setShowAltText:w,sizesInput:e.sizes,ref:t}),P.preload?(0,a.jsx)(x,{isAppRouter:!r,imgAttributes:_}):null]})});("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},18581,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"useMergedRef",{enumerable:!0,get:function(){return i}});let n=e.r(71645);function i(e,t){let r=(0,n.useRef)(null),i=(0,n.useRef)(null);return(0,n.useCallback)(n=>{if(null===n){let e=r.current;e&&(r.current=null,e());let t=i.current;t&&(i.current=null,t())}else e&&(r.current=a(e,n)),t&&(i.current=a(t,n))},[e,t])}function a(e,t){if("function"!=typeof e)return e.current=t,()=>{e.current=null};{let r=e(t);return"function"==typeof r?r:()=>e(null)}}("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},70965,(e,t,r)=>{"use strict";function n(e,t){let r=e||75;return t?.qualities?.length?t.qualities.reduce((e,t)=>Math.abs(t-r)<Math.abs(e-r)?t:e,t.qualities[0]):r}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"findClosestQuality",{enumerable:!0,get:function(){return n}})},1948,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return o}});let n=e.r(70965),i=e.r(43369);function a({config:e,src:t,width:r,quality:o}){let s=(0,i.getDeploymentId)();if(t.startsWith("/")&&!t.startsWith("//"))if(t.includes("/_next/static/immutable")&&!(0,i.getAssetToken)())s=void 0;else{let e=t.indexOf("?");if(-1!==e){let r=new URLSearchParams(t.slice(e+1)),n=r.get("dpl");if(n){s=n,r.delete("dpl");let i=r.toString();t=t.slice(0,e)+(i?"?"+i:"")}}}if(t.startsWith("/")&&t.includes("?")&&e.localPatterns?.length===1&&"**"===e.localPatterns[0].pathname&&""===e.localPatterns[0].search)throw Object.defineProperty(Error(`Image with src "${t}" is using a query string which is not configured in images.localPatterns.
Read more: https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns`),"__NEXT_ERROR_CODE",{value:"E871",enumerable:!1,configurable:!0});let l=(0,n.findClosestQuality)(o,e);return`${e.path}?url=${encodeURIComponent(t)}&w=${r}&q=${l}${t.startsWith("/")&&s?`&dpl=${s}`:""}`}a.__next_img_default=!0;let o=a},25633,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return m},defaultHead:function(){return d}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});let a=e.r(55682),o=e.r(90809),s=e.r(43476),l=o._(e.r(71645)),u=a._(e.r(98879)),c=e.r(42732);function d(){return[(0,s.jsx)("meta",{charSet:"utf-8"},"charset"),(0,s.jsx)("meta",{name:"viewport",content:"width=device-width"},"viewport")]}function f(e,t){return"string"==typeof t||"number"==typeof t?e:t.type===l.default.Fragment?e.concat(l.default.Children.toArray(t.props.children).reduce((e,t)=>"string"==typeof t||"number"==typeof t?e:e.concat(t),[])):e.concat(t)}let p=["name","httpEquiv","charSet","itemProp"];function h(e){let t,r,n,i;return e.reduce(f,[]).reverse().concat(d().reverse()).filter((t=new Set,r=new Set,n=new Set,i={},e=>{let a=!0,o=!1;if(e.key&&"number"!=typeof e.key&&e.key.indexOf("$")>0){o=!0;let r=e.key.slice(e.key.indexOf("$")+1);t.has(r)?a=!1:t.add(r)}switch(e.type){case"title":case"base":r.has(e.type)?a=!1:r.add(e.type);break;case"meta":for(let t=0,r=p.length;t<r;t++){let r=p[t];if(e.props.hasOwnProperty(r))if("charSet"===r)n.has(r)?a=!1:n.add(r);else{let t=e.props[r],n=i[r]||new Set;("name"!==r||!o)&&n.has(t)?a=!1:(n.add(t),i[r]=n)}}}return a})).reverse().map((e,t)=>{let r=e.key||t;return l.default.cloneElement(e,{key:r})})}let m=function({children:e}){let t=(0,l.useContext)(c.HeadManagerContext);return(0,s.jsx)(u.default,{reduceComponentsToState:h,headManager:t,children:e})};("function"==typeof r.default||"object"==typeof r.default&&null!==r.default)&&void 0===r.default.__esModule&&(Object.defineProperty(r.default,"__esModule",{value:!0}),Object.assign(r.default,r),t.exports=r.default)},88143,(e,t,r)=>{"use strict";function n({widthInt:e,heightInt:t,blurWidth:r,blurHeight:i,blurDataURL:a,objectFit:o}){let s=r?40*r:e,l=i?40*i:t,u=s&&l?`viewBox='0 0 ${s} ${l}'`:"";return`%3Csvg xmlns='http://www.w3.org/2000/svg' ${u}%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='${u?"none":"contain"===o?"xMidYMid":"cover"===o?"xMidYMid slice":"none"}' style='filter: url(%23b);' href='${a}'/%3E%3C/svg%3E`}Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImageBlurSvg",{enumerable:!0,get:function(){return n}})},87690,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={VALID_LOADERS:function(){return a},imageConfigDefault:function(){return o}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});let a=["default","imgix","cloudinary","akamai","custom"],o={deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],path:"/_next/image",loader:"default",loaderFile:"",domains:[],disableStaticImages:!1,minimumCacheTTL:14400,formats:["image/webp"],maximumDiskCacheSize:void 0,maximumRedirects:3,maximumResponseBody:5e7,dangerouslyAllowLocalIP:!1,dangerouslyAllowSVG:!1,contentSecurityPolicy:"script-src 'none'; frame-src 'none'; sandbox;",contentDispositionType:"attachment",localPatterns:void 0,remotePatterns:[],qualities:[75],unoptimized:!1,customCacheHandler:!1}},8927,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"getImgProps",{enumerable:!0,get:function(){return u}});let n=e.r(43369),i=e.r(88143),a=e.r(87690),o=["-moz-initial","fill","none","scale-down",void 0];function s(e){return void 0!==e.default}function l(e){return void 0===e?e:"number"==typeof e?Number.isFinite(e)?e:NaN:"string"==typeof e&&/^[0-9]+$/.test(e)?parseInt(e,10):NaN}function u({src:e,sizes:t,unoptimized:r=!1,priority:c=!1,preload:d=!1,loading:f,className:p,quality:h,width:m,height:g,fill:y=!1,style:b,overrideSrc:v,onLoad:x,onLoadingComplete:j,placeholder:w="empty",blurDataURL:_,fetchPriority:P,decoding:C="async",layout:E,objectFit:S,objectPosition:O,lazyBoundary:k,lazyRoot:R,...N},M){var $;let T,z,A,{imgConf:I,showAltText:L,blurComplete:U,defaultLoader:D}=M,F=I||a.imageConfigDefault;if("allSizes"in F)T=F;else{let e=[...F.deviceSizes,...F.imageSizes].sort((e,t)=>e-t),t=F.deviceSizes.sort((e,t)=>e-t),r=F.qualities?.sort((e,t)=>e-t);T={...F,allSizes:e,deviceSizes:t,qualities:r}}if(void 0===D)throw Object.defineProperty(Error("images.loaderFile detected but the file is missing default export.\nRead more: https://nextjs.org/docs/messages/invalid-images-config"),"__NEXT_ERROR_CODE",{value:"E163",enumerable:!1,configurable:!0});let B=N.loader||D;delete N.loader,delete N.srcSet;let q="__next_img_default"in B;if(q){if("custom"===T.loader)throw Object.defineProperty(Error(`Image with src "${e}" is missing "loader" prop.
Read more: https://nextjs.org/docs/messages/next-image-missing-loader`),"__NEXT_ERROR_CODE",{value:"E252",enumerable:!1,configurable:!0})}else{let e=B;B=t=>{let{config:r,...n}=t;return e(n)}}if(E){"fill"===E&&(y=!0);let e={intrinsic:{maxWidth:"100%",height:"auto"},responsive:{width:"100%",height:"auto"}}[E];e&&(b={...b,...e});let r={responsive:"100vw",fill:"100vw"}[E];r&&!t&&(t=r)}let W="",X=l(m),V=l(g);if(($=e)&&"object"==typeof $&&(s($)||void 0!==$.src)){let t=s(e)?e.default:e;if(!t.src)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include src. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E460",enumerable:!1,configurable:!0});if(!t.height||!t.width)throw Object.defineProperty(Error(`An object should only be passed to the image component src parameter if it comes from a static image import. It must include height and width. Received ${JSON.stringify(t)}`),"__NEXT_ERROR_CODE",{value:"E48",enumerable:!1,configurable:!0});if(z=t.blurWidth,A=t.blurHeight,_=_||t.blurDataURL,W=t.src,!y)if(X||V){if(X&&!V){let e=X/t.width;V=Math.round(t.height*e)}else if(!X&&V){let e=V/t.height;X=Math.round(t.width*e)}}else X=t.width,V=t.height}let K=!c&&!d&&("lazy"===f||void 0===f);(!(e="string"==typeof e?e:W)||e.startsWith("data:")||e.startsWith("blob:"))&&(r=!0,K=!1),T.unoptimized&&(r=!0),q&&!T.dangerouslyAllowSVG&&e.split("?",1)[0].endsWith(".svg")&&(r=!0);let G=l(h),H=Object.assign(y?{position:"absolute",height:"100%",width:"100%",left:0,top:0,right:0,bottom:0,objectFit:S,objectPosition:O}:{},L?{}:{color:"transparent"},b),Z=U||"empty"===w?null:"blur"===w?`url("data:image/svg+xml;charset=utf-8,${(0,i.getImageBlurSvg)({widthInt:X,heightInt:V,blurWidth:z,blurHeight:A,blurDataURL:_||"",objectFit:H.objectFit})}")`:`url("${w}")`,Q=o.includes(H.objectFit)?"fill"===H.objectFit?"100% 100%":"cover":H.objectFit,J=Z?{backgroundSize:Q,backgroundPosition:H.objectPosition||"50% 50%",backgroundRepeat:"no-repeat",backgroundImage:Z}:{},Y=function({config:e,src:t,unoptimized:r,width:i,quality:a,sizes:o,loader:s}){if(r){if(t.startsWith("/")&&!t.startsWith("//")){let e=(0,n.getDeploymentId)();if(t.includes("/_next/static/immutable")&&!(0,n.getAssetToken)())e=void 0;else if(e){let r=t.indexOf("?");if(-1!==r){let n=new URLSearchParams(t.slice(r+1));n.get("dpl")||(n.append("dpl",e),t=t.slice(0,r)+"?"+n.toString())}else t+=`?dpl=${e}`}}return{src:t,srcSet:void 0,sizes:void 0}}let{widths:l,kind:u}=function({deviceSizes:e,allSizes:t},r,n){if(n){let r=/(^|\s)(1?\d?\d)vw/g,i=[];for(let e;e=r.exec(n);)i.push(parseInt(e[2]));if(i.length){let r=.01*Math.min(...i);return{widths:t.filter(t=>t>=e[0]*r),kind:"w"}}return{widths:t,kind:"w"}}return"number"!=typeof r?{widths:e,kind:"w"}:{widths:[...new Set([r,2*r].map(e=>t.find(t=>t>=e)||t[t.length-1]))],kind:"x"}}(e,i,o),c=l.length-1;return{sizes:o||"w"!==u?o:"100vw",srcSet:l.map((r,n)=>`${s({config:e,src:t,quality:a,width:r})} ${"w"===u?r:n+1}${u}`).join(", "),src:s({config:e,src:t,quality:a,width:l[c]})}}({config:T,src:e,unoptimized:r,width:X,quality:G,sizes:t,loader:B}),ee=K?"lazy":f;return{props:{...N,loading:ee,fetchPriority:P,width:X,height:V,decoding:C,className:p,style:{...H,...J},sizes:Y.sizes,srcSet:Y.srcSet,src:v||Y.src},meta:{unoptimized:r,preload:d||c,placeholder:w,fill:y}}}},18556,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"ImageConfigContext",{enumerable:!0,get:function(){return a}});let n=e.r(55682)._(e.r(71645)),i=e.r(87690),a=n.default.createContext(i.imageConfigDefault)},65856,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"RouterContext",{enumerable:!0,get:function(){return n}});let n=e.r(55682)._(e.r(71645)).default.createContext(null)},94909,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={default:function(){return c},getImageProps:function(){return u}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});let a=e.r(55682),o=e.r(8927),s=e.r(5500),l=a._(e.r(1948));function u(e){let{props:t}=(0,o.getImgProps)(e,{defaultLoader:l.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[32,48,64,96,128,256,384],qualities:[75],path:"/_next/image",loader:"default",dangerouslyAllowSVG:!1,unoptimized:!0}});for(let[e,r]of Object.entries(t))void 0===r&&delete t[e];return{props:t}}let c=s.Image},57688,(e,t,r)=>{t.exports=e.r(94909)},73668,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"isLocalURL",{enumerable:!0,get:function(){return a}});let n=e.r(18967),i=e.r(52817);function a(e){if(!(0,n.isAbsoluteUrl)(e))return!0;try{let t=(0,n.getLocationOrigin)(),r=new URL(e,t);return r.origin===t&&(0,i.hasBasePath)(r.pathname)}catch(e){return!1}}},98183,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var n={assign:function(){return l},searchParamsToUrlQuery:function(){return a},urlQueryToSearchParams:function(){return s}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});function a(e){let t={};for(let[r,n]of e.entries()){let e=t[r];void 0===e?t[r]=n:Array.isArray(e)?e.push(n):t[r]=[e,n]}return t}function o(e){return"string"==typeof e?e:("number"!=typeof e||isNaN(e))&&"boolean"!=typeof e?"":String(e)}function s(e){let t=new URLSearchParams;for(let[r,n]of Object.entries(e))if(Array.isArray(n))for(let e of n)t.append(r,o(e));else t.set(r,o(n));return t}function l(e,...t){for(let r of t){for(let t of r.keys())e.delete(t);for(let[t,n]of r.entries())e.append(t,n)}return e}},95057,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={formatUrl:function(){return s},formatWithValidation:function(){return u},urlObjectKeys:function(){return l}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});let a=e.r(90809)._(e.r(98183)),o=/https?|ftp|gopher|file/;function s(e){let{auth:t,hostname:r}=e,n=e.protocol||"",i=e.pathname||"",s=e.hash||"",l=e.query||"",u=!1;t=t?encodeURIComponent(t).replace(/%3A/i,":")+"@":"",e.host?u=t+e.host:r&&(u=t+(~r.indexOf(":")?`[${r}]`:r),e.port&&(u+=":"+e.port)),l&&"object"==typeof l&&(l=String(a.urlQueryToSearchParams(l)));let c=e.search||l&&`?${l}`||"";return n&&!n.endsWith(":")&&(n+=":"),e.slashes||(!n||o.test(n))&&!1!==u?(u="//"+(u||""),i&&"/"!==i[0]&&(i="/"+i)):u||(u=""),s&&"#"!==s[0]&&(s="#"+s),c&&"?"!==c[0]&&(c="?"+c),i=i.replace(/[?#]/g,encodeURIComponent),c=c.replace("#","%23"),`${n}${u}${i}${c}${s}`}let l=["auth","hash","host","hostname","href","path","pathname","port","protocol","query","search","slashes"];function u(e){return s(e)}},98879,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"default",{enumerable:!0,get:function(){return s}});let n=e.r(71645),i="u"<typeof window,a=i?()=>{}:n.useLayoutEffect,o=i?()=>{}:n.useEffect;function s(e){let{headManager:t,reduceComponentsToState:r}=e;function s(){if(t&&t.mountedInstances){let e=n.Children.toArray(Array.from(t.mountedInstances).filter(Boolean));t.updateHead(r(e))}}return i&&(t?.mountedInstances?.add(e.children),s()),a(()=>(t?.mountedInstances?.add(e.children),()=>{t?.mountedInstances?.delete(e.children)})),a(()=>(t&&(t._pendingUpdate=s),()=>{t&&(t._pendingUpdate=s)})),o(()=>(t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null),()=>{t&&t._pendingUpdate&&(t._pendingUpdate(),t._pendingUpdate=null)})),null}},18967,(e,t,r)=>{"use strict";e.i(47167),Object.defineProperty(r,"__esModule",{value:!0});var n={DecodeError:function(){return y},MiddlewareNotFoundError:function(){return j},MissingStaticPage:function(){return x},NormalizeError:function(){return b},PageNotFoundError:function(){return v},SP:function(){return m},ST:function(){return g},WEB_VITALS:function(){return a},execOnce:function(){return o},getDisplayName:function(){return d},getLocationOrigin:function(){return u},getURL:function(){return c},isAbsoluteUrl:function(){return l},isResSent:function(){return f},loadGetInitialProps:function(){return h},normalizeRepeatedSlashes:function(){return p},stringifyError:function(){return w}};for(var i in n)Object.defineProperty(r,i,{enumerable:!0,get:n[i]});let a=["CLS","FCP","FID","INP","LCP","TTFB"];function o(e){let t,r=!1;return(...n)=>(r||(r=!0,t=e(...n)),t)}let s=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,l=e=>{let t=e.charCodeAt(0);return!!(t>=65&&t<=90||t>=97&&t<=122)&&s.test(e)};function u(){let{protocol:e,hostname:t,port:r}=window.location;return`${e}//${t}${r?":"+r:""}`}function c(){let{href:e}=window.location,t=u();return e.substring(t.length)}function d(e){return"string"==typeof e?e:e.displayName||e.name||"Unknown"}function f(e){return e.finished||e.headersSent}function p(e){let t=e.split("?");return t[0].replace(/\\/g,"/").replace(/\/\/+/g,"/")+(t[1]?`?${t.slice(1).join("?")}`:"")}async function h(e,t){let r=t.res||t.ctx&&t.ctx.res;if(!e.getInitialProps)return t.ctx&&t.Component?{pageProps:await h(t.Component,t.ctx)}:{};let n=await e.getInitialProps(t);if(r&&f(r))return n;if(!n)throw Object.defineProperty(Error(`"${d(e)}.getInitialProps()" should resolve to an object. But found "${n}" instead.`),"__NEXT_ERROR_CODE",{value:"E1025",enumerable:!1,configurable:!0});return n}let m="u">typeof performance,g=m&&["mark","measure","getEntriesByName"].every(e=>"function"==typeof performance[e]);class y extends Error{}class b extends Error{}class v extends Error{constructor(e){super(),this.code="ENOENT",this.name="PageNotFoundError",this.message=`Cannot find module for page: ${e}`}}class x extends Error{constructor(e,t){super(),this.message=`Failed to load static file for page: ${e} ${t}`}}class j extends Error{constructor(){super(),this.code="ENOENT",this.message="Cannot find the middleware module"}}function w(e){return JSON.stringify({message:e.message,stack:e.stack})}},43101,e=>{"use strict";var t=e.i(43476),r=e.i(43210),n=e.i(1295);e.s(["Brand",0,function({href:e="#top"}={}){return(0,t.jsxs)("a",{className:"wordmark brand-lockup",href:e,"aria-label":"Танжерин — на главную",children:[(0,t.jsx)(n.default,{className:"brand-fruit",src:"/brand/tangerines.webp",alt:"",width:66,height:66,priority:!0}),(0,t.jsxs)("span",{className:"brand-type",children:[(0,t.jsx)("span",{children:(0,t.jsx)(r.CmsText,{id:"brand.001"})}),(0,t.jsx)("small",{children:(0,t.jsx)(r.CmsText,{id:"brand.002"})})]})]})},"Foliage",0,function({className:e="",fruit:r=!1,variant:i,eager:a=!1,asset:o}){return(0,t.jsx)("div",{className:`foliage ${e}`,"aria-hidden":"true",children:(0,t.jsx)(n.default,{src:`/brand/${o??({leaves:"citrus-leaves",lemons:"jasmine-arc",palm:"palm-frond",fruit:"tangerines"})[i??(r?"fruit":"leaves")]}.webp`,alt:"",fill:!0,loading:a?"eager":"lazy",sizes:"(max-width:760px) 200px, 420px"})})}])},43210,43788,e=>{"use strict";var t=e.i(43476),r=e.i(71645);let n=(0,r.createContext)(null),i=()=>(0,r.useContext)(n);e.s(["EditingContext",0,n,"useVisualEditing",0,i],43788);let a=(0,r.createContext)(null);function o(){let e=(0,r.useContext)(a);if(!e)throw Error("ContentProvider is required");return e}function s({id:e,value:n,uppercase:a=!1}){let o=i(),l=o?.values[e]??n,u=a?l.toUpperCase():l;return o?.keys.has(e)?(0,r.createElement)("cms-text",{"data-cms-key":e,"data-cms-selected":o.selected===e,tabIndex:0,role:"button","aria-label":`Редактировать: ${l||"пустой текст"}`,onClick:t=>{t.preventDefault(),t.stopPropagation(),o.select(e)},onKeyDown:t=>{("Enter"===t.key||" "===t.key)&&(t.preventDefault(),t.stopPropagation(),o.select(e))}},u):(0,t.jsx)(t.Fragment,{children:u})}e.s(["CmsText",0,function({id:e,fallback:r=""}){let{texts:n}=o();return(0,t.jsx)(s,{id:e,value:n[e]??r})},"ContentProvider",0,function({content:e,children:r}){return(0,t.jsx)(a.Provider,{value:e,children:r})},"EditableText",0,s,"useSite",0,o],43210)},1295,e=>{"use strict";var t=e.i(43476),r=e.i(57688),n=e.i(43210);e.s(["default",0,function(e){let{images:i}=(0,n.useSite)(),a="string"==typeof e.src?i[e.src]:void 0,o="string"==typeof e.src?e.src:"",s=/\/images\/(hero|veranda)\.jpg$/.test(o)?"outdoor":/\/images\/spa-sauna\.jpg$/.test(o)?"sauna":/\/images\/(family|business|lux|spa-tea)(-bedroom|-living)?\.jpg$/.test(o)?"interior":void 0;return(0,t.jsx)(r.default,{...e,"data-photo-tone":s,src:a?.src||e.src,alt:""===e.alt?"":a?.alt||e.alt})}])},79996,e=>{"use strict";var t=e.i(43476),r=e.i(43210),n=e.i(57688);e.s(["ContactLinks",0,function({labels:e=!1,socialOnly:i=!1,includeMax:a=!0,hideVk:o=!1}){let{site:s}=(0,r.useSite)(),l=[{name:"Telegram",label:"Написать в Telegram",href:s.telegram,className:"social-telegram",path:"M21.4 3.3 18.2 20c-.2 1.2-.9 1.5-1.8.9l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.4-5L17.6 7c.4-.4-.1-.6-.6-.3L5.8 13.8 1 12.3c-1-.3-1-1 .2-1.4L20 3.1c.9-.3 1.7.2 1.4.2Z"},{name:"ВКонтакте",label:"Связаться во ВКонтакте",href:s.vk,className:"social-vk",path:"M12.7 19C4.5 19 0 13.4 0 4h4.1c0 6.9 2.9 9.8 5.2 10.4V4h3.9v5.9c2.3-.3 4.7-3 5.5-5.9h3.9c-.6 3.5-3.2 6.2-5 7.3 1.8.9 4.7 3.3 5.8 7.7h-4.3c-.9-2.9-3.1-5.1-5.9-5.4V19h-.5Z"},...a?[{name:"MAX",label:"Открыть MAX",href:s.max||"https://max.ru/",className:"social-max",image:"/brand/max-official-20260929.png"}]:[],{name:"Маршрут",label:"Маршрут до Танжерина в Яндекс Картах",href:s.route,className:"social-yandex",path:"M12 1a8 8 0 0 0-8 8c0 5.5 8 14 8 14s8-8.5 8-14a8 8 0 0 0-8-8Zm0 11.3a3.3 3.3 0 1 1 0-6.6 3.3 3.3 0 0 1 0 6.6Z"}].filter(e=>e.href&&(!i||"social-yandex"!==e.className));return(0,t.jsx)("div",{className:`contact-links ${e?"contact-links-labeled":""}`,children:l.map(r=>(0,t.jsxs)("a",{className:`social-link ${r.className}`,href:r.href,"aria-label":r.label,title:r.label,target:"_blank",rel:"noreferrer",children:[(0,t.jsx)("span",{className:"social-icon",children:r.image?(0,t.jsx)(n.default,{className:"max-logo",src:r.image,alt:"",width:24,height:24,"aria-hidden":"true"}):(0,t.jsx)("svg",{viewBox:"0 0 24 24",width:"22",height:"22",fill:"currentColor","aria-hidden":"true",children:(0,t.jsx)("path",{d:r.path})})}),e&&(0,t.jsx)("span",{children:r.name})]},r.name))})}])},73477,37727,e=>{"use strict";var t=e.i(43476),r=e.i(43210),n=e.i(71645),i=e.i(15057),a=e.i(46897),o=e.i(92161),s=e.i(43432);let l=(0,e.i(75254).default)("X",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);e.s(["X",0,l],37727);var u=e.i(43101),c=e.i(79996);function d(e,t){if(/^(https?:|mailto:|tel:|\/)/.test(e))return e;let r=e.startsWith("#")?e:`#${e}`;return t?`/${r}`:r}e.s(["Navigation",0,function({subpage:e=!1}){let{site:f,links:p}=(0,r.useSite)(),h=p.slice(0,4),m=p.slice(4),[g,y]=(0,n.useState)(!1),[b,v]=(0,n.useState)(!1),x=(0,n.useRef)(null);return(0,n.useEffect)(()=>{let e=()=>v(window.scrollY>60);return e(),window.addEventListener("scroll",e,{passive:!0}),()=>window.removeEventListener("scroll",e)},[]),(0,t.jsxs)(t.Fragment,{children:[e&&(0,t.jsx)("div",{className:"topline",children:(0,t.jsxs)("div",{className:"container topline-inner",children:[(0,t.jsxs)("a",{href:f.route,target:"_blank",rel:"noreferrer",children:[(0,t.jsx)(a.MapPin,{size:16})," ",(0,t.jsx)(r.CmsText,{id:"navigation.001"})]}),(0,t.jsx)("span",{children:(0,t.jsx)(r.CmsText,{id:"navigation.002"})})]})}),(0,t.jsxs)("header",{className:`header${!e?" is-home":""}${b||e?" is-scrolled":""}${e?" is-subpage":""}${g?" menu-open":""}`,onKeyDown:e=>{"Escape"===e.key&&g&&(y(!1),x.current?.focus())},children:[(0,t.jsxs)("div",{className:"container header-inner",children:[(0,t.jsx)(u.Brand,{href:e?"/":"#top"}),(0,t.jsx)("nav",{className:"desktop-nav","aria-label":"Основная навигация",children:[h.map(([r,n])=>(0,t.jsx)("a",{href:d(n,e),children:r},n)),(0,t.jsxs)("details",{className:"header-sections",children:[(0,t.jsx)("summary",{children:(0,t.jsx)(r.CmsText,{id:"navigation.007"})}),(0,t.jsx)("nav",{className:"header-sections-panel",children:m.slice(4,11).map(([r,n])=>(0,t.jsx)("a",{href:d(n,e),children:r},n))})]})]}),(0,t.jsxs)("a",{className:"header-phone",href:f.phoneHref,"aria-label":`Позвонить: ${f.phone}`,children:[(0,t.jsx)(s.Phone,{size:18}),(0,t.jsxs)("span",{children:[f.phone,(0,t.jsx)("small",{children:(0,t.jsx)(r.CmsText,{id:"navigation.003"})})]})]}),(0,t.jsx)(c.ContactLinks,{includeMax:!0,hideVk:!0}),(0,t.jsxs)("a",{className:"button button-yellow header-book",href:e?"/#booking":"#booking",children:[(0,t.jsx)(r.CmsText,{id:"navigation.004"}),(0,t.jsx)(i.ArrowUpRight,{size:16})]}),(0,t.jsx)("button",{ref:x,className:"icon-button menu-toggle","aria-label":g?"Закрыть меню":"Открыть меню","aria-expanded":g,"aria-controls":"mobile-navigation",onClick:()=>y(!g),children:g?(0,t.jsx)(l,{}):(0,t.jsx)(o.Menu,{})})]}),g&&(0,t.jsxs)("nav",{id:"mobile-navigation",className:"mobile-nav","aria-label":"Мобильная навигация",children:[[[0,4,"008"],[4,11,"009"],[11,15,"010"]].map(([start,end,key])=>(0,t.jsxs)("div",{className:"client-menu-group",children:[(0,t.jsx)("h2",{children:(0,t.jsx)(r.CmsText,{id:"navigation."+key})}),...m.slice(start,end).map(([label,href])=>(0,t.jsx)("a",{href:d(href,e),onClick:()=>y(!1),children:label},href))]},key)),(0,t.jsxs)("a",{href:f.phoneHref,children:[(0,t.jsx)(s.Phone,{size:18}),f.phone]}),(0,t.jsxs)("a",{className:"button button-yellow",href:e?"/#booking":"#booking",onClick:()=>y(!1),children:[(0,t.jsx)(r.CmsText,{id:"navigation.005"}),(0,t.jsx)(i.ArrowUpRight,{size:18})]}),(0,t.jsx)(c.ContactLinks,{labels:!0,includeMax:!0,hideVk:!0})]})]}),(0,t.jsxs)("div",{className:"mobile-bottom",children:[(0,t.jsx)("a",{href:f.phoneHref,"aria-label":"Позвонить в Танжерин",children:(0,t.jsx)(s.Phone,{size:20})}),(0,t.jsxs)("a",{className:"button button-yellow",href:e?"/#booking":"#booking",children:[(0,t.jsx)(r.CmsText,{id:"navigation.006"}),(0,t.jsx)(i.ArrowUpRight,{size:18})]})]})]})}],73477)}]);
/* Production house-gallery enhancement. Uses images and labels from published CMS. */
(() => {
  if (window.__tangerinHouseGallery) return;
  window.__tangerinHouseGallery = true;
  let gallery, index = 0, photos = [], trigger, overflow;
  function open(figure) {
    const section = figure.closest('[data-house-gallery]');
    if (!section) return;
    try { photos = JSON.parse(section.dataset.houseGallery); } catch { return; }
    if (!photos.length) return;
    const labels = JSON.parse(section.dataset.galleryLabels);
    index = Number(figure.dataset.photoIndex || 0);
    trigger = figure;
    gallery = document.createElement('dialog');
    gallery.className = 'house-photo-viewer';
    gallery.setAttribute('aria-label', labels.title);
    const frame = document.createElement('div');
    frame.className = 'house-photo-viewer-frame';
    const toolbar = document.createElement('div');
    toolbar.className = 'house-photo-viewer-toolbar';
    const count = document.createElement('span');
    count.className = 'house-photo-viewer-count';
    count.setAttribute('aria-live', 'polite');
    function button(label, text, action, cls) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = cls; b.setAttribute('aria-label', label);
      b.textContent = text; b.addEventListener('click', action); return b;
    }
    const close = button(labels.close, '×', () => gallery.close(), 'house-photo-viewer-close');
    toolbar.append(count, close);
    const photo = document.createElement('img');
    photo.className = 'house-photo-viewer-image';
    const stage = document.createElement('div');
    stage.className = 'house-photo-viewer-stage';
    const caption = document.createElement('p');
    caption.className = 'house-photo-viewer-caption';
    function show(step = 0) {
      index = (index + step + photos.length) % photos.length;
      photo.src = photos[index].src;
      photo.alt = photos[index].alt;
      caption.textContent = photos[index].alt;
      count.textContent = `${index + 1} / ${photos.length}`;
      const preload = new Image(); preload.src = photos[(index + 1) % photos.length].src;
    }
    stage.append(button(labels.prev, '‹', () => show(-1), 'house-photo-viewer-prev'), photo,
      button(labels.next, '›', () => show(1), 'house-photo-viewer-next'));
    frame.append(toolbar, stage, caption); gallery.append(frame); document.body.append(gallery);
    overflow = document.body.style.overflow;
    gallery.addEventListener('close', () => {
      document.body.style.overflow = overflow; gallery.remove(); trigger?.focus({preventScroll:true});
    }, {once:true});
    gallery.addEventListener('click', e => { if (e.target === gallery) gallery.close(); });
    gallery.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault(); show(e.key === 'ArrowRight' ? 1 : -1);
      }
    });
    let touchX;
    stage.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, {passive:true});
    stage.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) show(dx < 0 ? 1 : -1);
    }, {passive:true});
    show(); gallery.showModal(); document.body.style.overflow = 'hidden'; close.focus();
  }
  document.addEventListener('click', e => {
    const figure = e.target.closest?.('[data-house-gallery] [data-photo-index]');
    if (figure) open(figure);
  });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const figure = e.target.closest?.('[data-house-gallery] [data-photo-index]');
    if (figure) { e.preventDefault(); open(figure); }
  });
})();


/* The photo rail belongs only to the client-reference house layout. */
(()=>{if(window.__tangerinReferenceRail)return;window.__tangerinReferenceRail=true;document.addEventListener('click',event=>{const b=event.target.closest?.('.house-reference [data-ref-scroll]');if(!b)return;const rail=b.closest('.hr-gallery').querySelector('.hr-photo-strip');rail.scrollBy({left:Number(b.dataset.refScroll)*rail.clientWidth*.8,behavior:'smooth'})})})();

/* Tangerin: first-party preference cookie and opt-in external embeds. */
(() => {
  if (window.__tangerinCookies) return;
  const COOKIE = 'tangerin_cookie_choice';
  const VERSION = 1;
  const MAX_AGE = 180 * 24 * 60 * 60;
  let choice = null, copy, banner, dialog, externalToggle, lastFocus, pendingOpen = false;
  const controller = window.__tangerinCookies = { open: () => copy && openSettings() };
  document.addEventListener('click', event => {
    if (!copy && event.target.closest?.('[data-tangerin-embed-settings],.tc-footer-settings-link')) {
      event.preventDefault(); pendingOpen = true;
    }
  });

  function readChoice() {
    try {
      const raw = document.cookie.split('; ').find(x => x.startsWith(COOKIE + '='));
      if (!raw) return null;
      const value = JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1)));
      if (value.v !== VERSION || typeof value.external !== 'boolean' ||
          !Number.isFinite(value.at) || value.at > Date.now() || Date.now() - value.at >= MAX_AGE * 1000) return null;
      return value;
    } catch { return null; }
  }

  function node(tag, cls, text) {
    const item = document.createElement(tag);
    if (cls) item.className = cls;
    if (text) item.textContent = text;
    return item;
  }
  function button(label, action, cls = '') {
    const item = node('button', 'tc-button ' + cls, label);
    item.type = 'button'; item.addEventListener('click', action); return item;
  }
  function syncEmbeds() {
    document.querySelectorAll('[data-tangerin-frame-src]').forEach(host => {
      const frame = host.querySelector('iframe[data-tangerin-external]');
      if (!choice?.external) {
        frame?.remove(); host.classList.remove('tangerin-is-loaded'); return;
      }
      if (frame) return;
      const url = new URL(host.dataset.tangerinFrameSrc, location.origin);
      if (url.protocol !== 'https:' || !['yandex.ru', 'www.yandex.ru'].includes(url.hostname)) return;
      const embed = document.createElement('iframe');
      embed.dataset.tangerinExternal = 'true';
      embed.title = host.dataset.tangerinFrameTitle || copy.externalTitle;
      embed.loading = 'lazy'; embed.referrerPolicy = 'strict-origin-when-cross-origin';
      embed.allowFullscreen = true; embed.src = url.href;
      host.append(embed); host.classList.add('tangerin-is-loaded');
    });
  }
  function setChoice(external) {
    choice = {v: VERSION, external, at: Date.now()};
    try {
      document.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(choice)) +
        '; Path=/; Max-Age=' + MAX_AGE + '; SameSite=Lax' + (location.protocol === 'https:' ? '; Secure' : '');
    } catch { /* The explicit choice still works for this page if storage is blocked. */ }
    banner.hidden = true;
    if (dialog.open) dialog.close();
    syncEmbeds();
    const status = document.getElementById('tangerin-cookie-status');
    status.textContent = external ? copy.statusAllow : copy.statusDeny;
    if (!readChoice()) {
      status.textContent += ' ' + copy.storageWarning;
    }
    window.dispatchEvent(new CustomEvent('tangerin:cookie-choice', {detail: {external}}));
  }
  function openSettings() {
    lastFocus = document.activeElement;
    externalToggle.checked = choice?.external === true;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('.tc-close').focus();
  }
  function build() {
    const root = node('div', 'tangerin-cookie-root'); root.id = 'tangerin-cookie-root';
    banner = node('section', 'tc-banner'); banner.setAttribute('aria-label', copy.title);
    banner.setAttribute('aria-labelledby', 'tangerin-cookie-title');
    const text = node('div', 'tc-banner-copy');
    const title = node('h2', '', copy.title); title.id = 'tangerin-cookie-title';
    text.append(title, node('p', '', copy.description));
    const about = button(copy.about, openSettings, 'tc-text-button'); text.append(about);
    const actions = node('div', 'tc-banner-actions');
    actions.append(button(copy.reject, () => setChoice(false), 'tc-secondary'),
      button(copy.accept, () => setChoice(true), 'tc-primary'),
      button(copy.configure, openSettings, 'tc-text-button'));
    banner.append(text, actions); banner.hidden = choice !== null;

    dialog = node('dialog', 'tc-dialog'); dialog.id = 'cookie-settings'; dialog.setAttribute('aria-labelledby', 'tangerin-cookie-dialog-title');
    const head = node('div', 'tc-dialog-head');
    const heading = node('h2', '', copy.dialogTitle); heading.id = 'tangerin-cookie-dialog-title';
    const close = button('×', () => dialog.close(), 'tc-close'); close.setAttribute('aria-label', copy.close);
    head.append(heading, close);
    const necessary = node('div', 'tc-category');
    necessary.append(node('h3', '', copy.technicalTitle), node('p', '', copy.technicalText));
    const external = node('div', 'tc-category');
    const label = node('label', 'tc-toggle');
    externalToggle = node('input'); externalToggle.type = 'checkbox'; externalToggle.checked = false;
    label.append(externalToggle, node('span', '', copy.externalTitle));
    external.append(label, node('p', '', copy.externalText));
    const details = node('details', 'tc-details');
    details.append(node('summary', '', copy.detailsTitle), node('p', '', copy.detailsText));
    const contact = node('a', 'tc-contact', copy.contactLabel); contact.href = 'mailto:sudja2000@list.ru'; details.append(contact);
    const buttons = node('div', 'tc-dialog-actions');
    buttons.append(button(copy.reject, () => setChoice(false), 'tc-secondary'),
      button(copy.save, () => setChoice(externalToggle.checked), 'tc-primary'));
    dialog.append(head, necessary, external, details, buttons);
    dialog.addEventListener('close', () => {
      if (location.hash === '#cookie-settings') history.replaceState(history.state, '', location.pathname + location.search);
      if (lastFocus?.isConnected && lastFocus.getClientRects().length) lastFocus.focus({preventScroll: true});
      else document.querySelector('.tc-footer-settings-link')?.focus({preventScroll: true});
    });
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    const status = node('p', 'tc-status'); status.id = 'tangerin-cookie-status';
    status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    root.append(banner, dialog, status); document.body.append(root);
    syncEmbeds();
    document.addEventListener('click', event => {
      const trigger = event.target.closest?.('[data-tangerin-embed-settings],.tc-footer-settings-link');
      if (trigger) { event.preventDefault(); openSettings(); }
    });
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; syncEmbeds(); });
    }).observe(document.body, {childList: true, subtree: true});
    window.addEventListener('pageshow', () => {
      choice = readChoice(); banner.hidden = choice !== null; syncEmbeds();
    });
    window.addEventListener('hashchange', () => { if (location.hash === '#cookie-settings') openSettings(); });
    if (pendingOpen || location.hash === '#cookie-settings') openSettings();
  }

  async function start() {
    choice = readChoice();
    try {
      const response = await fetch('/api/content', {credentials: 'omit', cache: 'no-store'});
      if (!response.ok) throw new Error('Cookie copy unavailable');
      const data = await response.json();
      const entry = data.entries.find(x => x.key === 'cookies' && x.kind === 'section');
      if (!entry) throw new Error('Cookie copy missing');
      copy = Object.fromEntries(entry.data.texts.map(x => [x.key, x.value]));
      if (!['title','description','accept','reject','settings','save','externalTitle','technicalText'].every(key => typeof copy[key] === 'string' && copy[key])) throw new Error('Cookie copy incomplete');
      build();
    } catch (error) {
      // Fail closed: optional embeds have no src in server or client markup.
      controller.error = true;
      console.error('Не удалось загрузить настройки cookies; внешние виджеты отключены.');
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();

/* Services use separate overview/detail views without duplicating the overview. */
;(() => {
  if (typeof window === 'undefined' || window.__tangerinServiceViews) return;
  window.__tangerinServiceViews = true;
  const prefix = 'sc-uniform-details-';
  let previous = '';
  function render(moveFocus) {
    const root = document.getElementById('additional-services');
    if (!root) return;
    const key = location.hash.slice(1);
    const selected = document.getElementById(prefix + key);
    const active = selected && root.contains(selected) ? key : '';
    root.querySelectorAll('details[id^="' + prefix + '"]').forEach(d => {
      d.open = d === selected;
    });
    if (active) root.setAttribute('data-service-view', active);
    else root.removeAttribute('data-service-view');
    const target = active
      ? document.querySelector('#sc-hero-copy-' + active + ' h1, #sc-hero-copy-' + active + ' h3')
      : document.querySelector('#sc-uniform-' + previous + ' summary') || document.querySelector('#services-heading h1');
    previous = active || previous;
    window.dispatchEvent(new Event('tangerin:serviceview'));
    if (moveFocus && target) {
      if (target.tagName !== 'SUMMARY') target.setAttribute('tabindex', '-1');
      target.focus({preventScroll: true});
      const anchor = active ? document.getElementById('sc-uniform-copy-' + active) : document.getElementById('services-heading');
      if (anchor) window.scrollTo({top: Math.max(0, window.scrollY + anchor.getBoundingClientRect().top - 110), behavior: 'instant'});
    }
  }
  document.addEventListener('click', event => {
    const root = document.getElementById('additional-services');
    if (!root || !(event.target instanceof Element)) return;
    const serviceLink = event.target.closest('a[href]');
    if (serviceLink) {
      const url = new URL(serviceLink.getAttribute('href'), location.href);
      const key = url.hash.slice(1);
      if (url.origin === location.origin && url.pathname === location.pathname && document.getElementById(prefix + key)) {
        event.preventDefault();
        history.pushState(history.state, '', '#' + key);
        render(true);
        return;
      }
    }
    const summary = event.target.closest('summary');
    if (summary && root.contains(summary) && summary.parentElement.id.startsWith(prefix)) {
      event.preventDefault();
      const key = summary.parentElement.id.slice(prefix.length);
      history.pushState(history.state, '', '#' + key);
      render(true);
      return;
    }
    const link = event.target.closest('a[href="#services-heading"]');
    if (link && root.contains(link)) {
      event.preventDefault();
      history.pushState(history.state, '', '#services-heading');
      render(true);
    }
  });
  window.addEventListener('hashchange', () => render(true));
  window.addEventListener('popstate', () => render(true));
  window.addEventListener('load', () => { if (location.hash) render(true); }, {once: true});
  function start() {
    if (document.getElementById('additional-services')) render(Boolean(location.hash));
    let currentRoot = document.getElementById('additional-services');
    new MutationObserver(() => {
      const nextRoot = document.getElementById('additional-services');
      if (nextRoot !== currentRoot) {
        currentRoot = nextRoot;
        if (nextRoot) render(Boolean(location.hash));
      }
    }).observe(document.body, {childList: true, subtree: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();
/* Interaction for the five client-supplied bath photographs. */
;(()=>{
  let originalTitle;
  function title(){
    const root=document.getElementById('additional-services');
    if(!root)return;
    originalTitle ||= document.title;
    const key=location.hash.slice(1)||root.dataset.serviceView||'';
    if(!location.hash&&root.dataset.serviceView)history.replaceState(history.state,'',location.pathname+location.search+'#'+key);
    const panel=document.getElementById('sc-uniform-copy-'+key);
    const expected=panel?.dataset.pageTitle||originalTitle; if(document.title!==expected)document.title=expected;
  }
  document.addEventListener('click',event=>{
    if(event.target.closest?.('a[href="#bath-booking"]')){
      event.preventDefault();document.getElementById('bath-booking')?.scrollIntoView({behavior:'smooth',block:'start'});return;
    }
    const trigger=event.target.closest?.('[data-bath-index]');
    if(!trigger)return;
    const photos=[...trigger.closest('.client-bath').querySelectorAll('[data-bath-index]')];
    let index=photos.indexOf(trigger);
    const dialog=document.createElement('dialog');dialog.className='client-bath-viewer';
    dialog.setAttribute('aria-label','Фотографии бани и купели');
    const nav=document.createElement('nav'),count=document.createElement('span'),img=document.createElement('img');
    function show(){const source=photos[index].querySelector('img');img.src=source.src;img.alt=source.alt;count.textContent=`${index+1} / ${photos.length} · ${source.alt}`;}
    function button(label,action){const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',action);return b;}
    const prev=button('←',()=>{index=(index+photos.length-1)%photos.length;show()});prev.setAttribute('aria-label','Предыдущее фото');
    const next=button('→',()=>{index=(index+1)%photos.length;show()});next.setAttribute('aria-label','Следующее фото');
    nav.append(prev,count,next,button('Закрыть',()=>dialog.close()));dialog.append(nav,img);document.body.append(dialog);
    const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
    dialog.addEventListener('close',()=>{document.body.style.overflow=overflow;dialog.remove();trigger.focus()},{once:true});
    dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')prev.click();if(e.key==='ArrowRight')next.click()});
    show();dialog.showModal();
  });
  // The existing service router changes the hash with pushState.
  document.addEventListener('click',()=>queueMicrotask(title));
  window.addEventListener('hashchange',title);window.addEventListener('popstate',title);window.addEventListener('load',title);
  window.addEventListener('tangerin:serviceview',title); new MutationObserver(title).observe(document.head,{childList:true,subtree:true,characterData:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',title,{once:true});else title();
})();

;(()=>{
  if(window.__tangerinFooterBooking)return;
  window.__tangerinFooterBooking=true;
  document.addEventListener('click',event=>{
    if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey||!(event.target instanceof Element))return;
    const link=event.target.closest('a[href]');
    if(!link||link.target==='_blank')return;
    const url=new URL(link.href);
    if(url.origin===location.origin&&url.pathname==='/vse-dlya-otdyha'&&url.pathname!==location.pathname&&['#breakfast','#bath','#barbecue','#children','#pets'].includes(url.hash)){
      event.preventDefault();event.stopPropagation();location.assign(url.href);
    }
  },true);
  let watched;
  function start(){
    const section=document.getElementById('footer-booking');
    const host=document.getElementById('_bn_widget_footer_');
    if(!section||!host||host===watched)return;
    watched=host;
    if(document.getElementById('_bn_widget_')){section.hidden=true;return;}
    section.hidden=false;
    const link=section.querySelector('[data-booking-url]');
    const uid=new URL(link.href).pathname.split('/').filter(Boolean).pop();
    if(!/^[0-9a-f-]{36}$/i.test(uid))return;
    function mount(){
      if(!host.isConnected||host.querySelector('iframe'))return;
      window.Bnovo_Widget.init(()=>window.Bnovo_Widget.open('_bn_widget_footer_',{
        type:"vertical",uid,lang:"ru",width:"100%",width_mobile:"100%",
        background:"#FFFDF8",background_mobile:"#FFFDF8",bg_alpha:"0",bg_alpha_mobile:"0",
        padding:"0",padding_mobile:"0",border_radius:"8",without_title:"on",
        button_font_size:"16",button_height:"48",font_type:"inter",
        title_color:"#234B3A",title_color_mobile:"#234B3A",title_size:"22",title_size_mobile:"22",
        inp_color:"#234B3A",inp_bordhover:"#234B3A",inp_bordcolor:"#9BA99E",inp_alpha:"100",
        btn_background:"#FF972F",btn_background_over:"#EF8620",btn_textcolor:"#234B3A",btn_textover:"#234B3A",
        btn_bordcolor:"#FF972F",btn_bordhover:"#EF8620",min_age:"0",max_age:"17",adults_default:"2",
        dates_preset:"on",dfrom_today:"on",dto_nextday:"on",switch_mobiles_width:"800"
      }));
      const frame=host.querySelector('iframe');
      if(frame)frame.title='Выбор дат и гостей — Bnovo';
    }
    function load(){
      if(window.Bnovo_Widget){mount();return;}
      let script=document.querySelector('script[data-tangerin-bnovo]');
      const fresh=!script;
      if(!script){script=document.createElement('script');script.src='https://widget.reservationsteps.ru/js/bnovo.js';script.async=true;script.dataset.tangerinBnovo='true';}
      script.addEventListener('load',mount,{once:true});
      if(fresh)document.head.append(script);
    }
    const observer=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)){observer.disconnect();load();}},{rootMargin:'400px'});
    observer.observe(section);
  }
  document.addEventListener('click',event=>{
    if(event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const section=document.getElementById('footer-booking');
    if(!section||section.hidden||!(event.target instanceof Element))return;
    const link=event.target.closest('a[href]');
    if(!link)return;
    const url=new URL(link.href);
    if(url.origin===location.origin&&(url.pathname==='/'||url.pathname===location.pathname)&&url.hash==='#booking'){
      event.preventDefault();
      event.stopPropagation();
      section.scrollIntoView({behavior:'smooth',block:'start'});
      section.querySelector('h2')?.focus({preventScroll:true});
    }
  },true);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  new MutationObserver(start).observe(document.documentElement,{childList:true,subtree:true});
})();

;(()=>{
  if(window.__tangerinBnovoRecovery)return;
  window.__tangerinBnovoRecovery=true;
  const seen=new WeakSet();
  function inspect(){
    document.querySelectorAll('.bnovo_module_overlay').forEach(overlay=>{
      if(seen.has(overlay))return;
      seen.add(overlay);
      setTimeout(()=>{
        if(!overlay.isConnected||overlay.style.display==='none'||!overlay.querySelector('.bnovo_loading'))return;
        const frame=overlay.querySelector('#bnovo_module_overlay__booking_iframe_iframe');
        if(!frame)return;
        const url=new URL(frame.src);
        if(url.origin!=='https://reservationsteps.ru'||!url.pathname.startsWith('/rooms/index/'))return;
        url.searchParams.delete('insidePopup');
        url.searchParams.delete('pd');
        const source=document.querySelector('.bnovo-fallback');
        if(!source)return;
        const notice=source.cloneNode(true);
        notice.className='tangerin-bnovo-recovery';
        notice.setAttribute('role','status');
        notice.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(440px,calc(100% - 40px));box-sizing:border-box;margin:0;padding:24px;background:#fffdf8;color:#234b3a;border-radius:16px;text-align:center;font:16px/1.5 Arial,sans-serif;z-index:2147483646;box-shadow:0 8px 40px #0003';
        const link=notice.querySelector('a');
        if(!link)return;
        link.href=url.href;link.target='_blank';link.rel='noopener noreferrer';
        link.style.cssText='display:block;margin-top:16px;padding:14px 18px;border-radius:8px;background:#ff972f;color:#234b3a;font-weight:600;text-decoration:none';
        overlay.append(notice);
        const loading=overlay.querySelector('.bnovo_loading-spinner');
        if(loading)loading.style.display='none';
        const watch=new MutationObserver(()=>{
          if(!overlay.querySelector('.bnovo_loading')){notice.remove();watch.disconnect();}
        });
        watch.observe(overlay,{attributes:true,subtree:true,attributeFilter:['class']});
      },15000);
    });
  }
  new MutationObserver(inspect).observe(document.documentElement,{childList:true,subtree:true});
  inspect();
})();
