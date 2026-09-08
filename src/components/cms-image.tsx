"use client";

import Image, { type ImageProps } from "next/image";
import { useSite } from "./cms-context";

export default function CmsImage(props: ImageProps) {
  const { images } = useSite();
  const override = typeof props.src === "string" ? images[props.src] : undefined;
  const source = typeof props.src === "string" ? props.src : "";
  const tone = /\/images\/(hero|veranda)\.jpg$/.test(source) ? "outdoor"
    : /\/images\/spa-sauna\.jpg$/.test(source) ? "sauna"
    : /\/images\/(family|business|lux|spa-tea)(-bedroom|-living)?\.jpg$/.test(source) ? "interior"
    : undefined;
  return <Image {...props} data-photo-tone={tone} src={override?.src || props.src} alt={props.alt === "" ? "" : override?.alt || props.alt}/>;
}
