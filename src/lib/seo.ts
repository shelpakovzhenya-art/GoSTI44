import type { Metadata } from "next";
import { getEntries, getSiteContent } from "./content";

export async function getSeoSettings() {
  const entries = await getEntries();
  const settings = entries.find(entry => entry.key === "site-settings")?.data;
  const candidate = process.env.SITE_URL || String(settings?.origin || "");
  let origin: string | undefined;
  try {
    const url = new URL(candidate);
    if (url.protocol === "https:" && !/^(localhost|127\.|0\.|\[::1\])/.test(url.hostname) && !url.username && !url.password) origin = url.origin;
  } catch { /* A domain is deliberately optional until production setup. */ }
  return { entries, origin, indexable: Boolean(origin && settings?.indexable === true && process.env.ALLOW_INDEXING === "true") };
}

export async function pageMetadata(key = "home"): Promise<Metadata> {
  const { entries, origin, indexable } = await getSeoSettings();
  const entry = entries.find(item => item.key === key && item.kind === "page");
  const seo = (entry?.data.seo || {}) as Record<string, unknown>;
  const title = String(seo.title || entry?.data.title || "Танжерин — гостевые дома в Костроме");
  const description = String(seo.description || entry?.data.description || "Три отдельных дома с кухней и верандой в Костроме. Фотографии, удобства и бронирование.");
  const canonical = origin ? String(seo.canonical || `${origin}${key === "home" ? "/" : `/${key}`}`) : undefined;
  return {
    title, description,
    metadataBase: origin ? new URL(origin) : undefined,
    alternates: canonical ? { canonical } : undefined,
    robots: { index: indexable && seo.noindex !== true, follow: indexable },
    openGraph: { title, description, locale: "ru_RU", type: "website", siteName: "Танжерин", ...(canonical ? {url: canonical} : {}), ...(origin ? { images: [{ url: String(seo.ogImage || "/images/hero.jpg"), alt: "Гостевые дома Танжерин в Костроме" }] } : {}) },
  };
}

export async function lodgingSchema() {
  const [{ origin }, content] = await Promise.all([getSeoSettings(), getSiteContent()]);
  return {
    "@context": "https://schema.org", "@type": "LodgingBusiness",
    name: content.site.name, telephone: content.site.phone, email: content.site.email,
    address: content.site.address,
    ...(origin ? {url: origin, image: `${origin}/images/hero.jpg`, "@id": `${origin}/#lodging`} : {}),
    sameAs: [content.site.telegram, content.site.vk, content.site.yandex, content.site.gis, content.site.google],
  };
}
