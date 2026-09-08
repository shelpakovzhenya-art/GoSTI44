import type { MetadataRoute } from "next";
import { getSeoSettings } from "@/lib/seo";
export default async function robots(): Promise<MetadataRoute.Robots> {
  const {origin,indexable}=await getSeoSettings();
  return indexable ? {rules:{userAgent:"*",allow:"/",disallow:["/admin","/api/"]},sitemap:`${origin}/sitemap.xml`} : {rules:{userAgent:"*",disallow:"/"}};
}
