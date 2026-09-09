"use client";
import { CmsText, EditableText } from "@/components/cms-context";

import Image from "@/components/cms-image";
import { ArrowDown, ArrowUpRight, ChevronDown, Heart, KeyRound, Mail, MapPin, Phone, Trees, Users } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Navigation } from "@/components/navigation";
import { Ratings, Stars } from "@/components/ratings";
import { Houses } from "@/components/houses";
import { Gallery } from "@/components/gallery";
import { Booking, LocationMap, ReviewsWidget } from "@/components/embeds";
import { useSite } from "@/components/cms-context";
import { Brand } from "@/components/brand";
import { ContactLinks } from "@/components/contact-links";
import { Company, ExtraServices, Spa, WhyTangerine } from "@/components/holiday-sections";

export default function Landing() {
  const {site, houses, reviewExcerpts, rules} = useSite();
  return <div id="top"><ScrollReveal/><Navigation/><main id="main">
    <section className="hero" aria-labelledby="hero-heading">
      <Image src="/images/hero.jpg" alt="Дома «Танжерин» и зелёный сад с местом для отдыха" fill priority sizes="100vw" className="hero-photo"/>
      <div className="hero-shade"/>


      <div className="container hero-inner">
        <div className="hero-eyebrow"><span className="little-sun">✳</span> <CmsText id="landing.001" /></div>
        <h1 id="hero-heading"><CmsText id="landing.002" /><span><CmsText id="landing.003" /></span></h1>
        <p><CmsText id="landing.004" />{" "}<br className="desktop-break"/> <CmsText id="landing.005" /><br/> <CmsText id="landing.006" />{" "}<br className="desktop-break"/> <CmsText id="landing.007" /></p>
        <div className="hero-actions"><a className="button button-yellow" href="#booking"><CmsText id="landing.008" /><ArrowUpRight size={19}/></a><a className="hero-secondary" href="#houses"><CmsText id="landing.009" /><ArrowUpRight size={18}/></a></div>
        <div className="hero-capacity"><span><Users size={23}/><span><strong><CmsText id="landing.010" /></strong><small><CmsText id="landing.011" /></small></span></span><span><HouseIcon/><span><strong><CmsText id="landing.012" /></strong><small><CmsText id="landing.013" /></small></span></span></div>
        <div className="hero-bottom"><span><MapPin size={17}/> <CmsText id="landing.014" /></span><a href="#about" aria-label="Узнать о Танжерине"><ArrowDown size={20}/></a><span><CmsText id="landing.015" /></span></div>
      </div>
    </section>
    <section className="trust-section botanical-section" aria-label="Рейтинги гостей"><div className="container"><div className="trust-message"><Heart size={23} strokeWidth={1.2}/><h2><CmsText id="landing.016" /></h2><p><CmsText id="landing.017" /></p></div><div className="trust-strip"><Ratings compact/></div><a className="trust-more text-link" href="#reviews"><CmsText id="landing.018" /><ArrowUpRight size={16}/></a></div></section>
    <section className="section about-band" id="about"><div className="container about"><div className="about-editorial-photo"><Image src="/images/editorial/mandarins.webp" alt="" fill sizes="(max-width:760px) 90vw, 40vw"/></div>
      <div><div className="eyebrow"><CmsText id="landing.019" /></div><h2><CmsText id="landing.020" /><br/><span className="muted"><CmsText id="landing.021" /></span></h2></div>
      <div className="about-copy"><p><CmsText id="landing.022" /></p><p><CmsText id="landing.023" /></p><div className="about-facts"><span><KeyRound/><strong>{houses.length}</strong><small><CmsText id="landing.024" /></small></span><span><MapPin/><strong><CmsText id="landing.025" /></strong><small><CmsText id="landing.026" /></small></span><span><Trees/><strong><CmsText id="landing.027" /></strong><small><CmsText id="landing.028" /></small></span></div></div>
    </div></section>
    <section className="houses-section section botanical-section" id="houses"><div className="container">
      <div className="section-heading houses-heading"><div><div className="eyebrow"><CmsText id="landing.029" /></div><h2><CmsText id="landing.030" /></h2></div><p><CmsText id="landing.031" />{" "}<br className="desktop-break"/> <CmsText id="landing.032" /></p></div>
      <Houses/>
    </div></section>
    <Company/>
    <WhyTangerine/>
    <Spa/>
    <ExtraServices/>
    <section className="atmosphere" aria-labelledby="atmosphere-title"><div className="atmosphere-picture"><Image src="/images/veranda.jpg" alt="Веранда таунхауса для отдыха с близкими" fill sizes="100vw"/></div><div className="atmosphere-copy"><div className="eyebrow"><CmsText id="landing.033" /></div><h2 id="atmosphere-title"><CmsText id="landing.034" /><br/><span><CmsText id="landing.035" /></span></h2><p><CmsText id="landing.036" /></p><a className="text-link light-link" href="#booking"><CmsText id="landing.037" /><ArrowUpRight size={19}/></a></div></section>
    <section className="section gallery-band" id="gallery"><div className="container"><div className="section-heading"><div><div className="eyebrow"><CmsText id="landing.038" /></div><h2><CmsText id="landing.039" /></h2></div><span className="gallery-caption"><CmsText id="landing.040" /><ArrowDown size={17}/></span></div><Gallery/></div></section>
    <section className="reviews-section section botanical-section" id="reviews"><div className="container"><div className="section-heading"><div><div className="eyebrow"><CmsText id="landing.041" /></div><h2><CmsText id="landing.042" /></h2></div><a className="text-link" href={site.yandex} target="_blank" rel="noreferrer"><CmsText id="landing.043" /><ArrowUpRight size={18}/></a></div><Ratings/><p className="ratings-date"><CmsText id="landing.044" />{" "}{site.checked}<CmsText id="landing.045" /></p><div className="review-cards">{reviewExcerpts.map(review=><article className="review-card" key={review.name}><div className="review-top"><Stars/><Image src="/images/yandex-logo.jpg" alt="Яндекс Карты" width={40} height={30}/></div><blockquote>«{review.quote}»</blockquote><div className="review-author"><span className="avatar-initials">{review.initials}</span><div><strong>{review.name}</strong><span>{review.date} <CmsText id="landing.046" /></span></div></div><a href={site.yandex} target="_blank" rel="noreferrer"><CmsText id="landing.047" /><ArrowUpRight size={14}/></a></article>)}</div><ReviewsWidget/></div></section>
    <section className="section host-band"><div className="container host-section"><div className="host-photo"><Image src="/images/host.jpg" alt="Светлана, хозяйка таунхаусов «Танжерин»" fill sizes="(max-width:760px) 90vw, 380px"/></div><div className="host-copy"><div className="eyebrow"><CmsText id="landing.048" /></div><h2><CmsText id="landing.049" /><br/><CmsText id="landing.050" /></h2><p><CmsText id="landing.051" /></p><p><CmsText id="landing.052" /></p><a className="text-link" href={site.telegram} target="_blank" rel="noreferrer"><CmsText id="landing.053" /><ArrowUpRight size={18}/></a></div><Heart className="host-heart" size={48} strokeWidth={1}/></div></section>
    <section className="booking-section section botanical-section" id="booking"><Image className="section-backdrop" src="/images/family-living.jpg" alt="" fill sizes="100vw"/><div className="container"><div className="booking-intro"><div className="eyebrow"><CmsText id="landing.054" /></div><h2><CmsText id="landing.055" /><br/><CmsText id="landing.056" /></h2><p><CmsText id="landing.057" /></p></div><Booking/></div></section>
    <section className="section rules-band" id="rules"><div className="container rules-section"><div><div className="eyebrow"><CmsText id="landing.058" /></div><h2><CmsText id="landing.059" /></h2><p><CmsText id="landing.060" /><br/><CmsText id="landing.061" /></p><a className="text-link" href={site.phoneHref}>{site.phone} <ArrowUpRight size={18}/></a></div><div className="faq">{rules.map((rule,index)=><details key={rule.title}><summary><span className="faq-number">0{index+1}</span><EditableText id={`field:${rule.id}:title`} value={rule.title}/><ChevronDown size={18}/></summary><p><EditableText id={`field:${rule.id}:description`} value={rule.text}/></p></details>)}</div></div></section>
    </main><footer className="footer botanical-section"><Image className="section-backdrop" src="/images/hero.jpg" alt="" fill sizes="100vw"/><section className="contacts-section" id="contacts"><div className="container contacts-grid"><div className="contact-copy"><div className="eyebrow"><CmsText id="landing.062" /></div><h2><CmsText id="landing.063" /><br/><CmsText id="landing.064" /></h2><p className="contact-address"><MapPin size={21}/>{site.address}</p><p><CmsText id="landing.065" /><br/><CmsText id="landing.066" /></p><a className="contact-phone" href={site.phoneHref}>{site.phone}</a><span className="contact-person"><CmsText id="landing.067" /></span><a className="contact-email" href={`mailto:${site.email}`}><Mail size={16}/>{site.email}</a><div className="contact-actions"><a className="button button-dark" href={site.phoneHref}><Phone size={17}/> <CmsText id="landing.068" /></a><ContactLinks labels/></div><details className="directions"><summary><CmsText id="landing.069" /><ChevronDown size={16}/></summary><p><CmsText id="landing.070" /></p></details></div><LocationMap/></div></section>
  <div className="footer-base"><div className="container footer-main"><Brand/><nav aria-label="Навигация в подвале"><a href="#houses"><CmsText id="landing.071" /></a><a href="#reviews"><CmsText id="landing.072" /></a><a href="#rules"><CmsText id="landing.073" /></a><a href="#contacts"><CmsText id="landing.074" /></a></nav><div className="footer-socials"><ContactLinks socialOnly/><a href="#top" className="back-top"><CmsText id="landing.075" /><ArrowUpRight size={18}/></a></div></div><div className="container footer-bottom"><span><CmsText id="landing.076" /></span><span><CmsText id="landing.077" /></span><a href={site.booking} target="_blank" rel="noreferrer"><CmsText id="landing.078" /><ArrowUpRight size={13}/></a></div></div></footer></div>;
}

function HouseIcon(){return <Trees size={25} strokeWidth={1.5}/>;}

