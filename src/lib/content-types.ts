import type { House } from "@/data/site";

export type SiteContent = {
  site: Record<string, string>;
  houses: House[];
  ratings: { id: string; name: string; rating: string; count: string; logo: string; url: string }[];
  reviewExcerpts: { name: string; initials: string; date: string; quote: string; user: string }[];
  rules: { title: string; text: string }[];
  texts: Record<string, string>;
  images: Record<string, {src: string; alt: string}>;
  comforts: {icon:string;title:string;text:string}[];
  services: {icon:string;title:string;text:string;detail:string;className:string}[];
  photos: {src:string;alt:string}[];
  links: string[][];
};

export type ContentEntry = {
  key: string;
  kind: string;
  data: Record<string, unknown>;
  updatedAt?: string;
};
