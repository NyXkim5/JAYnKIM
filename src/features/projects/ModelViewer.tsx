"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export type ModelSpec = { src: string; caption: string };

type Status = "idle" | "loading" | "ready" | "failed";

// The turntable only runs when the canvas is on screen and the tab is visible.
// Chrome zeroes requestAnimationFrame on a hidden tab, so a clock-based spin
// would jump on return; driving from the frame callback avoids that entirely.
export function ModelViewer({ model }: { model: ModelSpec }) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  // Respect the OS setting. A reduced-motion visitor gets a still model they
  // can still drag, never an animation they did not ask for.
  const reduced = useReducedMotion() ?? false;
  const [spin, setSpin] = useState(!reduced);
  const spinRef = useRef(!reduced);

  useEffect(() => {
    spinRef.current = spin;
  }, [spin]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    async function boot() {
      setStatus("loading");
      // Everything from here down can throw: WebGLRenderer construction fails
      // outright on a browser with no WebGL, and the model fetch can 404. Both
      // must land on the caption fallback rather than an endless "loading".
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader.js");
      if (disposed || !host) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(host.clientWidth, host.clientHeight);
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 1e5);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.autoRotateSpeed = 1.1;
      controls.autoRotate = spinRef.current;

      scene.add(new THREE.AmbientLight(0xffffff, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 2.1);
      key.position.set(1, 1.4, 1);
      const fill = new THREE.DirectionalLight(0xffffff, 0.7);
      fill.position.set(-1, 0.4, -0.8);
      const rim = new THREE.DirectionalLight(0xffffff, 0.5);
      rim.position.set(0, -1, 0.6);
      scene.add(key, fill, rim);

      const draco = new DRACOLoader().setDecoderPath("/draco/");
      const loader = new GLTFLoader().setDRACOLoader(draco);

      let root: import("three").Object3D | undefined;
      {
        const gltf = await loader.loadAsync(model.src);
        if (disposed) return;
        root = gltf.scene;
        scene.add(root);

        const box = new THREE.Box3().setFromObject(root);
        const size = box.getSize(new THREE.Vector3());
        const centre = box.getCenter(new THREE.Vector3());
        const radius = Math.max(size.x, size.y, size.z) * 0.5 || 1;
        const dist = (radius / Math.sin((45 * Math.PI) / 180 / 2)) * 1.2;
        camera.near = dist / 500;
        camera.far = dist * 500;
        camera.updateProjectionMatrix();
        camera.position.set(centre.x + dist * 0.62, centre.y + dist * 0.42, centre.z + dist * 0.62);
        controls.target.copy(centre);
        controls.minDistance = dist * 0.35;
        controls.maxDistance = dist * 2.5;
        controls.update();
        setStatus("ready");
      }

      let onScreen = true;
      let frame = 0;
      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!onScreen) return;
        controls.autoRotate = spinRef.current;
        controls.update();
        renderer.render(scene, camera);
      };
      frame = requestAnimationFrame(tick);

      const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0.01 });
      io.observe(host);

      const onResize = () => {
        if (!host.clientWidth) return;
        camera.aspect = host.clientWidth / host.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(host.clientWidth, host.clientHeight);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(host);

      cleanup = () => {
        cancelAnimationFrame(frame);
        io.disconnect();
        ro.disconnect();
        controls.dispose();
        draco.dispose();
        root?.traverse((o) => {
          const m = o as import("three").Mesh;
          if (!m.isMesh) return;
          m.geometry.dispose();
          const mat = m.material;
          (Array.isArray(mat) ? mat : [mat]).forEach((x) => x.dispose());
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    void boot().catch(() => {
      if (!disposed) setStatus("failed");
    });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [model.src]);

  return (
    <figure className="relative">
      <div className="relative aspect-video w-full overflow-hidden bg-black">
        <div ref={hostRef} className="absolute inset-0 [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full" />

        {status !== "ready" && (
          <p className="absolute inset-0 grid place-items-center font-mono text-[11px] tracking-[0.14em] text-white/40">
            {status === "failed" ? "model unavailable" : "loading model"}
          </p>
        )}

        {status === "ready" && (
          <button
            type="button"
            onClick={() => setSpin((s) => !s)}
            aria-pressed={spin}
            className="absolute bottom-3 right-3 border border-white/20 bg-black/60 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-white/70 transition-colors hover:border-white/50 hover:text-white"
          >
            {spin ? "pause" : "rotate"}
          </button>
        )}
      </div>
      <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-white/50">
        {model.caption}
      </figcaption>
    </figure>
  );
}
