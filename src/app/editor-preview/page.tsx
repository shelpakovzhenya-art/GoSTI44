import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { assembleContent, parseContentPayload } from "@/lib/content";
import VisualPreview from "@/components/visual-preview";

export const metadata: Metadata = { title: "Редактор главной — Танжерин", robots: { index: false, follow: false }, referrer: "no-referrer" };

export default async function EditorPreview({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  if (!process.env.CMS_URL || typeof query.expires !== "string" || !/^\d+$/.test(query.expires)
    || typeof query.signature !== "string" || !/^[a-f0-9]{64}$/.test(query.signature)
    || typeof query.origin !== "string" || !/^https?:\/\/[^/]+$/.test(query.origin)) notFound();
  const params = new URLSearchParams({ expires: query.expires, origin: query.origin, signature: query.signature });
  const response = await fetch(`${process.env.CMS_URL.replace(/\/$/, "")}/api/preview/editor?${params}`, {
    cache: "no-store", headers: { Accept: "application/json" }, signal: AbortSignal.timeout(30000),
  });
  if (response.status === 403 || response.status === 404) return <main className="container content-page"><h1>Предпросмотр недоступен</h1><p>Ссылка действует 15 минут. Нажмите «Обновить просмотр» в редакторе.</p></main>;
  if (!response.ok) throw new Error("Visual preview unavailable");
  const payload = await response.json();
  const content = assembleContent(parseContentPayload(payload));
  if (!Array.isArray(payload.editableKeys) || !payload.editableKeys.every((key: unknown) => typeof key === "string") || payload.editorOrigin !== query.origin) notFound();
  if (!payload.editableValues || typeof payload.editableValues !== "object" || !Object.values(payload.editableValues).every(value => typeof value === "string")) notFound();
  return <VisualPreview content={content} editorOrigin={payload.editorOrigin} editableKeys={payload.editableKeys} editableValues={payload.editableValues}/>;
}
