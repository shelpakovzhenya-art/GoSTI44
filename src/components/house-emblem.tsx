import { useId } from "react";
import type { House } from "@/data/site";

/** Original botanical marks; decorative because the house name is always adjacent. */
export function HouseEmblem({ tone }: { tone: House["tone"] }) {
  const id = useId();
  const lime = tone === "lime";
  const lemon = tone === "lemon";
  const skin = `${id}-skin`;
  const leaf = `${id}-leaf`;
  const flesh = `${id}-flesh`;

  return <svg className={`house-emblem emblem-${tone}`} viewBox="0 0 80 80" width="48" height="48" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id={skin} cx=".3" cy=".25" r=".8">
        <stop stopColor={lime ? "#bee56d" : lemon ? "#fff091" : "#ffd077"}/>
        <stop offset=".46" stopColor={lime ? "#78ac36" : lemon ? "#f5ce36" : "#f89b30"}/>
        <stop offset="1" stopColor={lime ? "#365b22" : lemon ? "#c38813" : "#ba4b12"}/>
      </radialGradient>
      <linearGradient id={leaf} x1="20" y1="7" x2="49" y2="31" gradientUnits="userSpaceOnUse">
        <stop stopColor="#7d9f46"/><stop offset="1" stopColor="#244a2b"/>
      </linearGradient>
      <radialGradient id={flesh} cx=".4" cy=".3" r=".75">
        <stop stopColor={lime ? "#e5ed9b" : "#ffe59c"}/><stop offset="1" stopColor={lime ? "#91bb4d" : "#f5ad38"}/>
      </radialGradient>
    </defs>
    <ellipse cx="41" cy="70" rx="27" ry="3" fill="#393820" opacity=".12"/>
    <path d="M42 30C43 22 43 18 47 12" stroke="#77613a" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M42 25C27 27 17 18 17 8C32 7 45 11 42 25Z" fill={`url(#${leaf})`}/>
    <path d="M21 12C28 16 35 19 42 25M29 17L29 12M34 20L25 21" stroke="#c8d48b" strokeWidth=".8" opacity=".65"/>
    <path d="M45 22C49 10 59 8 68 11C64 21 55 27 45 22Z" fill={`url(#${leaf})`}/>
    <path d="M48 21L62 14" stroke="#c8d48b" strokeWidth=".8" opacity=".6"/>
    {lemon ? <g transform="rotate(-27 40 45)">
      <path d="M13 43C16 42 16 35 22 30C33 21 49 21 59 31C63 35 63 39 68 42C71 45 68 48 65 49C62 59 52 66 40 66C27 66 18 59 16 51C10 50 9 46 13 43Z" fill={`url(#${skin})`} stroke="#b18a27" strokeWidth=".7"/>
      <path d="M23 39C29 29 43 27 52 32" stroke="#fff8c6" strokeWidth="3" strokeLinecap="round" opacity=".7"/>
      <path d="M26 56L27 57M34 59L35 59M48 57L49 56M56 46L57 45M20 46L20 47" stroke="#9f7415" strokeWidth="1.3" strokeLinecap="round" opacity=".35"/>
    </g> : <>
      <path d="M19 29C26 22 35 22 42 26C50 23 61 29 65 40C71 55 61 68 46 69C30 72 16 64 15 50C14 42 14 35 19 29Z" fill={`url(#${skin})`} stroke={lime ? "#53772c" : "#c16a20"} strokeWidth=".7"/>
      <path d="M23 34C27 29 31 29 34 30" stroke={lime ? "#e4f3b4" : "#ffe5ae"} strokeWidth="3" strokeLinecap="round" opacity=".7"/>
      <path d="M24 45L24 46M28 54L29 55M20 52L21 53M35 34L35 35" stroke={lime ? "#355126" : "#a44f20"} strokeWidth="1.3" strokeLinecap="round" opacity=".3"/>
      <g transform={lime ? "translate(54 53) rotate(12)" : "translate(56 56) rotate(-16)"}>
        <circle r={lime ? 21 : 18} fill={lime ? "#5e8c2e" : "#e48424"}/>
        <circle r={lime ? 18.5 : 16} fill="#faf5cf"/>
        <g transform={lime ? "scale(1)" : "scale(.85)"}>
          {Array.from({ length: 8 }, (_, index) => <path key={index} d="M1.7-3.4L2.2-15.7C7.1-15.3 11.2-12.8 13.4-9L4.1-1.8C3.3-1.3 1.7-2.2 1.7-3.4Z" transform={`rotate(${index * 45})`} fill={`url(#${flesh})`}/>)}
          <circle r="2" fill="#fffbe9"/>
          <path d="M5-8L7-11M-8-5L-11-7M-4 8L-5 11" stroke="#fffbe9" strokeWidth="1.1" strokeLinecap="round" opacity=".8"/>
        </g>
      </g>
    </>}
  </svg>;
}
