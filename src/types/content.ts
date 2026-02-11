export interface Project {
  title: string;
  slug: string;
  description: string;
  status: "active" | "deployed" | "archived" | "in-progress";
  date: string;
  thumbnail: string;
  tags: string[];
  featured: boolean;
  links: {
    github?: string;
    live?: string;
    paper?: string;
  };
  order: number;
  content: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  endDate?: string;
  title: string;
  organization: string;
  description: string;
  type: "work" | "education" | "project" | "award";
  status: "active" | "completed";
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  value: number;
  icon: string;
  description: string;
}
