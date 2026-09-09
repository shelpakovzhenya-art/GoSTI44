import { cache } from "react";
import type { ContentEntry, SiteContent } from "./content-types";

export const getEntries = cache(async (): Promise<ContentEntry[]> => {
  const origin = process.env.CMS_URL;
  if (!origin) throw new Error("CMS_URL is required: the website reads published CMS content only");
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
  return parseContentPayload(await response.json());
});

type RecordData = Record<string, unknown>;

function record(value: unknown, path: string): RecordData {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`Invalid CMS object: ${path}`);
  }
  return value as RecordData;
}

function list(value: unknown, path: string): RecordData[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new Error(`Invalid CMS list: ${path}`);
  return value.map((item, index) => record(item, `${path}[${index}]`));
}

function text(data: RecordData, key: string): string {
  const value = data[key];
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") throw new Error(`Invalid CMS text: ${key}`);
  return value;
}

function number(data: RecordData, key: string): number {
  const value = data[key];
  if ((typeof value !== "number" && typeof value !== "string") || String(value).trim() === "" || !Number.isFinite(Number(value))) {
    throw new Error(`Invalid CMS number: ${key}`);
  }
  return Number(value);
}

function strings(data: RecordData, key: string): string[] {
  const value = data[key];
  if (!Array.isArray(value) || !value.every(item => typeof item === "string")) {
    throw new Error(`Invalid CMS string list: ${key}`);
  }
  return [...value];
}

const photo = (data: RecordData) => ({ src: text(data, "src"), alt: text(data, "alt") });

/** The API boundary also serves signed preview; seed files never enter runtime. */
export function parseContentPayload(value: unknown): ContentEntry[] {
  const payload = record(value, "response");
  if (payload.version !== 1 || !Array.isArray(payload.entries)) throw new Error("Invalid CMS content format");
  const seen = new Set<string>();
  return list(payload.entries, "entries").map((item, index) => {
    const key = text(item, "key");
    const kind = text(item, "kind");
    if (!key || !kind || seen.has(key)) throw new Error(`Invalid or duplicate CMS entry: ${key || index}`);
    seen.add(key);
    return { key, kind, data: record(item.data, key) };
  });
}

type EntryAdapter = (content: SiteContent, entry: ContentEntry) => void;

/** Add one adapter for a new collection kind; order follows the published API. */
const collectionAdapters: Record<string, EntryAdapter> = {
  house(content, { key, data }) {
    const images = list(data.images, `${key}.images`).map(photo);
    if (!images.length || images.some(image => !image.src)) throw new Error(`House ${key} needs a photograph`);
    const tone = text(data, "tone");
    if (!["lime", "lemon", "citrus"].includes(tone)) throw new Error(`Invalid house appearance: ${key}`);
    content.houses.push({
      id: key, name: text(data, "name"), area: number(data, "area"), areaApproximate: data.areaApproximate === true,
      guests: text(data, "guests"), bedrooms: number(data, "bedrooms"), bathrooms: number(data, "bathrooms"),
      label: text(data, "label"), title: text(data, "title"), feature: text(data, "feature"),
      tone: tone as SiteContent["houses"][number]["tone"], description: text(data, "description"),
      images, amenities: strings(data, "amenities"),
    });
  },
  faq(content, { data }) {
    content.rules.push({ title: text(data, "title"), text: text(data, "description") });
  },
  rating(content, { data }) {
    content.ratings.push({
      id: text(data, "id"), name: text(data, "name"), rating: text(data, "rating"),
      count: text(data, "count"), logo: text(data, "logo"), url: text(data, "url"),
    });
  },
  review(content, { data }) {
    content.reviewExcerpts.push({
      name: text(data, "name"), initials: text(data, "initials"), date: text(data, "date"),
      quote: text(data, "quote"), user: text(data, "user"),
    });
  },
  service(content, { data }) {
    content.services.push({
      icon: text(data, "icon"), title: text(data, "title"), text: text(data, "description"),
      detail: text(data, "detail"), className: text(data, "className"),
    });
  },
};

/** Stable CMS keys identify singleton records, never a first matching record. */
const singletonAdapters: Record<string, EntryAdapter> = {
  "site-settings"(content, { data }) {
    for (const field of list(data.fields, "site-settings.fields")) content.site[text(field, "key")] = text(field, "value");
  },
  "site-images"(content, { data }) {
    for (const image of list(data.images, "site-images.images")) content.images[text(image, "key")] = photo(image);
  },
  "main-menu"(content, { data }) {
    content.links = list(data.buttons, "main-menu.buttons").map(button => [text(button, "label"), text(button, "href")]);
  },
  "photo-gallery"(content, { data }) {
    content.photos = list(data.images, "photo-gallery.images").map(photo);
  },
  comforts(content, { data }) {
    content.comforts = list(data.items, "comforts.items").map(item => ({
      icon: text(item, "icon"), title: text(item, "title"), text: text(item, "text"),
    }));
  },
};

export function assembleContent(entries: ContentEntry[]): SiteContent {
  const result: SiteContent = {
    site: {}, texts: {}, images: {}, houses: [], rules: [], ratings: [],
    reviewExcerpts: [], services: [], links: [], photos: [], comforts: [],
  };
  for (const entry of entries) {
    if (entry.kind === "section") {
      for (const item of list(entry.data.texts, `${entry.key}.texts`)) {
        result.texts[`${entry.key}.${text(item, "key")}`] = text(item, "value");
      }
    }
    if (Object.hasOwn(collectionAdapters, entry.kind)) collectionAdapters[entry.kind](result, entry);
    if (Object.hasOwn(singletonAdapters, entry.key)) singletonAdapters[entry.key](result, entry);
  }
  // Page-level H1 has explicit precedence regardless of API ordering.
  const home = entries.find(entry => entry.kind === "page" && entry.key === "home");
  if (home?.data.seo) {
    const heading = text(record(home.data.seo, "home.seo"), "h1");
    if (heading) result.texts["landing.002"] = heading;
  }
  return result;
}

export const getSiteContent = cache(async () => assembleContent(await getEntries()));
