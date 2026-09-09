import { cache } from "react";
import initialSite from "../../content/site.json";
import initialSections from "../../content/sections.json";
import initialCollections from "../../content/collections.json";
import type { ContentEntry, SiteContent } from "./content-types";

export const getEntries = cache(async (): Promise<ContentEntry[]> => {
  const origin = process.env.CMS_URL;
  if (!origin) {
    if (process.env.CONTENT_SOURCE !== "seed") throw new Error("Set CMS_URL or explicitly use CONTENT_SOURCE=seed for local preview");
    return initialSections.map(section => ({ key: section.key, kind: section.kind, data: section.draft }));
  }
  // The local PHP development server can take longer on a cold request.
  const timeoutMs = process.env.NODE_ENV === "development" ? 30_000 : 5_000;
  const response = await fetch(`${origin.replace(/\/$/, "")}/api/content`, {
    cache: "no-store", signal: AbortSignal.timeout(timeoutMs),
  }).catch((cause: unknown) => {
    // Next's dev overlay cannot annotate DOMException.message (read-only).
    if (cause instanceof Error && ["TimeoutError", "AbortError"].includes(cause.name)) {
      throw new Error("CMS published content request timed out", { cause });
    }
    throw cause;
  });
  if (!response.ok) throw new Error("CMS published content is unavailable");
  const payload = await response.json();
  if (payload.version !== 1 || !Array.isArray(payload.entries)) throw new Error("Invalid CMS content format");
  return payload.entries;
});

export function assembleContent(entries: ContentEntry[], usingCms = true): SiteContent {
  const result = structuredClone(initialSite) as unknown as SiteContent;

  result.texts = {};
  result.images = {};
  Object.assign(result,structuredClone(initialCollections));
  for (const entry of entries) {
    if (entry.kind === "section" && Array.isArray(entry.data.texts)) {
      for (const text of entry.data.texts) {
        if (typeof text.key === "string" && typeof text.value === "string") result.texts[`${entry.key}.${text.key}`] = text.value;
      }
    }
    if (entry.kind === "settings" && Array.isArray(entry.data.fields)) {
      for (const field of entry.data.fields) if (typeof field.key === "string" && typeof field.value === "string") result.site[field.key] = field.value;
    }
    if (entry.key === "site-images" && Array.isArray(entry.data.images)) {
      for (const image of entry.data.images) if (typeof image.key === "string" && typeof image.src === "string") result.images[image.key] = {src: image.src, alt: String(image.alt ?? "")};
    }
  }
  const homes = entries.filter(entry => entry.kind === "house");
  if (usingCms || homes.length) result.houses = homes.map(entry => ({ ...entry.data, id: entry.key }) as unknown as SiteContent["houses"][number]);
  const faqs = entries.filter(entry => entry.kind === "faq");
  if (usingCms || faqs.length) result.rules = faqs.map(entry => ({ title: String(entry.data.title ?? ""), text: String(entry.data.description ?? "") }));
  const ratings = entries.filter(entry => entry.kind === "rating");
  if (usingCms || ratings.length) result.ratings = ratings.map(entry => entry.data as unknown as SiteContent["ratings"][number]);
  const reviews = entries.filter(entry => entry.kind === "review");
  if (usingCms || reviews.length) result.reviewExcerpts = reviews.map(entry => entry.data as unknown as SiteContent["reviewExcerpts"][number]);
  const homeSeo = entries.find(entry => entry.kind === "page" && entry.key === "home")?.data.seo as Record<string, unknown> | undefined;
  if (typeof homeSeo?.h1 === "string" && homeSeo.h1) result.texts["landing.002"] = homeSeo.h1;
  const menu = entries.find(entry => entry.kind === "menu");
  if (menu && Array.isArray(menu.data.buttons)) result.links = menu.data.buttons.map(button => [String(button.label),String(button.href)]);
  const gallery = entries.find(entry => entry.key === "photo-gallery");
  if (gallery && Array.isArray(gallery.data.images)) result.photos = gallery.data.images as SiteContent["photos"];
  const comforts = entries.find(entry => entry.key === "comforts");
  if (comforts && Array.isArray(comforts.data.items)) result.comforts = comforts.data.items as SiteContent["comforts"];
  const services = entries.filter(entry => entry.kind === "service");
  if (usingCms || services.length) result.services = services.map(entry=>({icon:String(entry.data.icon||"Leaf"),title:String(entry.data.title||""),text:String(entry.data.description||""),detail:String(entry.data.detail||""),className:String(entry.data.className||"comfort")}));
  return result;
}

export const getSiteContent = cache(async () => assembleContent(await getEntries(), Boolean(process.env.CMS_URL)));
