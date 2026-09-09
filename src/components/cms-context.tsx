"use client";

import { createContext, createElement, useContext, type MouseEvent, type KeyboardEvent } from "react";
import type { SiteContent } from "@/lib/content-types";
import { useVisualEditing } from "./visual-editing-context";

const ContentContext = createContext<SiteContent | null>(null);

export function ContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function useSite() {
  const content = useContext(ContentContext);
  if (!content) throw new Error("ContentProvider is required");
  return content;
}

export function CmsText({ id }: { id: string }) {
  const { texts } = useSite();
  return <EditableText id={id} value={texts[id] ?? ""}/>;
}

/** Markers exist only inside the signed editor; public markup stays unchanged. */
export function EditableText({ id, value, uppercase = false }: { id: string; value: string; uppercase?: boolean }) {
  const editing = useVisualEditing();
  const raw = editing?.values[id] ?? value;
  const display = uppercase ? raw.toUpperCase() : raw;
  if (!editing?.keys.has(id)) return <>{display}</>;
  // A custom inline element avoids the site's span typography/layout selectors.
  return createElement("cms-text", {
    "data-cms-key": id, "data-cms-selected": editing.selected === id,
    tabIndex: 0, role: "button", "aria-label": `Редактировать: ${raw || "пустой текст"}`,
    onClick: (event: MouseEvent) => { event.preventDefault(); event.stopPropagation(); editing.select(id); },
    onKeyDown: (event: KeyboardEvent) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); event.stopPropagation(); editing.select(id); } },
  }, display);
}
