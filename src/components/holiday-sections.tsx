"use client";
import { CmsText, EditableText } from "@/components/cms-context";
import Image from "@/components/cms-image";
import { ArrowUpRight, Baby, Bath, CarFront, ChefHat, Croissant, Flame, House, KeyRound, Leaf, PawPrint, ShieldCheck, Sparkles, Trees, Users } from "lucide-react";
import { useSite } from "@/components/cms-context";




export function WhyTangerine() {
  const {comforts}=useSite();
  return <section className="section why-section botanical-section" id="comfort">
    <div className="container why-grid">
      <div className="why-heading"><div className="eyebrow"><CmsText id="holiday-sections.001" /></div><h2><CmsText id="holiday-sections.002" /></h2><p><CmsText id="holiday-sections.003" /> <CmsText id="holiday-sections.004" /></p></div>
        <div className="why-features">{comforts.map(({icon:Icon,title,text},index)=><article key={title}><FeatureIcon name={Icon} size={28} strokeWidth={1.35}/><div><h3><EditableText id={`field:comforts:${index}:title`} value={title}/></h3><p><EditableText id={`field:comforts:${index}:text`} value={text}/></p></div></article>)}</div>
    </div>
  </section>;
}

export function Company() {
  const {site,houses}=useSite();
  return <section className="company-section botanical-section" id="company"><div className="container company-grid">
    <div className="company-copy"><div className="eyebrow"><CmsText id="holiday-sections.005" /></div><h2><CmsText id="holiday-sections.006" /><br/><em><CmsText id="holiday-sections.007" /></em></h2><p><CmsText id="holiday-sections.008" /></p><div className="company-facts"><span><Users size={23}/><CmsText id="holiday-sections.009" /></span><span><House size={23}/><CmsText id="holiday-sections.010" /></span></div><a className="button button-yellow" href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.011" /><ArrowUpRight size={18}/></a></div>
    <div className="company-photo"><Image src="/images/hero.jpg" alt="Общая территория и сад у гостевых домов «Танжерин»" fill sizes="(max-width:760px) 100vw, 50vw"/><div className="company-photo-label">{houses.map(house=><span key={house.id}><EditableText id={`field:${house.id}:name`} value={house.name} uppercase/><small><EditableText id={`field:${house.id}:guests`} value={house.guests}/> <CmsText id="houses.010" /></small></span>)}</div><div className="company-photo-bottom"><Users size={22}/><span><strong><CmsText id="holiday-sections.006" /></strong><small><CmsText id="holiday-sections.007" /></small></span></div></div>
  </div></section>;
}

export function ExtraServices() {
  const {site,services}=useSite();
  return <section className="services-section section botanical-section" id="services"><div className="container">
    <div className="section-heading"><div><div className="eyebrow"><CmsText id="holiday-sections.037" /></div><h2><CmsText id="holiday-sections.038" /><br/><em><CmsText id="holiday-sections.039" /></em></h2></div><p><CmsText id="holiday-sections.040" /><br/><CmsText id="holiday-sections.041" /></p></div>
    <div className="services-editorial"><div className="services-grid">{services.map(({id,icon:Icon,title,text,detail,className,image},index)=><article className={`service-card service-${className}`} key={title}><div className="service-media"><Image src={image.src} alt={image.alt} fill sizes="(max-width:760px) 100vw, (max-width:1100px) 50vw, 46vw"/></div><div className="service-body"><div className="service-top"><span className="service-icon"><FeatureIcon name={Icon} size={28} strokeWidth={1.25}/></span><span>0{index+1}</span></div><h3><EditableText id={`field:${id}:title`} value={title}/></h3><p className="service-summary"><EditableText id={`field:${id}:description`} value={text}/></p><p className="service-detail"><EditableText id={`field:${id}:detail`} value={detail}/></p></div></article>)}</div>
    </div><div className="service-contact"><ShieldCheck size={30} strokeWidth={1.25}/><p><CmsText id="holiday-sections.044" /><br/><strong><CmsText id="holiday-sections.045" /></strong></p><a className="button button-outline" href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.046" /><ArrowUpRight size={16}/></a></div>
  </div></section>;
}

const featureIcons={House,Trees,ChefHat,Flame,CarFront,KeyRound,Baby,PawPrint,Croissant,Sparkles,Bath};
function FeatureIcon({name,...props}:{name:string;size?:number;strokeWidth?:number}){const Icon=featureIcons[name as keyof typeof featureIcons]||Leaf;return <Icon {...props}/>;}
