import Landing from "@/components/landing";
import { ContentProvider } from "@/components/cms-context";
import { getSiteContent } from "@/lib/content";
import { lodgingSchema, pageMetadata } from "@/lib/seo";
export const generateMetadata = () => pageMetadata();
export default async function Home() {
  const [content, schema]=await Promise.all([getSiteContent(), lodgingSchema()]);
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/><ContentProvider content={content}><Landing/></ContentProvider></>;
}
