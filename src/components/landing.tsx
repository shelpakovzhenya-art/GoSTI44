"use client";
import { CmsText, EditableText } from "@/components/cms-context";

import Image from "@/components/cms-image";
import { ArrowDown, ArrowUpRight, CalendarDays, ChevronDown, CookingPot, Heart, House, KeyRound, Mail, MapPin, Phone, Trees } from "lucide-react";
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
      <article className="hero-highlight"><div className="hero-highlight-copy"><span className="hero-highlight-icon"><CookingPot/></span><h2><CmsText id="landing.085" /></h2><p><CmsText id="landing.086" /><br/><CmsText id="landing.087" /></p></div><BenefitSketch variant="territory"/></article>
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
  if (variant === "location") return <svg className="hero-highlight-sketch" viewBox="0 0 260 132" aria-hidden="true">
    <path className="sketch-wash" d="M28 89c18-12 35-14 52-6 15-20 34-28 55-23 17-10 35-8 54 5 16-4 30 1 42 15v31H28z"/>
    <path d="M18 108h224M34 108V82l23-15 23 15v26M42 108V87h29v21M90 108V70h31v38M96 70l10-13 9 13M131 108V55h37v53M137 55l12-17 13 17M143 108V79h13v29M180 108V77h30v31M185 77l10-13 10 13"/>
    <path className="sketch-accent" d="M145 35c-7-6-2-14 4-16 6 2 11 10 4 16zM103 55c-6-5-2-12 4-14 5 2 9 9 3 14zM192 62c-6-5-2-11 4-13 5 2 9 8 3 13z"/>
    <path d="M149 19V10m-42 31v-7m89 15v-7M23 116c24 7 48 7 71 0m13 0c27 7 54 7 81 0m9 0c15 4 28 4 40 0M49 94h10m47-7h9m82 4h8"/>
  </svg>;
  if (variant === "house") return <svg className="hero-highlight-sketch" viewBox="0 0 260 132" aria-hidden="true">
    <path className="sketch-wash" d="M25 106V73c14-9 25-12 34-8 8-22 20-34 36-35 14-18 31-25 51-18 20 7 31 21 34 42 21-5 39 5 55 29v23z"/>
    <path className="sketch-accent" d="M85 105V55l45-31 45 31v50z"/>
    <path d="M15 108h230M80 108V55l50-34 50 34v53M94 108V65h72v43M111 108V82h24v26M145 72h13v13h-13zM102 72h13v13h-13zM130 21v-9M71 108c0-20-8-31-19-31s-20 11-20 31m25-38V45m-8 19-12-9m20 9 11-9m121 53c0-21 9-34 21-34s21 13 21 34m-21-34V43m-8 18-12-9m20 9 12-9M23 116c30 6 59 6 88 0m19 0c34 6 68 6 102 0"/>
  </svg>;
  return <svg className="hero-highlight-sketch" viewBox="0 0 260 132" aria-hidden="true">
    <path className="sketch-wash" d="M20 109V70c18-7 33-6 47 3 16-15 33-19 52-13 19-9 37-6 55 8 20-9 42-2 66 21v20z"/>
    <path d="M15 109h231M29 109V48h135v61M20 48h153M42 48v61m109-61v61M58 83h76M66 83v26m60-26v26M74 77c3-13 11-21 23-21 11 0 20 8 23 21"/>
    <path className="sketch-accent" d="M56 48h96v10H56zM178 108V82h31v26z"/>
    <path d="M173 109V79h41v30m-35-30 8-18h13l8 18m-30 14h31M190 61v-9m8 9v-9M220 108c2-16 11-26 23-26h3M224 82l7-14h17l7 14M229 94h20m-15 14v-9m11 9v-9M22 109c0-14 7-24 16-24m124 24c0-15 7-25 16-25M34 76h-9m11-8-7-7"/>
  </svg>;
}

