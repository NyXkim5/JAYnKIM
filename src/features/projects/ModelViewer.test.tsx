// @vitest-environment jsdom
import { existsSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { caseStudies, findStudy } from "@/data/caseStudies";
import { ModelViewer } from "./ModelViewer";
import { CaseStudyPanel } from "./CaseStudyPanel";
import { ProjectWindow } from "./ProjectWindow";
import { findProject } from "./projects";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

afterEach(cleanup);

const SPEC = { src: "/models/artemis-rcws-v5.glb", caption: "a turret, drag to orbit" };

describe("ModelViewer", () => {
  it("shows the caption before the model has loaded, so the section is never blank", () => {
    render(<ModelViewer model={SPEC} />);
    expect(screen.getByText(SPEC.caption)).toBeTruthy();
  });

  // jsdom has no WebGL, so WebGLRenderer construction throws. That is the same
  // path a real browser without WebGL takes, and it must not strand the viewer
  // on "loading model" forever.
  it("falls back to a failed state when WebGL is unavailable rather than hanging", async () => {
    render(<ModelViewer model={SPEC} />);
    await waitFor(() => expect(screen.getByText("model unavailable")).toBeTruthy(), { timeout: 4000 });
    expect(screen.queryByText("loading model")).toBeNull();
  });

  it("offers no rotate control until a model is actually on screen", () => {
    render(<ModelViewer model={SPEC} />);
    expect(screen.queryByRole("button", { name: /pause|rotate/ })).toBeNull();
  });

  it("ships every model the studies point at", () => {
    const withModel = caseStudies.filter((s) => s.model);
    expect(withModel.length).toBeGreaterThan(0);
    for (const s of withModel) {
      const src = s.model!.src;
      expect(existsSync(join(process.cwd(), "public", src)), `${s.slug}: ${src}`).toBe(true);
    }
  });

  it("ships the Draco decoder the loader is pointed at", () => {
    for (const f of ["draco_decoder.js", "draco_decoder.wasm", "draco_wasm_wrapper.js"]) {
      expect(existsSync(join(process.cwd(), "public", "draco", f)), f).toBe(true);
    }
  });

  it("puts the model first in the case study, ahead of the approach", () => {
    const s = findStudy("artemis");
    if (!s) throw new Error("artemis study missing");
    render(<CaseStudyPanel study={s} />);
    const labels = [...document.querySelectorAll("section[aria-label]")].map((n) => n.getAttribute("aria-label"));
    expect(labels[0]).toBe("model");
    expect(labels.indexOf("model")).toBeLessThan(labels.indexOf("approach"));
  });

  it("leads the project overview with the model, above the figures", () => {
    const p = findProject("artemis-rcws");
    if (!p?.model) throw new Error("artemis-rcws has no model");
    expect(p.model.src).toBe("/models/artemis-rcws-v5.glb");
    render(<ProjectWindow project={p} onBack={() => {}} />);
    // The overview is the tab the window opens on, so this is the first view.
    const caption = screen.getByText(p.model.caption);
    const firstFigure = document.querySelector("figure");
    expect(firstFigure?.contains(caption)).toBe(true);
  });

  it("gives the artemis study a model whose caption credits the upstream author", () => {
    const s = findStudy("artemis");
    if (!s?.model) throw new Error("artemis has no model");
    expect(s.model.src).toMatch(/\.glb$/);
    expect(s.model.caption).toMatch(/WILDCARD/);
  });
});
