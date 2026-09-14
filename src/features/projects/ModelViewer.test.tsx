// @vitest-environment jsdom
import { existsSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { caseStudies, findStudy } from "@/data/caseStudies";
import { ModelViewer } from "./ModelViewer";

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

  it("gives the artemis study a model whose caption credits the upstream author", () => {
    const s = findStudy("artemis");
    if (!s?.model) throw new Error("artemis has no model");
    expect(s.model.src).toMatch(/\.glb$/);
    expect(s.model.caption).toMatch(/WILDCARD/);
  });
});
