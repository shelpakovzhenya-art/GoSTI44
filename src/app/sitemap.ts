import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/seo";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const {origin,indexable,entries}=await getSeoSettings();
  if (!origin || !indexable) return [];
  return entries.filter(entry=>entry.kind==='page' && (entry.data.seo as Record<string,unknown>|undefined)?.noindex!==true).map(entry=>({url:`${origin}${entry.key==='home'?'/':`/${entry.key}`}`,lastModified:entry.updatedAt}));
}
