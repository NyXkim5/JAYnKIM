import type { Project } from "./projects";

// School contributions: the UCI organisations Jay served and what he did
// there. Roles come from his own education card, verbatim. Descriptions
// come from each organisation's own site or profile. Nothing is inferred
// and no numbers appear, so specs stay empty.
export const SCHOOL: readonly Project[] = [
  {
    slug: "hack-at-uci",
    title: "Hack at UCI",
    folder: "school",
    status: "COMMUNITY",
    claim: "Logistics for UCI's collegiate hackathon organisation, and a hand on the Hack at UCI website.",
    caveat: "Student and alumni organisation at UC Irvine that runs the campus hackathons. Description from its GitHub profile and event site.",
    specs: [],
    images: [{ src: "/projects/school/hack-at-uci.jpg", alt: "Hack at UCI website" }],
    url: "https://hack.ics.uci.edu",
  },
  {
    slug: "cyber-at-uci",
    title: "Cyber @ UCI",
    folder: "school",
    status: "COMMUNITY",
    claim: "Graphics for UCI's student cybersecurity club, the visuals that go out with its events and channels.",
    caveat: "Student club at UC Irvine that fields cybersecurity competition teams and hosts workshops. Description from its site.",
    specs: [],
    images: [{ src: "/projects/school/cyber-at-uci.jpg", alt: "Cyber @ UCI website" }],
    url: "https://cyberuci.com",
  },
  {
    slug: "uav-at-uci",
    title: "Unmanned Aerial Vehicles at UCI",
    folder: "school",
    status: "COMMUNITY",
    claim: "Served as president of UCI's student club for designing, building, and flying model aircraft and drones.",
    caveat: "Student club at UC Irvine, formerly UAVs at UCI. Description from its ZotSpot page.",
    specs: [],
    images: [{ src: "/projects/school/uav-at-uci.jpg", alt: "Unmanned Aerial Vehicles at UCI club logo, from its ZotSpot page" }],
    url: "https://zotspot.uci.edu/uavs/home",
  },
  {
    slug: "vfs-at-uci",
    title: "Vertical Flight Society at UCI",
    folder: "school",
    status: "COMMUNITY",
    claim: "Graphics for UCI's student chapter of the Vertical Flight Society, the visuals for its talks, tours, and workshops.",
    caveat: "Student chapter of the Vertical Flight Society at UC Irvine. Description from its ZotSpot page.",
    specs: [],
    images: [{ src: "/projects/school/vfs-at-uci.jpg", alt: "Vertical Flight Society at UCI website" }],
    url: "https://zotspot.uci.edu/VFS/",
  },
  {
    slug: "ai-at-uci",
    title: "AI at UCI",
    folder: "school",
    status: "COMMUNITY",
    claim: "Graphics for UCI's student-run AI organisation, the visuals for its workshops and posts.",
    caveat: "Student-run organisation at UC Irvine for all things AI. Description from its GitHub profile.",
    specs: [],
    images: [{ src: "/projects/school/ai-at-uci.jpg", alt: "AI at UCI website" }],
    url: "https://aiclub.ics.uci.edu",
  },
];
