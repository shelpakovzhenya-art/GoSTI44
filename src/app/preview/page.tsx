import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { assembleContent, parseContentPayload } from "@/lib/content";
import type { ContentEntry } from "@/lib/content-types";
import { ContentProvider } from "@/components/cms-context";
import Landing from "@/components/landing";

export const metadata: Metadata = {title:"Предпросмотр черновика — Танжерин",robots:{index:false,follow:false},referrer:"no-referrer"};
export default async function Preview({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  const query=await searchParams;
  if(!process.env.CMS_URL || typeof query.record!=="string" || !/^\d+$/.test(query.record) || typeof query.expires!=="string" || !/^\d+$/.test(query.expires) || typeof query.signature!=="string" || !/^[a-f0-9]{64}$/.test(query.signature)) notFound();
  const params=new URLSearchParams({expires:query.expires,signature:query.signature});
  const response=await fetch(`${process.env.CMS_URL.replace(/\/$/,"")}/api/preview/${query.record}?${params}`,{cache:"no-store",headers:{Accept:"application/json"},signal:AbortSignal.timeout(5000)});
  if(response.status===403 || response.status===404)notFound();
  if(response.status===422)return <main id="main" className="content-page container"><h1>Заполните обязательные поля</h1><p>Вернитесь в админку и сохраните дом с фотографиями и основными характеристиками.</p></main>;
  if(!response.ok)throw new Error("Preview unavailable");
  const payload=await response.json() as {entries:ContentEntry[];target:string;kind:string};
  const content=assembleContent(parseContentPayload(payload));
  const entry=payload.entries.find(item=>item.key===payload.target);
  return <ContentProvider content={content}><aside className="preview-notice">Предпросмотр сохранённого черновика · сайт для гостей не изменён · ссылка действует 15 минут</aside>{payload.kind==="page"&&payload.target!=="home"?<main id="main" className="content-page container"><h1>{String((entry?.data.seo as Record<string,unknown>|undefined)?.h1||entry?.data.title||"")}</h1><p>{String(entry?.data.description||"")}</p><div className="prose" dangerouslySetInnerHTML={{__html:String(entry?.data.body||"")}}/></main>:<Landing/>}</ContentProvider>;
}
