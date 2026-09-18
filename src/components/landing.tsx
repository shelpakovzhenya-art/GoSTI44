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
      <article className="hero-highlight"><div className="hero-highlight-copy"><span className="hero-highlight-icon"><BenefitGlyph variant="location"/></span><h2><CmsText id="landing.079" /></h2><p><CmsText id="landing.080" /><br/><CmsText id="landing.081" /></p></div><BenefitSketch variant="location"/></article>
      <article className="hero-highlight"><div className="hero-highlight-copy"><span className="hero-highlight-icon"><BenefitGlyph variant="house"/></span><h2><CmsText id="landing.082" /></h2><p><CmsText id="landing.083" /><br/><CmsText id="landing.084" /></p></div><BenefitSketch variant="house"/></article>
      <article className="hero-highlight"><div className="hero-highlight-copy"><span className="hero-highlight-icon"><BenefitGlyph variant="territory"/></span><h2><CmsText id="landing.085" /></h2><p><CmsText id="landing.086" /><br/><CmsText id="landing.087" /></p></div><BenefitSketch variant="territory"/></article>
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

type BenefitVariant = "location" | "house" | "territory";

function BenefitGlyph({ variant }: { variant: BenefitVariant }) {
  if (variant === "location") return <svg className="hero-highlight-glyph" viewBox="0 0 64 64" aria-hidden="true">
    <path fillRule="evenodd" d="M32 5C19.85 5 10 14.72 10 26.72 10 43.04 32 59 32 59s22-15.96 22-32.28C54 14.72 44.15 5 32 5Zm0 31.1c5.27 0 9.55-4.21 9.55-9.4 0-5.2-4.28-9.42-9.55-9.42s-9.55 4.22-9.55 9.41c0 5.2 4.28 9.41 9.55 9.41Z"/>
  </svg>;
  if (variant === "house") return <svg className="hero-highlight-glyph" viewBox="0 0 64 64" aria-hidden="true">
    <path fillRule="evenodd" d="M7 31.1 32 8l25 23.1v24.4H39.7V38.2H24.3v17.3H7V31.1Zm8 1.7v14.7h5.2V34.2h23.6v13.3H49V32.8L32 17.2 15 32.8Z"/>
    <path d="M3.5 29.3 32 3l28.5 26.3-5.4 5L32 13 8.9 34.3l-5.4-5Z"/>
  </svg>;
  return <svg className="hero-highlight-glyph" viewBox="0 0 64 64" aria-hidden="true">
    <path d="M8 28h48v5.5c0 11.3-9.4 20.5-21 20.5h-6C17.4 54 8 44.8 8 33.5V28Z"/>
    <path d="M14 54h9l-5.5 7h-8l4.5-7Zm27 0h9l4.5 7h-8L41 54ZM4 23h56v6H4z"/>
    <path d="M22.2 22.2c-5.4-4.8-4.3-10.1 1.4-15.4-.4 6.1 7 7.8-1.4 15.4Zm11.2 0c-6.6-5.9-4-12 2.5-18.2-1.3 7.8 7.1 9.8-2.5 18.2Zm10.7 0c-5.4-4.8-4.3-10.1 1.4-15.4-.4 6.1 7 7.8-1.4 15.4Z"/>
  </svg>;
}

function BenefitSketch({ variant }: { variant: BenefitVariant }) {
  if (variant === "location") return <svg className="hero-highlight-sketch" viewBox="0 0 280 142" aria-hidden="true">
    <path className="sketch-soft" d="M18 109c15-18 31-22 49-14 13-19 29-26 48-19 12-13 27-17 45-11 15-12 34-9 55 7 17-5 32 3 46 24v17H18z"/>
    <path className="sketch-foliage" d="M24 108c-2-13 4-22 15-28 9 4 13 13 11 28H24Zm198 0c-2-15 4-26 17-33 11 5 16 16 13 33h-30Z"/>
    <path d="M13 112h254M46 112V91l20-12 20 12v21M52 112V94h28v18M94 112V78h37v34M100 78l13-13 13 13M141 112V60h46v52M148 60l16-18 16 18M155 112V84h18v28M197 112V82h35v30M202 82l13-13 12 13"/>
    <path className="sketch-gold" d="M160 41c-8-7-3-16 4-20 8 4 12 13 4 20h-8Zm-50 23c-6-6-2-13 4-16 6 3 10 10 4 16h-8Zm101 4c-6-6-2-13 4-16 6 3 10 10 4 16h-8Z"/>
    <path d="M164 21V10m-50 38v-9m101 13v-9M25 121c30 7 57 7 84 0m12 0c34 8 68 8 101 0m8 0c12 3 23 3 34 0M61 99h11m49-8h9m34 1h10m36 5h12"/>
  </svg>;
  if (variant === "house") return <svg className="hero-highlight-sketch" viewBox="0 0 280 142" aria-hidden="true">
    <path className="sketch-soft" d="M14 112c8-22 21-31 39-27 7-25 20-38 39-39 11-22 28-34 50-35 25 1 42 15 51 42 20-2 34 9 42 32 18-3 28 6 31 27H14Z"/>
    <path className="sketch-house-fill" d="M91 56 142 22l51 34v56H91z"/>
    <path d="M18 114h246M84 114V55l58-38 58 38v59M95 58h94v56M106 63h23v21h-23zM155 63h23v21h-23zM106 91h23v17h-23zM155 91h23v17h-23zM133 114V88h20v26M93 55l49-33 49 33M178 32V17h11v23"/>
    <path className="sketch-foliage" d="M35 114c-1-24 7-40 24-49 15 9 21 25 18 49H35Zm177 0c-2-25 7-42 25-51 16 9 22 26 18 51h-43Z"/>
    <path d="M59 65v49m-10-30-14-11m24 5 15-13m163-2v51m-10-31-14-12m24 5 15-14M28 122c34 7 68 7 102 0m17 0c35 7 70 7 105 0"/>
    <path className="sketch-gold" d="M110 66h15v14h-15zm49 0h15v14h-15z"/>
  </svg>;
  return <svg className="hero-highlight-sketch" viewBox="0 0 280 142" aria-hidden="true">
    <path className="sketch-soft" d="M11 114V82c20-11 38-10 55 2 14-17 31-23 52-17 17-12 38-11 61 4 22-9 48 3 78 35v8H11Z"/>
    <path className="sketch-foliage" d="M22 113c0-24 8-40 24-49 14 9 20 25 18 49H22Z"/>
    <path d="M13 116h254M89 116V54h105v62M78 54h127M103 54v62m78-62v62M113 88h56M121 88v28m40-28v28M128 82c3-14 12-23 21-23s18 9 21 23"/>
    <path className="sketch-house-fill" d="M102 54h80v10h-80zM30 101h30v15H30z"/>
    <path d="M25 116V98h39v18m-32-18 6-20h14l7 20m-25 8h22M45 78V66m-8 12-8-11m16 4 10-12M211 115c2-18 12-29 27-29h13l15 15v14M216 99h44m-36-13 8-14h16l10 14M224 105h37m-29 10v-8m21 8v-8M86 116c0-14-7-24-16-24m126 24c0-17 8-28 19-28"/>
    <circle cx="231" cy="115" r="4"/><circle cx="253" cy="115" r="4"/>
    <path className="sketch-gold" d="M38 82h14l5 16H33z"/>
  </svg>;
}

