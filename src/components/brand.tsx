"use client";
import { CmsText } from "@/components/cms-context";
import Image from "@/components/cms-image";

export function Brand({href="#top"}: {href?:string} = {}) {
  return <a className="wordmark brand-lockup" href={href} aria-label="Танжерин — на главную">
    <Image className="brand-fruit" src="/brand/tangerines.webp" alt="" width={66} height={66} priority/>
    <span className="brand-type"><span><CmsText id="brand.001" fallback="ТАНЖЕРИН" /></span><small><CmsText id="brand.002" fallback="место, где Вы дома" /></small></span>
  </a>;
}

export function Foliage({className="",fruit=false,variant,eager=false}:{className?:string;fruit?:boolean;variant?:"leaves"|"lemons"|"palm"|"fruit";eager?:boolean}) {
  const assets = {leaves:"citrus-leaves",lemons:"lemon-branch",palm:"palm-frond",fruit:"tangerines"};
  return <div className={`foliage ${className}`} aria-hidden="true"><Image src={`/brand/${assets[variant ?? (fruit?"fruit":"leaves")]}.webp`} alt="" fill loading={eager ? "eager" : "lazy"} sizes="(max-width:760px) 200px, 420px"/></div>;
}
