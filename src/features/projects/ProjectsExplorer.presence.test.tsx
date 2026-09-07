// @vitest-environment jsdom
// Real framer presence, no stubs: proves the window and backdrop actually
// unmount after the exit animation and that the next project can open.
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ProjectsExplorer } from "./ProjectsExplorer";

vi.mock("@/features/persona/PersonaBar", () => ({ PersonaBar: () => null }));
vi.mock("@/components/transitions/TransitionLink", () => ({
  TransitionLink: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));
vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

afterEach(cleanup);

// Folders start closed, so every folder is opened before a leaf is clicked.
function renderInstant() {
  const result = render(
    <MotionConfig transition={{ duration: 0 }}>
      <ProjectsExplorer />
    </MotionConfig>,
  );
  for (const folder of screen.getAllByRole("button", { expanded: false })) fireEvent.click(folder);
  return result;
}

describe("ProjectsExplorer presence", () => {
  it("unmounts the window after back and keeps the tree", async () => {
    renderInstant();
    fireEvent.click(screen.getByText("Bamboo nutrition app"));
    expect(screen.getByRole("dialog")).toBeTruthy();
    fireEvent.click(screen.getByText(/back/i));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull(), { timeout: 3000 });
    expect(screen.getByText("Bamboo nutrition app")).toBeTruthy();
  });

  it("opens a second project after the first one closed", async () => {
    renderInstant();
    fireEvent.click(screen.getByText("Bamboo nutrition app"));
    fireEvent.keyDown(window, { key: "Escape" });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull(), { timeout: 3000 });
    fireEvent.click(screen.getByText("Summer 2027 role index"));
    expect(screen.getByRole("dialog").textContent).toContain("Summer 2027 role index");
  });
});
