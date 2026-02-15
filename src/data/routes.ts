export type SiteRoute = {
  path: string;
  label: string;
  group: "primary" | "secondary";
};

export const SITE_ROUTES: SiteRoute[] = [
  { path: "/", label: "About", group: "primary" },
  { path: "/projects", label: "Work", group: "primary" },
  { path: "/lab", label: "Projects", group: "primary" },
  { path: "/writing", label: "Writing", group: "secondary" },
  { path: "/matcha", label: "Recs", group: "secondary" },
  { path: "/music", label: "Music", group: "secondary" },
  { path: "/contact", label: "Contact", group: "primary" },
];

export const PRIMARY_ROUTES = SITE_ROUTES.filter((r) => r.group === "primary");
export const SECONDARY_ROUTES = SITE_ROUTES.filter((r) => r.group === "secondary");
