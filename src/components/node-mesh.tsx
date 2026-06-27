"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; r: number };

/**
 * Interactive "neural mesh" — drifting nodes connected by lines that brighten
 * near the cursor. Pure Canvas 2D, zero dependencies. Node count scales with
 * area but is capped; the loop is DPR-aware, paused when offscreen or the tab
 * is hidden, and never runs under prefers-reduced-motion (a single calm static
 * frame is drawn instead). Purely decorative, so aria-hidden.
 */
export default function NodeMesh({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;

    const LINK_DIST = 132; // px (CSS units) within which two nodes link
    const POINTER_DIST = 175; // px radius of cursor influence

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      // Mobile (<768px): cap the constellation at 30 nodes for performance.
      const isMobile = width < 768;
      const target = Math.min(
        isMobile ? 30 : 64,
        Math.max(isMobile ? 12 : 20, Math.round((width * height) / 22000))
      );
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.4 + 0.8,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Elliptical edge fade, computed in-canvas (replaces a CSS mask, which
      // flickers over a per-frame canvas in Firefox). Opaque near (50%, 35%),
      // fading toward the edges/corners — matches the old radial mask.
      const cx = width * 0.5;
      const cy = height * 0.35;
      const hx = width * 0.65;
      const hy = height * 0.525;
      const fade = (x: number, y: number) => {
        const nd = Math.hypot((x - cx) / hx, (y - cy) / hy);
        const f = (0.88 - nd) / 0.36;
        return f < 0 ? 0 : f > 1 ? 1 : f;
      };

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x <= 0 || n.x >= width) n.vx *= -1;
        if (n.y <= 0 || n.y >= height) n.vy *= -1;
        if (pointer.active) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < POINTER_DIST && d > 0.001) {
            const f = (1 - d / POINTER_DIST) * 0.35;
            n.x += (dx / d) * f;
            n.y += (dy / d) * f;
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d >= LINK_DIST) continue;
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          let alpha = (1 - d / LINK_DIST) * 0.22;
          if (pointer.active) {
            const pd = Math.hypot(pointer.x - mx, pointer.y - my);
            if (pd < POINTER_DIST) alpha += (1 - pd / POINTER_DIST) * 0.5;
          }
          alpha *= fade(mx, my);
          if (alpha <= 0.003) continue;
          ctx.strokeStyle = `rgba(245, 158, 11, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const n of nodes) {
        let glow = 0.55;
        if (pointer.active) {
          const pd = Math.hypot(pointer.x - n.x, pointer.y - n.y);
          if (pd < POINTER_DIST) glow = 0.55 + (1 - pd / POINTER_DIST) * 0.45;
        }
        glow *= fade(n.x, n.y);
        ctx.fillStyle = `rgba(249, 115, 22, ${glow.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw();
    };

    let raf = 0;
    let running = false;
    const loop = () => {
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();

    const onVisibility = () => (document.hidden ? stop() : start());
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !document.hidden) start();
          else stop();
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onResize = () => resize();

    if (!reduce && finePointer) {
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduce) start();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
