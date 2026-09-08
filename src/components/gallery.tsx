"use client";
import {useSite} from "@/components/cms-context";


import Image from "@/components/cms-image";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";



function Lightbox({start,onClose}:{start:number;onClose:()=>void}) {
  const {photos}=useSite();
  const dialog=useRef<HTMLDialogElement>(null);
  const [index,setIndex]=useState(start);
  const step=(direction:number)=>setIndex(previous=>(previous+direction+photos.length)%photos.length);
  useEffect(()=>{const element=dialog.current;const opener=document.activeElement instanceof HTMLElement?document.activeElement:null;const overflow=document.body.style.overflow;element?.showModal();document.body.style.overflow="hidden";return()=>{element?.close();document.body.style.overflow=overflow;if(opener?.isConnected)opener.focus({preventScroll:true});};},[]);
  return <dialog ref={dialog} className="lightbox" aria-label="Фотогалерея таунхаусов" onCancel={event=>{event.preventDefault();onClose();}} onKeyDown={event=>{if(event.key==="ArrowRight")step(1);if(event.key==="ArrowLeft")step(-1);}}><button className="icon-button lightbox-close" onClick={onClose} aria-label="Закрыть фотогалерею"><X/></button><figure><div className="lightbox-image"><Image src={photos[index].src} alt={photos[index].alt} fill sizes="90vw"/></div><figcaption aria-live="polite"><span>{photos[index].alt}</span><span>{index+1} / {photos.length}</span></figcaption></figure><div className="lightbox-buttons"><button className="icon-button" onClick={()=>step(-1)} aria-label="Предыдущее фото"><ChevronLeft/></button><button className="icon-button" onClick={()=>step(1)} aria-label="Следующее фото"><ChevronRight/></button></div></dialog>;
}

export function Gallery() {
  const {photos}=useSite();
  const [selected,setSelected]=useState<number|null>(null);
  return <><div className="gallery-grid">{photos.map((photo,index)=><button key={photo.src} className={`gallery-photo gallery-photo-${index}`} onClick={()=>setSelected(index)} aria-label={`Открыть фото: ${photo.alt}`}><Image src={photo.src} alt={photo.alt} fill sizes={index===0 ? "(max-width:760px) 90vw, 530px" : "(max-width:760px) 45vw, 350px"}/><span>{index===0?"Крытая веранда":photo.alt}<ArrowUpRight size={20}/></span></button>)}</div>{selected!==null && <Lightbox start={selected} onClose={()=>setSelected(null)}/>}</>;
}
