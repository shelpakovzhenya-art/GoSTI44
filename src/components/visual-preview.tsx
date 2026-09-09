"use client";

import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "@/lib/content-types";
import { ContentProvider } from "./cms-context";
import Landing from "./landing";
import { EditingContext } from "./visual-editing-context";

export default function VisualPreview({ content, editorOrigin, editableKeys, editableValues }: {
  content: SiteContent; editorOrigin: string; editableKeys: string[]; editableValues: Record<string, string>;
}) {
  const [texts, setTexts] = useState(editableValues);
  const [selected, setSelected] = useState<string | null>(null);
  const lastSelected = useRef<string | null>(null);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== editorOrigin || event.source !== window.parent) return;
      const data = event.data;
      if (data?.type !== "cms:change" || typeof data.key !== "string" || typeof data.value !== "string" || !editableKeys.includes(data.key)) return;
      setTexts(previous => ({ ...previous, [data.key]: data.value }));
      setSelected(data.key);
      if (lastSelected.current !== data.key) {
        const target = Array.from(document.querySelectorAll<HTMLElement>("[data-cms-key]")).find(node => node.dataset.cmsKey === data.key);
        for (let ancestor = target?.parentElement; ancestor; ancestor = ancestor.parentElement) {
          if (ancestor instanceof HTMLDetailsElement) ancestor.open = true;
        }
        target?.scrollIntoView({ block: "center", behavior: "instant" });
        lastSelected.current = data.key;
      }
    };
    // Keep site links inside the editor; anchors and disclosure controls remain usable.
    const preventNavigation = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest("a") : null;
      if (link && !link.getAttribute("href")?.startsWith("#")) event.preventDefault();
    };
    window.addEventListener("message", receive);
    document.addEventListener("click", preventNavigation, true);
    window.parent.postMessage({ type: "cms:ready" }, editorOrigin);
    return () => { window.removeEventListener("message", receive); document.removeEventListener("click", preventNavigation, true); };
  }, [editorOrigin, editableKeys]);
  const select = (key: string) => window.parent.postMessage({ type: "cms:select", key }, editorOrigin);
  return <EditingContext.Provider value={{ keys: new Set(editableKeys), values: texts, selected, select }}>
    <style>{`[data-cms-key]{outline:1px dashed #e59b2a;outline-offset:3px;cursor:text;white-space:pre-wrap}[data-cms-key]:hover,[data-cms-selected=true]{outline:2px solid #ff9e2b;background:#ff9e2b26}[data-cms-key]:empty::after{content:'[пустой текст]'}html{scroll-behavior:auto}`}</style>
    <ContentProvider content={content}><Landing/></ContentProvider>
  </EditingContext.Provider>;
}
