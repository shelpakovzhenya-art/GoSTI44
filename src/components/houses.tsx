"use client";
import { CmsText } from "@/components/cms-context";


import Image from "@/components/cms-image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Bath, BedDouble, Check, ChevronLeft, ChevronRight, Maximize2, Users, X } from "lucide-react";
import { HouseEmblem } from "@/components/house-emblem";
import { type House } from "@/data/site";
import { useSite } from "@/components/cms-context";

function HouseDialog({ house, onClose }: { house: House; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [photo, setPhoto] = useState(0);
  const step = (direction: number) => setPhoto(previous => (previous + direction + house.images.length) % house.images.length);
  useEffect(() => {
    const element = dialog.current;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => { element?.close(); document.body.style.overflow = overflow; if (opener?.isConnected) opener.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialog} className="house-dialog" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }} onKeyDown={event => { if(event.key === "ArrowRight") step(1); if(event.key === "ArrowLeft") step(-1); }} aria-labelledby={`dialog-${house.id}`}>
    <div className="dialog-inner"><div className="dialog-toolbar"><span><CmsText id="houses.001" fallback="Дом «" />{" "}{house.name}»</span><button className="icon-button dialog-close" onClick={onClose} aria-label="Закрыть описание"><X size={20}/></button></div>
      <div className="dialog-image"><Image src={house.images[photo].src} alt={house.images[photo].alt} fill sizes="(max-width: 760px) 90vw, 900px"/><div className="photo-controls"><button className="icon-button" aria-label="Предыдущее фото дома" onClick={() => step(-1)}><ChevronLeft/></button><span aria-live="polite">{photo+1} / {house.images.length}</span><button className="icon-button" aria-label="Следующее фото дома" onClick={() => step(1)}><ChevronRight/></button></div></div>
      <div className="dialog-copy"><div className="eyebrow"><CmsText id="houses.002" fallback="ВАШ ДОМ В КОСТРОМЕ" /></div><h2 id={`dialog-${house.id}`}><HouseEmblem tone={house.tone}/><span><CmsText id="houses.003" fallback="Дом «" />{" "}{house.name}»</span></h2><div className="house-specs"><span><Maximize2 size={16}/>{house.tone === "lemon" ? "≈ " : ""}{house.area} <CmsText id="houses.004" fallback="м²" /></span><span><Users size={16}/>{house.guests} <CmsText id="houses.005" fallback="гостей" /></span><span><Bath size={16}/>{house.bathrooms} <CmsText id="houses.006" fallback="санузла" /></span></div><p>{house.description}</p><ul className="amenity-list">{house.amenities.map(item=><li key={item}><Check size={16}/>{item}</li>)}</ul><p className="small-note"><CmsText id="houses.007" fallback="Постельное бельё, полотенца и Wi-Fi включены. Дополнительное место и состав гостей согласовываются при бронировании." /></p><a className="button button-dark" href="#booking" onClick={onClose}><CmsText id="houses.008" fallback="Проверить даты и стоимость" /><ArrowUpRight size={18}/></a></div>
    </div>
  </dialog>;
}

function HouseCard({house, onSelect}: { house: House; onSelect: () => void }) {
  const [photo, setPhoto] = useState(0);
  return <article className={`house-card house-${house.tone}`}>
    <div className="house-image"><button className="house-image-open" onClick={onSelect} aria-label={`Посмотреть дом «${house.name}»`}><Image src={house.images[photo].src} alt={house.images[photo].alt} fill sizes="(max-width: 760px) 90vw, (max-width: 1100px) 45vw, 430px"/></button><h3 className="house-image-tag"><HouseEmblem tone={house.tone}/>{house.name.toUpperCase()}</h3><button className="image-next" onClick={()=>setPhoto(previous=>(previous+1)%house.images.length)} aria-label={`Следующая фотография: ${house.name}`}><ChevronRight size={19}/></button><div className="image-dots" aria-label={`Фотография ${photo+1} из ${house.images.length}`}>{house.images.map((image,i)=><span className={i===photo ? "active" : ""} key={image.src}/>)}</div></div>
    <div className="house-copy"><div className="house-specs"><span><Maximize2 size={15}/>{house.tone === "lemon" ? "≈ " : ""}{house.area} <CmsText id="houses.009" fallback="м²" /></span><span><Users size={15}/>{house.guests} <CmsText id="houses.010" fallback="гостей" /></span><span><BedDouble size={15}/>{house.bedrooms} <CmsText id="houses.011" fallback="спальни" /></span></div><h4 className="house-promise">{house.title}</h4><p>{house.description}</p><div className="house-tags"><span><CmsText id="houses.012" fallback="Своя веранда" /></span><span><CmsText id="houses.013" fallback="Кухня" /></span><span>{house.feature}</span></div><div className="house-actions"><button onClick={onSelect}><CmsText id="houses.014" fallback="Посмотреть" />{" "}{house.name.toUpperCase()} <ArrowUpRight size={19}/></button><a href="#booking"><CmsText id="houses.015" fallback="Выбрать даты" /><ArrowUpRight size={17}/></a></div></div>
  </article>;
}

export function Houses() {
  const {houses}=useSite();
  const [selected, setSelected] = useState<House | null>(null);
  return <><div className="houses-grid">{houses.map(house=><HouseCard key={house.id} house={house} onSelect={()=>setSelected(house)}/>)}</div>{selected && <HouseDialog key={selected.id} house={selected} onClose={()=>setSelected(null)}/>}</>;
}
