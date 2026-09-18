"use client";
import { CmsText, EditableText } from "@/components/cms-context";

import Image from "@/components/cms-image";
import { ArrowDown, ArrowUpRight, CalendarDays, ChevronDown, Heart, House, KeyRound, Mail, MapPin, Phone, Trees } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Navigation } from "@/components/navigation";
import { Ratings, Stars } from "@/components/ratings";
import { Houses } from "@/components/houses";
import { Gallery } from "@/components/gallery";
import { Booking, LocationMap, ReviewsWidget } from "@/components/embeds";
import { useSite } from "@/components/cms-context";
import { Brand } from "@/components/brand";
import { ContactLinks } from "@/components/contact-links";
import { Company, ExtraServices, WhyTangerine } from "@/components/holiday-sections";

export default function Landing() {
  const {site, houses, reviewExcerpts, rules} = useSite();
  return <div id="top"><ScrollReveal/><Navigation/><main id="main">
    <section className="hero" aria-labelledby="hero-heading">
      <Image src="/images/hero.jpg" alt="Большой дом «Танжерин» и зелёный сад с местом для отдыха" fill priority sizes="100vw" className="hero-photo"/>
      <div className="hero-shade"/>


      <div className="container hero-inner">
        <div className="hero-eyebrow"><span className="little-sun">✳</span> <CmsText id="landing.001" /></div>
        <h1 id="hero-heading"><CmsText id="landing.002" />{" "}<span><CmsText id="landing.003" /></span></h1>
        <p><span><CmsText id="landing.004" />{" "}<CmsText id="landing.005" /></span><span><CmsText id="landing.006" />{" "}<CmsText id="landing.007" /></span></p>
        <div className="hero-actions"><a className="button button-yellow" href="#booking"><CalendarDays size={20}/><CmsText id="landing.008" /><ArrowUpRight size={19}/></a><a className="hero-secondary" href="#houses"><House size={20}/><CmsText id="landing.009" /></a></div>
      </div>
    </section>
    <section className="hero-highlights" aria-label="Преимущества гостевых домов"><div className="container hero-highlights-grid">
      <article className="hero-highlight"><div className="hero-highlight-copy"><span className="hero-highlight-icon"><MapPin/></span><h2><CmsText id="landing.079" /></h2><p><CmsText id="landing.080" /><br/><CmsText id="landing.081" /></p></div><BenefitSketch variant="location"/></article>
      <article className="hero-highlight"><div className="hero-highlight-copy"><span className="hero-highlight-icon"><House/></span><h2><CmsText id="landing.082" /></h2><p><CmsText id="landing.083" /><br/><CmsText id="landing.084" /></p></div><BenefitSketch variant="house"/></article>
      <article className="hero-highlight"><div className="hero-highlight-copy"><span className="hero-highlight-icon"><Trees/></span><h2><CmsText id="landing.085" /></h2><p><CmsText id="landing.086" /><br/><CmsText id="landing.087" /></p></div><BenefitSketch variant="territory"/></article>
    </div></section>
    <section className="trust-section botanical-section" aria-label="Рейтинги гостей"><div className="container"><div className="trust-message"><Heart size={23} strokeWidth={1.2}/><h2><CmsText id="landing.016" /></h2><p><CmsText id="landing.017" /></p></div><div className="trust-strip"><Ratings compact/></div><a className="trust-more text-link" href="#reviews"><CmsText id="landing.018" /><ArrowUpRight size={16}/></a></div></section>
    <section className="section about-band botanical-section" id="about"><div className="container about"><div className="about-editorial-photo"><Image src="/images/hero.jpg" alt="Общий сад и территория у гостевых домов «Танжерин»" fill sizes="(max-width:760px) 100vw, 40vw"/></div>
      <div><div className="eyebrow"><CmsText id="landing.019" /></div><h2><CmsText id="landing.020" /><br/><span className="muted"><CmsText id="landing.021" /></span></h2></div>
      <div className="about-copy"><p><CmsText id="landing.022" /></p><p><CmsText id="landing.023" /></p><div className="about-facts"><span><KeyRound/><strong>{houses.length}</strong><small><CmsText id="landing.024" /></small></span><span><MapPin/><strong><CmsText id="landing.025" /></strong><small><CmsText id="landing.026" /></small></span><span><Trees/><strong><CmsText id="landing.027" /></strong><small><CmsText id="landing.028" /></small></span></div></div>
    </div></section>
    <section className="houses-section section botanical-section" id="houses"><div className="container">
      <div className="section-heading houses-heading"><div><div className="eyebrow"><CmsText id="landing.029" /></div><h2><CmsText id="landing.030" /></h2></div><p><CmsText id="landing.031" />{" "}<br className="desktop-break"/> <CmsText id="landing.032" /></p></div>
      <Houses/>
    </div></section>
    <Company/>
    <WhyTangerine/>
    <ExtraServices/>
    <section className="atmosphere" aria-labelledby="atmosphere-title"><div className="atmosphere-picture"><Image src="/images/veranda.jpg" alt="Веранда гостевого дома для отдыха с близкими" fill sizes="100vw"/></div><div className="atmosphere-copy"><span className="foliage atmosphere-jasmine" aria-hidden="true"/><div className="eyebrow"><CmsText id="landing.033" /></div><h2 id="atmosphere-title"><CmsText id="landing.034" /><br/><span><CmsText id="landing.035" /></span></h2><p><CmsText id="landing.036" /></p><a className="text-link light-link" href="#booking"><CmsText id="landing.037" /><ArrowUpRight size={19}/></a></div></section>
    <section className="section gallery-band botanical-section" id="gallery"><span className="gallery-botanical gallery-resort-leaves" aria-hidden="true"/><span className="gallery-botanical gallery-maidenhair" aria-hidden="true"/><div className="container"><div className="section-heading"><div><div className="eyebrow"><CmsText id="landing.038" /></div><h2><CmsText id="landing.039" /></h2></div><span className="gallery-caption"><CmsText id="landing.040" /><ArrowDown size={17}/></span></div><Gallery/></div></section>
    <section className="reviews-section section botanical-section" id="reviews"><div className="container"><div className="section-heading"><div><div className="eyebrow"><CmsText id="landing.041" /></div><h2><CmsText id="landing.042" /></h2></div><a className="text-link" href={site.avito} target="_blank" rel="noreferrer"><CmsText id="landing.043" /><ArrowUpRight size={18}/></a></div><Ratings/><p className="ratings-date"><CmsText id="landing.044" />{" "}{site.checked}<CmsText id="landing.045" /></p><div className="review-cards">{reviewExcerpts.map(review=><article className="review-card" key={review.name}><div className="review-top"><Stars/><Image src="/images/yandex-logo.jpg" alt="Яндекс Карты" width={40} height={30}/></div><blockquote>«{review.quote}»</blockquote><div className="review-author"><span className="avatar-initials">{review.initials}</span><div><strong>{review.name}</strong><span>{review.date} <CmsText id="landing.046" /></span></div></div><a href={site.yandex} target="_blank" rel="noreferrer"><CmsText id="landing.047" /><ArrowUpRight size={14}/></a></article>)}</div><ReviewsWidget/></div></section>
    <section className="booking-section section botanical-section" id="booking"><div className="container"><div className="booking-intro"><div className="eyebrow"><CmsText id="landing.054" /></div><h2><CmsText id="landing.055" /><br/><CmsText id="landing.056" /></h2><p><CmsText id="landing.057" /></p></div><Booking/></div></section>
    <section className="section rules-band botanical-section" id="rules"><div className="container rules-section"><div className="rules-intro"><div className="eyebrow"><CmsText id="landing.058" /></div><h2><CmsText id="landing.059" /></h2><p><CmsText id="landing.060" /><br/><CmsText id="landing.061" /></p><a className="text-link" href={site.phoneHref}>{site.phone} <ArrowUpRight size={18}/></a><div className="rules-photo"><Image src="/images/business-bedroom.jpg" alt="Спальня одного из гостевых домов «Танжерин»" fill sizes="(max-width:760px) 100vw, 34vw"/></div></div><div className="faq">{rules.map((rule,index)=><details key={rule.title}><summary><span className="faq-number">0{index+1}</span><EditableText id={`field:${rule.id}:title`} value={rule.title}/><ChevronDown size={18}/></summary><p><EditableText id={`field:${rule.id}:description`} value={rule.text}/></p></details>)}</div></div></section>
    </main><footer className="footer botanical-section"><section className="contacts-section" id="contacts"><div className="container contacts-grid"><div className="contact-copy"><div className="eyebrow"><CmsText id="landing.062" /></div><h2><CmsText id="landing.063" /><br/><CmsText id="landing.064" /></h2><p className="contact-address"><MapPin size={21}/>{site.address}</p><p><CmsText id="landing.065" /><br/><CmsText id="landing.066" /></p><a className="contact-phone" href={site.phoneHref}>{site.phone}</a><span className="contact-person"><CmsText id="landing.067" /></span><a className="contact-email" href={`mailto:${site.email}`}><Mail size={16}/>{site.email}</a><div className="contact-actions"><a className="button button-dark" href={site.phoneHref}><Phone size={17}/> <CmsText id="landing.068" /></a><ContactLinks labels/></div><details className="directions"><summary><CmsText id="landing.069" /><ChevronDown size={16}/></summary><p><CmsText id="landing.070" /></p></details></div><LocationMap/></div></section>
  <div className="footer-base"><div className="container footer-main"><Brand/><nav aria-label="Навигация в подвале"><a href="#houses"><CmsText id="landing.071" /></a><a href="#reviews"><CmsText id="landing.072" /></a><a href="#rules"><CmsText id="landing.073" /></a><a href="#contacts"><CmsText id="landing.074" /></a></nav><div className="footer-socials"><ContactLinks socialOnly/><a href="#top" className="back-top"><CmsText id="landing.075" /><ArrowUpRight size={18}/></a></div></div><div className="container footer-bottom"><span><CmsText id="landing.076" /></span><span><CmsText id="landing.077" /></span><a href={site.booking} target="_blank" rel="noreferrer"><CmsText id="landing.078" /><ArrowUpRight size={13}/></a></div></div></footer></div>;
}

function BenefitSketch({ variant }: { variant: "location" | "house" | "territory" }) {
  if (variant === "location") return <svg className="hero-highlight-sketch" viewBox="0 0 220 116" aria-hidden="true"><path className="sketch-fill" d="M19 88h184v14H19z"/><path d="M23 88h174M44 87V61l20-15 20 15v26M51 87V67h26v20M103 88V49h37v39M109 49l13-17 13 17M116 88V65h11v23M147 88V57h28v31M153 57l8-13 8 13M25 101c25 7 47 7 68 0m16 0c24 7 48 7 73 0M33 75h10m45 0h11m80 0h13"/></svg>;
  if (variant === "house") return <svg className="hero-highlight-sketch" viewBox="0 0 220 116" aria-hidden="true"><path className="sketch-fill" d="M70 48h85v55H70z"/><path d="M41 102h146M68 102V49l44-27 44 27v53M82 102V62h60v40M97 102V76h21v26M129 72h14M129 84h14M62 102c-1-15-9-23-17-23s-15 8-16 23m142 0c0-16 8-25 17-25 8 0 14 9 14 25M52 73V51m129 18V46"/></svg>;
  return <svg className="hero-highlight-sketch" viewBox="0 0 220 116" aria-hidden="true"><path className="sketch-fill" d="M36 78h113v25H36z"/><path d="M18 102h190M39 102V44h107v58M29 44h126M48 44v58m88-58v58M60 80h64M66 80v22m52-22v22M166 102V73h34v29m-30-29 8-18h11l8 18M174 87h22M13 102c0-14 7-23 15-23m130 23c0-13 6-21 13-21"/><path d="M78 44c2-15 10-24 21-24 10 0 19 9 21 24"/></svg>;
}

