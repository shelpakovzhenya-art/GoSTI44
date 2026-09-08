"use client";
import Image from "@/components/cms-image";
import { ArrowUpRight } from "lucide-react";
import { useSite } from "@/components/cms-context";

export function Stars() { return <span className="stars" aria-label="5 из 5">★★★★★</span>; }

export function Ratings({ compact = false }: { compact?: boolean }) {
  const {ratings,site}=useSite();
  return <div className={compact ? "ratings ratings-compact" : "ratings"}>
    {ratings.map(item => <a className={`rating-card rating-${item.id}`} key={item.id} href={item.url} target="_blank" rel="noreferrer" aria-label={`${item.name}: рейтинг ${item.rating} из 5. ${item.count}. Проверено ${site.checked}`}>
      <div className="rating-brand"><span className="map-logo"><Image src={item.logo} alt={`Логотип ${item.name}`} width={46} height={46}/></span><span>{item.name}<small>{item.count}</small></span></div>
      <div className="rating-score"><strong>{item.rating}</strong><Stars/><ArrowUpRight size={18}/></div>
    </a>)}
  </div>;
}
