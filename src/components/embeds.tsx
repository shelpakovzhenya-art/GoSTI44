"use client";
import { CmsText } from "@/components/cms-context";


import { useState } from "react";
import { ArrowUpRight, CalendarDays, MapPin, MessageCircle, X } from "lucide-react";
import { useSite } from "@/components/cms-context";

export function Booking() {
  const {site}=useSite();
  const [open,setOpen]=useState(false);
  return <div className="booking-box">
    <div className="booking-box-heading"><span className="booking-icon"><CalendarDays size={28}/></span><div><h3><CmsText id="embeds.001" /></h3><p><CmsText id="embeds.002" /></p></div></div>
    <div className="booking-actions"><button className="button button-yellow" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="booking-widget">{open?"Свернуть бронирование":"Проверить даты и цены"}{open?<X size={18}/>:<ArrowUpRight size={18}/>}</button><a href={site.telegram} target="_blank" rel="noreferrer"><MessageCircle size={18}/> <CmsText id="embeds.003" /></a></div>
    {open && <div id="booking-widget" className="booking-widget"><iframe src={site.booking} title="Выбор дат и бронирование таунхаусов «Танжерин»" allow="payment"/><p><CmsText id="embeds.004" /><a href={site.booking} target="_blank" rel="noreferrer"><CmsText id="embeds.005" /><ArrowUpRight size={13}/></a>.</p></div>}
    <p className="booking-help"><CmsText id="embeds.006" /></p>
    <noscript><a href={site.booking}><CmsText id="embeds.007" /></a></noscript>
  </div>;
}

export function ReviewsWidget() {
  const {site}=useSite();
  const [open,setOpen]=useState(false);
  return <div className="reviews-widget-wrap"><button className="button button-outline" onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="yandex-reviews">{open?"Свернуть отзывы":"Читать отзывы Яндекс Карт на сайте"}{open?<X size={17}/>:<ArrowUpRight size={17}/>}</button>{open&&<div id="yandex-reviews" className="reviews-widget"><iframe src={site.reviewWidget} title="Официальный виджет отзывов Яндекс Карт о таунхаусах «Танжерин»"/><a className="text-link" href={site.yandex} target="_blank" rel="noreferrer"><CmsText id="embeds.008" /><ArrowUpRight size={15}/></a></div>}</div>;
}

export function LocationMap() {
  const {site}=useSite();
  return <div className="location-map map-open"><iframe src={site.mapWidget} title="Яндекс Карта — расположение Танжерина в Костроме" loading="lazy" allowFullScreen/><div className="map-caption"><span><MapPin size={21}/> <CmsText id="embeds.009" /></span><a className="map-direct" href={site.route} target="_blank" rel="noreferrer"><CmsText id="embeds.010" /><ArrowUpRight size={19}/></a></div></div>;
}
