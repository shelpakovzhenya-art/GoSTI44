import Link from "next/link";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { getEntries, getSiteContent } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { ContentProvider } from "@/components/cms-context";
import { Brand } from "@/components/brand";

type Props = { params: Promise<{ slug: string[] }> };
export async function generateMetadata({ params }: Props) {
  return pageMetadata((await params).slug.join("/"));
}
export default async function ContentPage({ params }: Props) {
  const key = (await params).slug.join("/");
  const entries = await getEntries();
  const redirect = entries.find(entry => entry.kind === "redirect" && entry.key === key);
  if (redirect && typeof redirect.data.destination === "string" && /^\/(?!\/)/.test(redirect.data.destination) && redirect.data.destination !== `/${key}`) permanentRedirect(redirect.data.destination);
  const page = entries.find(entry => entry.kind === "page" && entry.key === key);
  if (!page) notFound();
  const content = await getSiteContent();
  const seo = page.data.seo as Record<string, unknown> | undefined;
  const photos = (Array.isArray(page.data.images) ? page.data.images : []) as { src: string; alt: string; caption?: string }[];
  const buttons = (Array.isArray(page.data.buttons) ? page.data.buttons : []) as { label: string; href: string }[];
  return <ContentProvider content={content}>
    <header className="content-header container"><Brand href="/"/><Link className="button button-yellow" href="/#booking">Выбрать даты</Link></header>
    <main id="main" className="content-page container">
      <Link href="/">Главная</Link>
      {Boolean(page.data.eyebrow) && <div className="eyebrow">{String(page.data.eyebrow)}</div>}
      <h1>{String(seo?.h1 || page.data.title || "Танжерин")}</h1>
      {Boolean(page.data.description) && <p>{String(page.data.description)}</p>}
      <div className="prose" dangerouslySetInnerHTML={{ __html: String(page.data.body || "") }}/>
      <div className="content-photos">{photos.map((photo,index)=><figure key={`${photo.src}-${index}`}><Image src={photo.src} alt={photo.alt} width={1200} height={800}/>{photo.caption&&<figcaption>{photo.caption}</figcaption>}</figure>)}</div>
      <div className="content-actions">{buttons.map(button=><a className="button button-yellow" key={button.href} href={button.href}>{button.label}</a>)}</div>
    </main>
    <footer className="content-footer container"><Link href="/#contacts">Контакты и карта</Link><a href={content.site.phoneHref}>{content.site.phone}</a></footer>
  </ContentProvider>;
}
