"use client";
import { CmsText, EditableText } from "@/components/cms-context";
import Image from "@/components/cms-image";
import { ArrowUpRight, Baby, Bath, CarFront, ChefHat, Coffee, Croissant, Flame, House, KeyRound, Leaf, PawPrint, ShieldCheck, Sparkles, Trees, Users } from "lucide-react";
import { useSite } from "@/components/cms-context";




export function WhyTangerine() {
  const {comforts}=useSite();
  return <section className="section why-section botanical-section" id="comfort">

    <div className="container why-grid">
      <div><div className="eyebrow"><CmsText id="holiday-sections.001" /></div><h2><CmsText id="holiday-sections.002" /></h2>
        <div className="why-features">{comforts.map(({icon:Icon,title,text},index)=><article key={title}><FeatureIcon name={Icon} size={28} strokeWidth={1.35}/><div><h3><EditableText id={`field:comforts:${index}:title`} value={title}/></h3><p><EditableText id={`field:comforts:${index}:text`} value={text}/></p></div></article>)}</div>
      </div>
      <div className="why-visual"><div className="why-photo"><Image src="/images/veranda.jpg" alt="Настоящая веранда Танжерина со столом для отдыха" fill sizes="(max-width:1000px) 90vw, 46vw"/></div><div className="why-caption"><div className="photo-note"><Leaf size={24}/><span><CmsText id="holiday-sections.003" /><br/><strong><CmsText id="holiday-sections.004" /></strong></span></div></div></div>
    </div>
  </section>;
}

export function Company() {
  const {site,houses}=useSite();
  return <section className="company-section botanical-section" id="company"><div className="container company-grid">
    <div className="company-copy"><div className="eyebrow"><CmsText id="holiday-sections.005" /></div><h2><CmsText id="holiday-sections.006" /><br/><em><CmsText id="holiday-sections.007" /></em></h2><p><CmsText id="holiday-sections.008" /></p><div className="company-facts"><span><Users size={23}/><CmsText id="holiday-sections.009" /></span><span><House size={23}/><CmsText id="holiday-sections.010" /></span></div><a className="button button-yellow" href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.011" /><ArrowUpRight size={18}/></a></div>
    <div className="company-photo"><Image src="/images/hero.jpg" alt="Общая территория и сад у трёх домов Танжерина" fill sizes="(max-width:760px) 90vw, 50vw"/><div className="company-photo-label">{houses.map(house=><span key={house.id}><EditableText id={`field:${house.id}:name`} value={house.name} uppercase/><small><EditableText id={`field:${house.id}:guests`} value={house.guests}/> <CmsText id="houses.010" /></small></span>)}</div></div>
  </div></section>;
}

export function Spa() {
  const {site}=useSite();
  return <section className="spa-section section botanical-section" id="spa"><Image className="section-backdrop" src="/images/spa-tea.jpg" alt="" fill sizes="100vw"/><div className="container spa-grid">
    <div className="spa-visual"><Image src="/images/spa-sauna.jpg" alt="Настоящая баня в SPA-зоне дома «Лайм»" fill sizes="(max-width:760px) 90vw, 45vw"/><div className="spa-photo-caption"><CmsText id="holiday-sections.020" /></div><div className="spa-seal"><Image src="/images/spa-tea.jpg" alt="Чайная зона для отдыха после бани" fill sizes="(max-width:760px) 125px, 180px"/><span><CmsText id="holiday-sections.021" /></span></div></div>
    <div className="spa-copy"><div className="eyebrow"><CmsText id="holiday-sections.022" /></div><h2><CmsText id="holiday-sections.023" /><br/><em><CmsText id="holiday-sections.024" /></em></h2><p><CmsText id="holiday-sections.025" /></p><div className="spa-features"><span><Leaf/><CmsText id="holiday-sections.026" /></span><span><Bath/><CmsText id="holiday-sections.027" /><small><CmsText id="holiday-sections.028" /></small></span><span><Coffee/><CmsText id="holiday-sections.029" /></span><span><Sparkles/><CmsText id="holiday-sections.030" /><br/><CmsText id="holiday-sections.031" /></span></div><details className="spa-details"><summary className="button button-dark"><CmsText id="holiday-sections.032" /><ArrowUpRight size={18}/></summary><div><h3><CmsText id="holiday-sections.033" /></h3><p><CmsText id="holiday-sections.034" /></p><a className="text-link" href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.035" /><ArrowUpRight size={16}/></a></div></details><span className="spa-only"><CmsText id="holiday-sections.036" /></span></div>
  </div></section>;
}



export function ExtraServices() {
  const {site,services}=useSite();
  return <section className="services-section section botanical-section" id="services"><div className="container">
    <div className="section-heading"><div><div className="eyebrow"><CmsText id="holiday-sections.037" /></div><h2><CmsText id="holiday-sections.038" /><br/><em><CmsText id="holiday-sections.039" /></em></h2></div><p><CmsText id="holiday-sections.040" /><br/><CmsText id="holiday-sections.041" /></p></div>
    <div className="services-editorial"><div className="services-grid">{services.map(({id,icon:Icon,title,text,detail,className},index)=><article className={`service-card service-${className}`} key={title}><div className="service-top"><span className="service-icon"><FeatureIcon name={Icon} size={34} strokeWidth={1.25}/></span><span>0{index+1}</span></div><h3><EditableText id={`field:${id}:title`} value={title}/></h3><p><EditableText id={`field:${id}:description`} value={text}/></p><details><summary><CmsText id="holiday-sections.042" /><ArrowUpRight size={16}/></summary><p><EditableText id={`field:${id}:detail`} value={detail}/></p><a href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.043" /><ArrowUpRight size={14}/></a></details></article>)}</div>
    </div><div className="service-contact"><ShieldCheck size={30} strokeWidth={1.25}/><p><CmsText id="holiday-sections.044" /><br/><strong><CmsText id="holiday-sections.045" /></strong></p><a className="button button-outline" href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.046" /><ArrowUpRight size={16}/></a></div>
  </div></section>;
}

const featureIcons={House,Trees,ChefHat,Flame,CarFront,KeyRound,Baby,PawPrint,Croissant,Sparkles};
function FeatureIcon({name,...props}:{name:string;size?:number;strokeWidth?:number}){const Icon=featureIcons[name as keyof typeof featureIcons]||Leaf;return <Icon {...props}/>;}
