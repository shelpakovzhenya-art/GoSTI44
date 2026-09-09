"use client";
import { CmsText } from "@/components/cms-context";
import Image from "@/components/cms-image";
import { ArrowUpRight, Baby, Bath, CarFront, ChefHat, Coffee, Croissant, Flame, House, KeyRound, Leaf, PawPrint, ShieldCheck, Sparkles, Trees, Users } from "lucide-react";
import { useSite } from "@/components/cms-context";




export function WhyTangerine() {
  const {comforts}=useSite();
  return <section className="section why-section botanical-section" id="comfort">

    <div className="container why-grid">
      <div><div className="eyebrow"><CmsText id="holiday-sections.001" fallback="ПОЧЕМУ ТАНЖЕРИН" /></div><h2><CmsText id="holiday-sections.002" fallback="Что есть в каждом доме" /></h2>
        <div className="why-features">{comforts.map(({icon:Icon,title,text})=><article key={title}><FeatureIcon name={Icon} size={28} strokeWidth={1.35}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </div>
      <div className="why-visual"><div className="why-photo"><Image src="/images/veranda.jpg" alt="Настоящая веранда Танжерина со столом для отдыха" fill sizes="(max-width:1000px) 90vw, 46vw"/></div><div className="why-caption"><div className="photo-note"><Leaf size={24}/><span><CmsText id="holiday-sections.003" fallback="Крытая веранда" /><br/><strong><CmsText id="holiday-sections.004" fallback="со столом и местами для гостей" /></strong></span></div></div></div>
    </div>
  </section>;
}

export function Company() {
  const {site}=useSite();
  return <section className="company-section botanical-section" id="company"><div className="container company-grid">
    <div className="company-copy"><div className="eyebrow"><CmsText id="holiday-sections.005" fallback="ЕДЕТЕ БОЛЬШОЙ КОМПАНИЕЙ?" /></div><h2><CmsText id="holiday-sections.006" fallback="Три дома для компании" /><br/><em><CmsText id="holiday-sections.007" fallback="до 25 человек" /></em></h2><p><CmsText id="holiday-sections.008" fallback="Забронируйте несколько домов для родственников или друзей. Вы будете жить на одной территории, а у каждой семьи останутся свои спальни, кухня и веранда." /></p><div className="company-facts"><span><Users size={23}/><CmsText id="holiday-sections.009" fallback="Вместе на общей территории" /></span><span><House size={23}/><CmsText id="holiday-sections.010" fallback="Своя кухня, комнаты и веранда" /></span></div><a className="button button-yellow" href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.011" fallback="Узнать о размещении компании" /><ArrowUpRight size={18}/></a></div>
    <div className="company-photo"><Image src="/images/hero.jpg" alt="Общая территория и сад у трёх домов Танжерина" fill sizes="(max-width:760px) 90vw, 50vw"/><div className="company-photo-label"><span><CmsText id="holiday-sections.012" fallback="ЛАЙМ" /><small><CmsText id="holiday-sections.013" fallback="до 7 гостей" /></small></span><span><CmsText id="holiday-sections.014" fallback="ЛИМОН" /><small><CmsText id="holiday-sections.015" fallback="до 9 гостей" /></small></span><span><CmsText id="holiday-sections.016" fallback="ЦИТРУС" /><small><CmsText id="holiday-sections.017" fallback="до 10 гостей" /></small></span></div><div className="company-photo-bottom"><House size={25}/><span><CmsText id="holiday-sections.018" fallback="Общая территория" /><br/><strong><CmsText id="holiday-sections.019" fallback="Отдельные кухни и спальни" /></strong></span></div></div>
  </div></section>;
}

export function Spa() {
  const {site}=useSite();
  return <section className="spa-section section botanical-section" id="spa"><Image className="section-backdrop" src="/images/spa-tea.jpg" alt="" fill sizes="100vw"/><div className="container spa-grid">
    <div className="spa-visual"><Image src="/images/spa-sauna.jpg" alt="Настоящая баня в SPA-зоне дома «Лайм»" fill sizes="(max-width:760px) 90vw, 45vw"/><div className="spa-photo-caption"><CmsText id="holiday-sections.020" fallback="ЛАЙМ · ДОМ С СОБСТВЕННЫМ SPA" /></div><div className="spa-seal"><Image src="/images/spa-tea.jpg" alt="Чайная зона для отдыха после бани" fill sizes="(max-width:760px) 125px, 180px"/><span><CmsText id="holiday-sections.021" fallback="Чайная зона" /></span></div></div>
    <div className="spa-copy"><div className="eyebrow"><CmsText id="holiday-sections.022" fallback="SPA В ТАНЖЕРИНЕ" /></div><h2><CmsText id="holiday-sections.023" fallback="Баня" /><br/><em><CmsText id="holiday-sections.024" fallback="в доме «Лайм»" /></em></h2><p><CmsText id="holiday-sections.025" fallback="В «Лайме» есть собственная баня и чайная зона. Ими пользуются только гости этого дома. Купель и состав SPA-услуг зависят от тарифа — уточните условия перед бронированием." /></p><div className="spa-features"><span><Leaf/><CmsText id="holiday-sections.026" fallback="Баня" /></span><span><Bath/><CmsText id="holiday-sections.027" fallback="Купель" /><small><CmsText id="holiday-sections.028" fallback="по тарифу" /></small></span><span><Coffee/><CmsText id="holiday-sections.029" fallback="Чайная зона" /></span><span><Sparkles/><CmsText id="holiday-sections.030" fallback="Полотенца" /><br/><CmsText id="holiday-sections.031" fallback="и принадлежности" /></span></div><details className="spa-details"><summary className="button button-dark"><CmsText id="holiday-sections.032" fallback="Условия посещения бани" /><ArrowUpRight size={18}/></summary><div><h3><CmsText id="holiday-sections.033" fallback="Баня в доме «Лайм»" /></h3><p><CmsText id="holiday-sections.034" fallback="SPA-зона доступна только гостям дома ЛАЙМ. Включение купели и состав услуг зависят от выбранного тарифа. Условия и стоимость согласуем до приезда." /></p><a className="text-link" href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.035" fallback="Уточнить условия SPA" /><ArrowUpRight size={16}/></a></div></details><span className="spa-only"><CmsText id="holiday-sections.036" fallback="Только для гостей ЛАЙМА" /></span></div>
  </div></section>;
}



export function ExtraServices() {
  const {site,services}=useSite();
  return <section className="services-section section botanical-section" id="services"><div className="container">
    <div className="section-heading"><div><div className="eyebrow"><CmsText id="holiday-sections.037" fallback="ДОПОЛНИТЕЛЬНЫЕ УСЛУГИ" /></div><h2><CmsText id="holiday-sections.038" fallback="Что подготовить" /><br/><em><CmsText id="holiday-sections.039" fallback="к вашему приезду" /></em></h2></div><p><CmsText id="holiday-sections.040" fallback="Сообщите, что понадобится в поездке." /><br/><CmsText id="holiday-sections.041" fallback="Наличие и стоимость согласуем заранее." /></p></div>
    <div className="services-editorial"><div className="services-grid">{services.map(({icon:Icon,title,text,detail,className},index)=><article className={`service-card service-${className}`} key={title}><div className="service-top"><span className="service-icon"><FeatureIcon name={Icon} size={34} strokeWidth={1.25}/></span><span>0{index+1}</span></div><h3>{title}</h3><p>{text}</p><details><summary><CmsText id="holiday-sections.042" fallback="Подробнее" /><ArrowUpRight size={16}/></summary><p>{detail}</p><a href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.043" fallback="Обсудить услугу" /><ArrowUpRight size={14}/></a></details></article>)}</div>
    </div><div className="service-contact"><ShieldCheck size={30} strokeWidth={1.25}/><p><CmsText id="holiday-sections.044" fallback="Дополнительные услуги можно согласовать после бронирования." /><br/><strong><CmsText id="holiday-sections.045" fallback="Напишите Светлане, что нужно подготовить." /></strong></p><a className="button button-outline" href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="holiday-sections.046" fallback="Связаться с нами" /><ArrowUpRight size={16}/></a></div>
  </div></section>;
}

const featureIcons={House,Trees,ChefHat,Flame,CarFront,KeyRound,Baby,PawPrint,Croissant,Sparkles};
function FeatureIcon({name,...props}:{name:string;size?:number;strokeWidth?:number}){const Icon=featureIcons[name as keyof typeof featureIcons]||Leaf;return <Icon {...props}/>;}
