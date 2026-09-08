import initial from "../../content/site.json";

export type House = {
  id: string; name: string; area: number; guests: string; bedrooms: number;
  bathrooms: number; label: string; title: string; feature: string; tone: "lime" | "lemon" | "citrus"; description: string;
  images: { src: string; alt: string }[]; amenities: string[];
};

// Initial content for setup; live pages read published CMS data.
export const site=initial.site;
