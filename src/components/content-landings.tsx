import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Baby,
  Bath,
  BedDouble,
  Check,
  CookingPot,
  Gift,
  House as HouseIcon,
  Landmark,
  Map,
  MapPin,
  MoonStar,
  Sofa,
  Trees,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Image from "@/components/cms-image";
import { Brand, Foliage } from "@/components/brand";
import { ContactLinks } from "@/components/contact-links";
import { HouseEmblem } from "@/components/house-emblem";
import { Navigation } from "@/components/navigation";
import type { ContentEntry, House, SiteContent } from "@/lib/content-types";

type Button = { label: string; href: string };
type Photo = { src: string; alt: string; caption?: string };
type GuideItem = { title: string; meta: string; description: string; href: string };

const houseSlugs: Record<string, string> = { lime: "laym", lemon: "limon", citrus: "citrus" };
const houseHref = (house: House) => `/doma/${houseSlugs[house.id] || house.id}`;

function pageTexts(page: ContentEntry) {
  const items = Array.isArray(page.data.texts) ? page.data.texts : [];
  return Object.fromEntries(items.flatMap(item => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const value = item as Record<string, unknown>;
    return typeof value.key === "string" && typeof value.value === "string" ? [[value.key, value.value]] : [];
  })) as Record<string, string>;
}

function pageButtons(page: ContentEntry) {
  return (Array.isArray(page.data.buttons) ? page.data.buttons : []) as Button[];
}

function pagePhotos(page: ContentEntry) {
  return (Array.isArray(page.data.images) ? page.data.images : []) as Photo[];
}

function ActionLink({ button, site, secondary = false }: { button: Button; site: SiteContent["site"]; secondary?: boolean }) {
  const href = button.href === "#telegram" ? site.telegram : button.href;
  const external = /^https?:/.test(href);
  return <a className={secondary ? "detail-button detail-button-secondary" : "detail-button"} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{button.label}<ArrowUpRight size={18}/></a>;
}

function DetailActions({ page, site }: { page: ContentEntry; site: SiteContent["site"] }) {
  return <div className="detail-actions">{pageButtons(page).map((button, index) => <ActionLink key={`${button.href}-${button.label}`} button={button} site={site} secondary={index > 0}/>)}</div>;
}

function Stat({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return <div className="detail-stat"><span>{icon}</span><div><strong>{title}</strong><small>{text}</small></div></div>;
}

function MiniHouseCard({ house }: { house: House }) {
  return <article className={`detail-house-card detail-house-${house.tone}`}>
    <Link className="detail-house-photo" href={houseHref(house)}><Image src={house.images[0].src} alt={house.images[0].alt} fill sizes="(max-width:760px) 42vw, 240px"/></Link>
    <div><div className="detail-house-name"><HouseEmblem tone={house.tone}/><h3>{house.name}</h3></div><strong>{house.guests} гостей</strong><p>{house.bedrooms} спальни · {house.bathrooms} санузла · {house.areaApproximate ? "около " : ""}{house.area} м²</p><Link href={houseHref(house)} aria-label={`Открыть страницу дома «${house.name}»`}><ArrowRight/></Link></div>
  </article>;
}

function DetailFooter({ content }: { content: SiteContent }) {
  return <footer className="detail-footer"><div className="container detail-footer-inner"><Brand href="/"/><div className="detail-footer-copy"><strong>Три дома в Костроме</strong><span>{content.site.address}</span><a href={content.site.phoneHref}>{content.site.phone}</a></div><ContactLinks labels/><a className="detail-route" href={content.site.route} target="_blank" rel="noreferrer"><MapPin size={18}/> Построить маршрут</a></div></footer>;
}

function HouseLanding({ page, content, house }: { page: ContentEntry; content: SiteContent; house: House }) {
  const text = pageTexts(page);
  const seo = (page.data.seo || {}) as Record<string, unknown>;
  const otherHouses = content.houses.filter(item => item.id !== house.id);
  const icons = [<BedDouble key="bed"/>, <CookingPot key="kitchen"/>, <HouseIcon key="veranda"/>];
  const houseDecor = {
    lime: { hero:"lime-sprig", intro:"palm-frond", amenities:"jasmine-arc", gallery:"olive-rosemary-sprig", other:"kumquat-sprig" },
    lemon: { hero:"tangerine-branch", intro:"resort-leaves", amenities:"orange-blossom-vine", gallery:"maidenhair-fern", other:"bergamot-branch" },
    citrus: { hero:"orange-blossom-sprig", intro:"citrus-leaves", amenities:"orange-pair", gallery:"jasmine-arc", other:"tropical-palm" },
  }[house.id] || { hero:"citrus-leaves", intro:"palm-frond", amenities:"jasmine-arc", gallery:"maidenhair-fern", other:"kumquat-sprig" };
  return <>
    <Navigation subpage/>
    <main id="main" className={`detail-landing house-landing detail-tone-${house.tone}`}>
      <section className="detail-hero detail-house-hero">
        <Foliage className="detail-hero-leaves" asset={houseDecor.hero} eager/>
        <div className="container detail-hero-grid">
          <div className="detail-hero-copy"><Link className="detail-back" href="/#houses">← Все дома</Link><div className="eyebrow">{String(page.data.eyebrow || "ДОМ В КОСТРОМЕ")}</div><div className="detail-house-mark"><HouseEmblem tone={house.tone}/><span>{house.name}</span></div><h1>{String(seo.h1 || page.data.title)}</h1><p>{String(page.data.description || house.description)}</p><DetailActions page={page} site={content.site}/></div>
          <figure className="detail-hero-photo"><Image src={house.images[0].src} alt={house.images[0].alt} fill priority sizes="(max-width:760px) 100vw, 56vw"/><figcaption>{house.name} · {house.guests} гостей</figcaption></figure>
        </div>
        <div className="container detail-stats detail-house-stats"><Stat icon={<Users/>} title={`${house.guests} гостей`} text="в одном доме"/><Stat icon={<BedDouble/>} title={`${house.bedrooms} спальни`} text="для личного пространства"/><Stat icon={<Bath/>} title={`${house.bathrooms} санузла`} text="внутри дома"/><Stat icon={<HouseIcon/>} title={`${house.areaApproximate ? "≈ " : ""}${house.area} м²`} text="площадь дома"/></div>
      </section>

      <section className="detail-section detail-intro botanical-section"><Foliage className="detail-intro-foliage" asset={houseDecor.intro}/><div className="container detail-intro-grid"><div><div className="eyebrow">{text.featureEyebrow}</div><h2>{text.featureTitle}</h2><p>{text.featureText}</p><div className="detail-rich" dangerouslySetInnerHTML={{ __html: String(page.data.body || "") }}/></div><div className="detail-highlight-grid">{[1,2,3].map((number, index) => <article key={number}><span>{icons[index]}</span><h3>{text[`highlight${number}Title`]}</h3><p>{text[`highlight${number}Text`]}</p></article>)}</div></div></section>

      <section className="detail-section detail-amenities botanical-section"><Foliage className="detail-amenities-fruit" asset={houseDecor.amenities}/><div className="container detail-amenities-grid"><div><span className="detail-section-number">01</span><h2>{text.amenitiesTitle}</h2><p>{house.description}</p></div><ul>{house.amenities.map(item => <li key={item}><Check/><span>{item}</span></li>)}</ul></div></section>

      <section className="detail-section detail-gallery botanical-section"><Foliage className="detail-gallery-foliage" asset={houseDecor.gallery}/><div className="container"><div className="detail-section-heading"><div><div className="eyebrow">{text.galleryEyebrow}</div><h2>{text.galleryTitle}</h2></div><span>{house.images.length} фото</span></div><div className={`detail-gallery-grid detail-gallery-${house.images.length}`}>{house.images.map((photo, index) => <figure key={photo.src} className={index === 0 ? "detail-gallery-main" : ""}><Image src={photo.src} alt={photo.alt} fill sizes={index === 0 ? "(max-width:760px) 100vw, 60vw" : "(max-width:760px) 50vw, 32vw"}/>{index > 0 && <figcaption>{photo.alt}</figcaption>}</figure>)}</div></div></section>

      <section className="detail-section detail-other-houses botanical-section"><Foliage className="detail-other-foliage" asset={houseDecor.other}/><div className="container"><div className="detail-section-heading"><h2>{text.otherTitle}</h2><Link href="/dlya-bolshoy-kompanii">Едете большой компанией? <ArrowUpRight/></Link></div><div className="detail-house-list">{otherHouses.map(item => <MiniHouseCard key={item.id} house={item}/>)}</div></div></section>

      <section className="detail-closing"><Image src="/images/veranda.jpg" alt="Собственная веранда дома в «Танжерине»" fill sizes="100vw"/><div className="detail-closing-shade"/><div className="container detail-closing-copy"><div><h2>{text.closingTitle}</h2><p>{text.closingText}</p></div><DetailActions page={page} site={content.site}/></div></section>
    </main>
    <DetailFooter content={content}/>
  </>;
}

function ScenarioCard({ photo, title, text }: { photo: Photo; title: string; text: string }) {
  return <article className="company-scenario"><div><Image src={photo.src} alt={photo.alt} fill sizes="(max-width:760px) 100vw, 33vw"/></div><h3>{title}</h3><p>{text}</p></article>;
}

function CompanyLanding({ page, content }: { page: ContentEntry; content: SiteContent }) {
  const text = pageTexts(page);
  const photos = pagePhotos(page);
  const scenarios = [
    { photo: photos[1], title: text.scenario1Title, text: text.scenario1Text },
    { photo: photos[2], title: text.scenario2Title, text: text.scenario2Text },
    { photo: photos[3], title: text.scenario3Title, text: text.scenario3Text },
  ].filter(item => item.photo);
  return <>
    <Navigation subpage/>
    <main id="main" className="detail-landing company-landing">
      <section className="detail-hero company-detail-hero botanical-section"><Foliage className="company-hero-foliage" asset="resort-leaves" eager/><div className="container company-hero-grid"><div className="company-hero-copy"><Link className="detail-back" href="/">← Главная</Link><div className="eyebrow">{String(page.data.eyebrow || "ЕДЕТЕ БОЛЬШОЙ КОМПАНИЕЙ?")}</div><h1>{text.heroTitle}</h1><p>{String(page.data.description || "")}</p><DetailActions page={page} site={content.site}/><div className="detail-rich" dangerouslySetInnerHTML={{__html:String(page.data.body || "")}}/></div><figure className="company-hero-photo"><Image src={photos[0]?.src || "/images/hero.jpg"} alt={photos[0]?.alt || "Большой дом и сад «Танжерина»"} fill priority sizes="(max-width:760px) 100vw, 52vw"/><div className="company-house-labels" aria-label="Дома Лайм, Лимон и Цитрус">{content.houses.map(house => <span key={house.id}>{house.name}</span>)}</div><figcaption>Один большой дом · три самостоятельных дома внутри</figcaption></figure></div>
        <div className="container detail-stats company-stats"><Stat icon={<Users/>} title={text.fact1Title} text={text.fact1Text}/><Stat icon={<BedDouble/>} title={text.fact2Title} text={text.fact2Text}/><Stat icon={<MapPin/>} title={text.fact3Title} text={text.fact3Text}/></div>
      </section>

      <section className="detail-section company-scenarios botanical-section"><Foliage className="detail-intro-foliage" asset="orange-blossom-sprig"/><div className="container"><div className="detail-section-heading"><h2>{text.scenariosTitle}</h2><span className="hand-note">Вместе, когда хочется ♡</span></div><div className="company-scenario-grid">{scenarios.map(item => <ScenarioCard key={item.title} {...item}/>)}</div></div></section>

      <section className="detail-section company-reasons botanical-section"><Foliage className="company-reasons-foliage" asset="maidenhair-fern"/><div className="container"><h2>{text.reasonsTitle}</h2><div className="company-reason-grid"><article><span><Sofa/></span><h3>{text.reason1Title}</h3><p>{text.reason1Text}</p></article><article><span><UtensilsCrossed/></span><h3>{text.reason2Title}</h3><p>{text.reason2Text}</p></article><article><span><MoonStar/></span><h3>{text.reason3Title}</h3><p>{text.reason3Text}</p></article></div></div></section>

      <section className="detail-section company-houses botanical-section"><Foliage className="detail-gallery-foliage" asset="lime-sprig"/><div className="container"><div className="detail-section-heading"><h2>{text.housesTitle}</h2><Link href="/#houses">Сравнить подробно <ArrowUpRight/></Link></div><div className="detail-house-list">{content.houses.map(house => <MiniHouseCard key={house.id} house={house}/>)}</div></div></section>

      <section className="company-note botanical-section"><Foliage className="detail-other-foliage" asset="jasmine-arc"/><div className="container"><Trees/><div><h2>{text.noteTitle}</h2><p>{text.noteText}</p></div><span className="hand-note">Хорошие люди всегда рядом ♡</span></div></section>

      <section className="detail-closing company-closing"><Image src="/images/veranda.jpg" alt="Веранда одного из домов «Танжерин»" fill sizes="100vw"/><div className="detail-closing-shade"/><div className="container detail-closing-copy"><div><h2>{text.closingTitle}</h2><p>{text.closingText}</p><small><Check/> Быстро ответим · <Check/> Подскажем подходящие дома</small></div><DetailActions page={page} site={content.site}/></div></section>
    </main>
    <DetailFooter content={content}/>
  </>;
}

function GuideLanding({ page, content }: { page: ContentEntry; content: SiteContent }) {
  const photos = pagePhotos(page);
  const items = (Array.isArray(page.data.guideItems) ? page.data.guideItems : []) as GuideItem[];
  const guideType = String(page.data.guideType || "overview");
  const isFood = guideType === "food";
  const isOverview = guideType === "overview";
  const guideIcons = {
    food: UtensilsCrossed,
    itinerary: Map,
    family: Baby,
    souvenirs: Gift,
    overview: MapPin,
    museums: Landmark,
    sights: Landmark,
  } as const;
  const HeroIcon = guideIcons[guideType as keyof typeof guideIcons] || Landmark;
  const listTitle = String(page.data.listTitle || (isOverview ? "Спланируйте поездку" : isFood ? "Где поесть в Костроме" : "Что посмотреть в Костроме"));
  const sourceLabel = String(page.data.sourceLabel || "Проверено по городскому туристическому порталу");
  const noteTitle = String(page.data.noteTitle || "Проверьте детали перед выездом");
  const noteText = String(page.data.noteText || "Режим работы площадок меняется. На карточках оставлены ссылки на официальные страницы, а дорогу от дома можно построить в Яндекс Картах.");
  const closingTitle = String(page.data.closingTitle || "После прогулки — домой");
  const closingText = String(page.data.closingText || "Выберите свободные даты и возвращайтесь в тихий дом со своей кухней и верандой.");
  const seo = (page.data.seo || {}) as Record<string, unknown>;
  const guideDecor = ({
    food: ["olive-rosemary-sprig", "jasmine-arc", "palm-frond"],
    itinerary: ["tangerine-branch", "maidenhair-fern", "orange-pair"],
    family: ["orange-blossom-vine", "resort-leaves", "kumquat-sprig"],
    souvenirs: ["bergamot-branch", "palm-frond", "tangerines"],
    overview: ["citrus-leaves", "jasmine-arc", "tropical-palm"],
    museums: ["lime-sprig", "maidenhair-fern", "orange-blossom-sprig"],
    sights: ["kumquat-sprig", "resort-leaves", "olive-rosemary-sprig"],
  } as Record<string, [string,string,string]>)[guideType] || ["citrus-leaves", "maidenhair-fern", "orange-pair"];
  return <>
    <Navigation subpage/>
    <main id="main" className={`detail-landing guide-landing guide-${guideType}`}>
      <section className="guide-hero botanical-section"><Foliage className="guide-hero-foliage" asset={guideDecor[0]} eager/><div className="container guide-hero-grid"><div className="guide-hero-copy"><Link className="detail-back" href="/">← Главная</Link><div className="eyebrow">{String(page.data.eyebrow || "КОСТРОМА ДЛЯ ГОСТЕЙ")}</div><span className="guide-emblem"><HeroIcon/></span><h1>{String(seo.h1 || page.data.title || "Кострома")}</h1><p>{String(page.data.description || "")}</p><div className="detail-rich" dangerouslySetInnerHTML={{__html:String(page.data.body || "")}}/><DetailActions page={page} site={content.site}/></div><figure className="guide-hero-photo"><Image src={photos[0]?.src || "/images/hero.jpg"} alt={photos[0]?.alt || "Гостевые дома «Танжерин» в Костроме"} fill priority sizes="(max-width:760px) 100vw, 52vw"/><figcaption><MapPin/> От «Танжерина» удобно начать знакомство с городом</figcaption></figure></div></section>
      <section className="detail-section guide-list botanical-section"><Foliage className="detail-intro-foliage" asset={guideDecor[1]}/><div className="container"><div className="detail-section-heading"><h2>{listTitle}</h2><span className="hand-note">{sourceLabel}</span></div><div className={`guide-cards${isOverview ? " guide-cards-overview" : ""}`}>{items.map((item, index) => { const external = /^https?:/.test(item.href); const label = external ? "Открыть официальный источник" : "Открыть раздел"; return <article className="guide-card" key={`${item.title}-${index}`}><span className="guide-card-number">0{index + 1}</span><div className="guide-card-icon"><HeroIcon/></div><h3>{item.title}</h3><strong>{item.meta}</strong><p>{item.description}</p>{external ? <a href={item.href} target="_blank" rel="noreferrer">{label}<ArrowUpRight/></a> : <Link href={item.href}>{label}<ArrowUpRight/></Link>}</article>; })}</div></div></section>
      <section className="guide-note botanical-section"><Foliage className="guide-note-foliage" asset={guideDecor[2]}/><div className="container"><MapPin/><div><h2>{noteTitle}</h2><p>{noteText}</p></div><a className="detail-button detail-button-secondary" href={content.site.route} target="_blank" rel="noreferrer">Построить маршрут<ArrowUpRight/></a></div></section>
      <section className="detail-closing guide-closing"><Image src={photos[1]?.src || "/images/veranda.jpg"} alt={photos[1]?.alt || "Веранда гостевого дома «Танжерин»"} fill sizes="100vw"/><div className="detail-closing-shade"/><div className="container detail-closing-copy"><div><h2>{closingTitle}</h2><p>{closingText}</p></div><div className="detail-actions"><Link className="detail-button" href="/#booking">Проверить даты<ArrowUpRight/></Link><Link className="detail-button detail-button-secondary" href="/kostroma">Все подсказки по Костроме<ArrowUpRight/></Link></div></div></section>
    </main>
    <DetailFooter content={content}/>
  </>;
}

export function ContentLanding({ page, content }: { page: ContentEntry; content: SiteContent }) {
  if (page.data.template === "house") {
    const house = content.houses.find(item => item.id === page.data.houseKey);
    if (house) return <HouseLanding page={page} content={content} house={house}/>;
  }
  if (page.data.template === "company") return <CompanyLanding page={page} content={content}/>;
  if (page.data.template === "guide") return <GuideLanding page={page} content={content}/>;
  return null;
}
