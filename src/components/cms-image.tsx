"use client";

import Image, { type ImageProps } from "next/image";
import { useSite } from "./cms-context";

export default function CmsImage(props: ImageProps) {
  const { images } = useSite();
  const override = typeof props.src === "string" ? images[props.src] : undefined;
  return <Image {...props} src={override?.src || props.src} alt={props.alt === "" ? "" : override?.alt || props.alt}/>;
}
