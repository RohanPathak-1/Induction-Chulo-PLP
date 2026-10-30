import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const FlameOff = (p: IconProps) => <svg {...base} {...p}><path d="m3 3 18 18"/><path d="M13.5 9.3c.9-2.3.1-5-1.5-7.3-1 3.8-3.6 5.2-5.2 7.7C4.2 13.8 6.3 19 10.3 21"/><path d="M14.6 14.6c.3 1.7-.4 3.4-2 4.4"/></svg>;
export const Sparkles = (p: IconProps) => <svg {...base} {...p}><path d="m12 3-1.2 3.4a2 2 0 0 1-1.2 1.2L6 9l3.6 1.4a2 2 0 0 1 1.2 1.2L12 15l1.3-3.4a2 2 0 0 1 1.1-1.2L18 9l-3.6-1.4a2 2 0 0 1-1.1-1.2L12 3Z"/><path d="m19 16-.5 1.4a1 1 0 0 1-.6.6l-1.4.5 1.4.5a1 1 0 0 1 .6.6L19 21l.5-1.4a1 1 0 0 1 .6-.6l1.4-.5-1.4-.5a1 1 0 0 1-.6-.6L19 16Z"/></svg>;
export const Utensils = (p: IconProps) => <svg {...base} {...p}><path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M15 3v18M15 3c3 1 5 4 5 8h-5"/></svg>;
export const Ruler = (p: IconProps) => <svg {...base} {...p}><path d="m4 17 13-13 3 3L7 20l-3-3Z"/><path d="m14 7 3 3M11 10l2 2M8 13l3 3"/></svg>;
export const Clean = (p: IconProps) => <svg {...base} {...p}><path d="M12 3v3M4.2 6.2l2.1 2.1M3 14h3M17.7 8.3l2.1-2.1M18 14h3"/><path d="M8 14a4 4 0 1 1 8 0c0 2-1 3-2 4H10c-1-1-2-2-2-4Z"/><path d="M9 21h6"/></svg>;
export const Plug = (p: IconProps) => <svg {...base} {...p}><path d="M9 7V3M15 7V3M7 7h10v3a5 5 0 0 1-5 5v0a5 5 0 0 1-5-5V7ZM12 15v6"/></svg>;
export const Pan = (p: IconProps) => <svg {...base} {...p}><path d="M4 13h12a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Z"/><path d="m16 14 5-2M7 10c0-2 1-3 1-5M11 10c0-2 1-3 1-5"/></svg>;
export const Check = (p: IconProps) => <svg {...base} {...p}><path d="m5 12 4 4L19 6"/></svg>;
export const Truck = (p: IconProps) => <svg {...base} {...p}><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>;
export const Headphones = (p: IconProps) => <svg {...base} {...p}><path d="M4 14a8 8 0 0 1 16 0"/><path d="M4 14v4a2 2 0 0 0 2 2h2v-8H6a2 2 0 0 0-2 2ZM20 14v4a2 2 0 0 1-2 2h-2v-8h2a2 2 0 0 1 2 2Z"/></svg>;
export const Shield = (p: IconProps) => <svg {...base} {...p}><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>;
export const ArrowRight = (p: IconProps) => <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
export const Phone = (p: IconProps) => <svg {...base} {...p}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.8 2.1Z"/></svg>;
export const Mail = (p: IconProps) => <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
export const Star = (p: IconProps) => <svg {...base} {...p}><path d="m12 2.7 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5-4.7-4.6 6.5-.9L12 2.7Z"/></svg>;
export const ShoppingCart = (p: IconProps) => <svg {...base} {...p}><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M3 4h2l2.4 10.4A2 2 0 0 0 9.3 16H18a2 2 0 0 0 1.9-1.5L21 8H6"/></svg>;
export const Zap = (p: IconProps) => <svg {...base} {...p}><path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z"/></svg>;
export const Menu = (p: IconProps) => <svg {...base} {...p}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
export const X = (p: IconProps) => <svg {...base} {...p}><path d="m6 6 12 12M18 6 6 18"/></svg>;
export const ChevronLeft = (p: IconProps) => <svg {...base} {...p}><path d="m15 18-6-6 6-6"/></svg>;
export const ChevronRight = (p: IconProps) => <svg {...base} {...p}><path d="m9 18 6-6-6-6"/></svg>;
export const Cup = (p: IconProps) => <svg {...base} {...p}><path d="M4 7h12v6a6 6 0 0 1-12 0V7ZM16 9h2a3 3 0 0 1 0 6h-2M6 3v2M10 3v2M14 3v2"/></svg>;
export const Droplet = (p: IconProps) => <svg {...base} {...p}><path d="M12 2s6 6.4 6 12a6 6 0 0 1-12 0c0-5.6 6-12 6-12Z"/></svg>;
