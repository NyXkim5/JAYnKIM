import { PERSONAS } from "@/features/persona/personas";

export type SiteRoute = {
  path: string;
  label: string;
  group: "primary" | "secondary";
};

const personaRoutes: SiteRoute[] = PERSONAS.map((p) => ({
  path: `/${p.key}`,
  label: p.short.charAt(0) + p.short.slice(1).toLowerCase(),
  group: "primary",
}));

export const SITE_ROUTES: SiteRoute[] = [
  { path: "/", label: "Home", group: "primary" },
  ...personaRoutes,
  { path: "/contact", label: "Contact", group: "primary" },
  { path: "/lab", label: "Projects", group: "secondary" },
  { path: "/matcha", label: "Recs", group: "secondary" },
  { path: "/music", label: "Music", group: "secondary" },
];

export const PRIMARY_ROUTES = SITE_ROUTES.filter((r) => r.group === "primary");
export const SECONDARY_ROUTES = SITE_ROUTES.filter((r) => r.group === "secondary");
export const NAV_ROUTES = PRIMARY_ROUTES.filter((r) => r.path !== "/" && r.path !== "/contact");
