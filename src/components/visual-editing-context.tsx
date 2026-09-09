"use client";

import { createContext, useContext } from "react";

export type VisualEditing = { keys: Set<string>; values: Record<string, string>; selected: string | null; select: (key: string) => void };
export const EditingContext = createContext<VisualEditing | null>(null);
export const useVisualEditing = () => useContext(EditingContext);
