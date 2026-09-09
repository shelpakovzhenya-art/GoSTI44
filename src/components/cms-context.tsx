"use client";

import { createContext, useContext } from "react";
import type { SiteContent } from "@/lib/content-types";

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
  return <>{texts[id] ?? ""}</>;
}
