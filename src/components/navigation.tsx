"use client";
import { CmsText } from "@/components/cms-context";


import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin, Menu, Phone, X } from "lucide-react";
import { useSite } from "@/components/cms-context";
import { Brand } from "@/components/brand";
import { ContactLinks } from "@/components/contact-links";



export function Navigation() {
  const {site,links}=useSite();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 60);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <>
    <div className="topline"><div className="container topline-inner"><a href={site.route} target="_blank" rel="noreferrer"><MapPin size={16} /> <CmsText id="navigation.001" fallback="Кострома, Октябрьская, 47" /></a><span><CmsText id="navigation.002" fallback="Кухня и веранда в каждом доме" /></span></div></div>
    <header className={`header${scrolled ? " is-scrolled" : ""}${open ? " menu-open" : ""}`} onKeyDown={event => { if (event.key === "Escape" && open) { setOpen(false); menuButton.current?.focus(); } }}>
      <div className="container header-inner">
        <Brand/>
        <nav className="desktop-nav" aria-label="Основная навигация">{links.filter(([,id]) => !["company","about"].includes(id.replace(/^#/,""))).map(([title,id]) => <a key={id} href={/^(https?:|mailto:|tel:|\/|#)/.test(id)?id:`#${id}`}>{title}</a>)}</nav>
        <a className="header-phone" href={site.phoneHref}><Phone size={18}/><span>{site.phone}<small><CmsText id="navigation.003" fallback="Светлана · бронирование" /></small></span></a>
        <ContactLinks/>
        <a className="button button-yellow header-book" href="#booking"><CmsText id="navigation.004" fallback="Проверить даты" /><ArrowUpRight size={16}/></a>
        <button ref={menuButton} className="icon-button menu-toggle" aria-label={open ? "Закрыть меню" : "Открыть меню"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Мобильная навигация">{links.map(([title,id]) => <a key={id} href={/^(https?:|mailto:|tel:|\/|#)/.test(id)?id:`#${id}`} onClick={() => setOpen(false)}>{title}<ArrowUpRight size={18}/></a>)}<a href={site.phoneHref}><Phone size={18}/>{site.phone}</a><a className="button button-yellow" href="#booking" onClick={() => setOpen(false)}><CmsText id="navigation.005" fallback="Выбрать даты" /><ArrowUpRight size={18}/></a></nav>}
    </header>
    <div className="mobile-bottom"><a href={site.phoneHref} aria-label="Позвонить Светлане"><Phone size={20}/></a><a className="button button-yellow" href="#booking"><CmsText id="navigation.006" fallback="Выбрать даты" /><ArrowUpRight size={18}/></a></div>
  </>;
}
