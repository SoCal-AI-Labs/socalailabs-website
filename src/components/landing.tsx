"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import NodeMesh from "./node-mesh";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const cssVars = (vars: Record<string, string | number>) =>
  vars as React.CSSProperties;

const SERVICES = [
  {
    title: "AI Agent Systems",
    desc: "Autonomous multi-agent pipelines that handle tasks, make decisions, and operate without constant supervision.",
  },
  {
    title: "Lead Automation",
    desc: "Outreach systems that identify prospects, personalize messaging, and fill your pipeline while you sleep.",
  },
  {
    title: "Operations Automation",
    desc: "Connect your tools, eliminate manual workflows, and let AI handle the repetitive work.",
  },
  {
    title: "Custom AI Integrations",
    desc: "Wire LLMs like Claude and GPT directly into your business systems, dashboards, and existing stack.",
  },
  {
    title: "AI Visual Identity",
    desc: "From logos to brand systems — we generate AI-powered visual assets that position your business as a premium, modern operation from day one.",
  },
  {
    title: "Motion Websites",
    desc: "Cinematic, scroll-driven websites with live particle systems, parallax depth, and interactive animations — built in days, not months. The kind of site agencies quote $15,000–$35,000 for.",
  },
];

// Headline split into words; the final three carry the amber->orange ignite.
const HEADLINE = [
  { t: "We" },
  { t: "Build" },
  { t: "AI" },
  { t: "Systems" },
  { t: "That" },
  { t: "Work", ignite: true },
  { t: "For", ignite: true },
  { t: "You", ignite: true },
];

// High-tech capability marquee (duplicated in render for a seamless loop).
const STACK = [
  "Multi-Agent Systems",
  "RAG Pipelines",
  "Workflow Automation",
  "LLM Integrations",
  "Lead Generation",
  "Autonomous Agents",
  "Claude & GPT",
  "Operations AI",
];

export default function Landing() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const pinRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // NOTE: the "motion" class on <html> is added pre-paint by a tiny inline
  // script in layout.tsx (guarded by prefers-reduced-motion) so above-the-fold
  // elements start hidden instead of flashing visible -> hidden -> fading in.
  // Without that class (no-JS / reduced-motion) the page renders fully visible.

  // Reveal-on-scroll: one observer toggles .in-view on reveal/stagger/flow nodes.
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal, .stagger, .flow");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  // Frosted nav background on scroll. Runs regardless of motion preference —
  // it's a legibility/separation feature, not decoration, so reduced-motion
  // users get it too.
  useEffect(() => {
    const onScroll = () => setScrolled(document.documentElement.scrollTop > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Single rAF "motion engine": writes --sp (page scroll progress) and the
  // About pin progress (--p). Composited props only; gated by reduced-motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = document.documentElement;
    let raf = 0;
    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = root.scrollHeight - root.clientHeight;
        const sp = max > 0 ? root.scrollTop / max : 0;
        root.style.setProperty("--sp", sp.toFixed(4));
        // Parallax depth: hero background trails to ~0.3x scroll speed.
        root.style.setProperty(
          "--hero-py",
          (root.scrollTop * 0.7).toFixed(1) + "px"
        );

        const wrap = pinRef.current;
        if (wrap) {
          const r = wrap.getBoundingClientRect();
          const total = r.height - window.innerHeight;
          const p = Math.min(1, Math.max(0, -r.top / (total || 1)));
          const inner = wrap.querySelector<HTMLElement>(".pin__inner");
          inner?.style.setProperty("--p", p.toFixed(4));
        }
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Magnetic pull (buttons) + cursor spotlight (cards). JS only writes vars.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>(".magnetic").forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.setProperty("--tx", (x * 0.25).toFixed(1) + "px");
        el.style.setProperty("--ty", (y * 0.25).toFixed(1) + "px");
      };
      const reset = () => {
        el.style.setProperty("--tx", "0px");
        el.style.setProperty("--ty", "0px");
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
      });
    });

    document.querySelectorAll<HTMLElement>(".spot-card").forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", e.clientX - r.left + "px");
        el.style.setProperty("--my", e.clientY - r.top + "px");
      };
      el.addEventListener("pointermove", move);
      cleanups.push(() => el.removeEventListener("pointermove", move));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const closeModal = useCallback(() => {
    setShowForm(false);
    setSubmitted(false);
    setStatus("idle");
    // Keep uncontrolled inputs and form state in sync on every reopen so a
    // previously-filled optional field (e.g. company) is never silently re-sent.
    setFormData({ name: "", email: "", company: "", message: "" });
  }, []);

  // Modal: lock scroll, trap focus, close on Escape, restore focus on close.
  useEffect(() => {
    if (!showForm) return;
    const prevOverflow = document.body.style.overflow;
    const lastActive = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = closeBtnRef.current?.closest<HTMLElement>('[role="dialog"]');
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      lastActive?.focus?.();
    };
  }, [showForm, closeModal]);

  // When success replaces the form, the submit button unmounts and focus would
  // fall to <body>; move it back to the close button — this also restores the
  // focus trap, since the close button becomes the dialog's sole focusable.
  useEffect(() => {
    if (showForm && submitted) closeBtnRef.current?.focus();
  }, [showForm, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("https://formspree.io/f/xykqgeeg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitted(true);
        setStatus("idle");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="relative">
      {/* Fixed cinematic overlays (decorative) */}
      <div className="progress" aria-hidden />
      <div className="sun" aria-hidden />
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />

      {/* NAV */}
      <nav
        className={`nav fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 md:px-10 ${
          scrolled ? "scrolled py-3" : "py-5"
        }`}
      >
        <a href="#top" className="flex items-center gap-3">
          {/* Decorative: the adjacent wordmark already names this link. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/SoCal_AI_Labs_logo_no_text-removebg.png"
            alt=""
            className="h-9 w-auto mix-blend-screen"
          />
          <span className="text-lg font-bold tracking-tight">SoCal AI Labs</span>
          <span
            className="hidden sm:flex items-center gap-1.5 font-mono text-[0.62rem] tracking-widest text-[color:var(--color-ink-faint)]"
            aria-hidden
          >
            <span className="status-dot inline-block h-1.5 w-1.5 rounded-full bg-orange-500" />
            ONLINE
          </span>
        </a>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-6 font-mono text-[0.78rem] tracking-wide text-[color:var(--color-ink-soft)] md:flex">
            <a href="#services" className="transition-colors hover:text-white">
              Services
            </a>
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-ghost magnetic">
            Get in Touch
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="top"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-clip px-6 text-center"
      >
        <div className="aurora" aria-hidden />
        <NodeMesh className="node-mesh" />
        <div className="particles" aria-hidden>
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              style={cssVars({
                "--x": `${(i * 7.3 + 6) % 100}%`,
                "--s": `${4 + (i % 4)}px`,
                "--dur": `${13 + (i % 6) * 1.6}s`,
                "--delay": `${-(i * 1.4)}s`,
                "--drift": `${(i % 2 ? 1 : -1) * (16 + (i % 5) * 8)}px`,
              })}
            />
          ))}
        </div>

        <p className="kicker relative z-10 mb-6">
          Southern California · AI Systems
        </p>
        <h1 className="relative z-10 max-w-5xl text-balance text-5xl font-bold leading-[1.04] tracking-tight md:text-7xl">
          {HEADLINE.map((w, i) => (
            <span key={i}>
              <span className="hero-word" style={cssVars({ "--i": i })}>
                <span className={w.ignite ? "ignite" : undefined}>{w.t}</span>
              </span>
              {i < HEADLINE.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <p
          className="reveal relative z-10 mt-7 max-w-xl text-lg text-[color:var(--color-ink-soft)]"
          style={{ transitionDelay: "0.9s" }}
        >
          SoCal AI Labs designs and deploys autonomous AI systems for small and
          mid-size businesses — from lead generation to full operations
          automation.
        </p>
        <div
          className="reveal relative z-10 mt-10"
          style={{ transitionDelay: "1.05s" }}
        >
          <button onClick={() => setShowForm(true)} className="btn magnetic">
            Start a Project
          </button>
        </div>

        <div
          className="scroll-cue absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.62rem] tracking-[0.3em] text-[color:var(--color-ink-faint)]"
          aria-hidden
        >
          SCROLL
          <span className="h-8 w-px bg-gradient-to-b from-orange-500/70 to-transparent" />
        </div>

        <div
          className="hud-readout absolute bottom-9 right-6 z-10 hidden md:block"
          aria-hidden
        >
          34.0522° N · 118.2437° W
        </div>
      </section>

      {/* CAPABILITY TICKER */}
      <div className="ticker relative z-10" aria-hidden>
        <div className="ticker__track">
          {[...STACK, ...STACK].map((item, i) => (
            <span key={i} className="ticker__item">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" className="relative overflow-clip px-6 py-28">
        <div className="tech-grid" aria-hidden />
        <div className="relative z-10 mx-auto max-w-6xl">
          <p className="kicker reveal mb-3">01 — What We Build</p>
          <h2 className="reveal mb-4 text-3xl font-bold md:text-4xl">
            Systems that run the work for you
          </h2>
          <p className="reveal mb-14 max-w-2xl text-[color:var(--color-ink-soft)]">
            Four ways we route intelligence into your business — each one
            autonomous, production-ready, and built to operate without your
            constant attention.
          </p>

          <div className="stagger grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="spot-card glass p-6"
                style={cssVars({ "--i": i })}
              >
                <div className="mb-3 font-mono text-[0.7rem] tracking-widest text-[color:var(--color-ink-faint)]">
                  {`[ 0${i + 1} ]`}
                </div>
                <h3 className="mb-3 text-lg font-semibold">
                  <span className="ignite">{s.title}</span>
                </h3>
                <p className="text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT — pinned "hold and morph" beat */}
      <section id="about" ref={pinRef} className="pin-wrap">
        <div className="pin px-6">
          <div className="pin__inner mx-auto max-w-3xl text-center">
            <p className="kicker mb-4">02 — About</p>
            <p className="text-2xl font-medium leading-snug text-[color:var(--color-ink)] md:text-4xl md:leading-[1.25]">
              SoCal AI Labs is a Southern California based AI systems company
              founded by Matt. We build autonomous, production-ready AI systems
              that{" "}
              <span className="ignite">generate leads</span>,{" "}
              <span className="ignite">automate operations</span>, and{" "}
              <span className="ignite">create new revenue</span> — without
              requiring your constant attention.
            </p>
            <p className="mt-8 font-mono text-xs tracking-widest text-[color:var(--color-ink-faint)]">
              FOUNDER: MATT · BASE: SOUTHERN CALIFORNIA · STATUS: BUILDING
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="relative flex flex-col items-center overflow-clip px-6 py-32 text-center"
      >
        <div className="aurora" aria-hidden />
        <NodeMesh className="node-mesh" />
        <p className="kicker reveal relative z-10 mb-3">03 — Contact</p>
        <h2 className="reveal relative z-10 text-4xl font-bold md:text-6xl">
          Ready to <span className="ignite">Build</span>?
        </h2>
        <p className="reveal relative z-10 mt-5 max-w-md text-lg text-[color:var(--color-ink-soft)]">
          Tell us what you need. We will scope it, build it, and hand it off.
        </p>
        <div className="reveal relative z-10 mt-10">
          <button onClick={() => setShowForm(true)} className="btn magnetic">
            Start a Project
          </button>
        </div>
        <p className="reveal relative z-10 mt-5 font-mono text-xs tracking-widest text-[color:var(--color-ink-faint)]">
          AVG. RESPONSE · WITHIN 24 HOURS
        </p>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[color:var(--color-hairline)] px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="font-mono text-xs tracking-widest text-[color:var(--color-ink-faint)]">
            SoCal AI Labs · Southern California
          </span>
          <div className="flex items-center gap-6 font-mono text-xs tracking-wide text-[color:var(--color-ink-faint)]">
            <a href="#services" className="transition-colors hover:text-white">
              Services
            </a>
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="#contact" className="transition-colors hover:text-white">
              Contact
            </a>
          </div>
          <span className="font-mono text-xs tracking-widest text-[color:var(--color-ink-faint)]">
            © 2026 SoCal AI Labs
          </span>
        </div>
      </footer>

      {/* CONTACT FORM MODAL */}
      {showForm && (
        <div
          className="modal-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-black/80 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="modal-panel glass relative w-full max-w-lg rounded-2xl p-8"
            style={{ background: "var(--color-surface)" }}
          >
            <button
              ref={closeBtnRef}
              onClick={closeModal}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-[color:var(--color-ink-faint)] transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                <path
                  d="M3 3 L13 13 M13 3 L3 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {submitted ? (
              <div className="py-8 text-center" role="status" aria-live="polite">
                <svg
                  width="72"
                  height="72"
                  viewBox="0 0 72 72"
                  className="mx-auto mb-5"
                  aria-hidden
                >
                  <circle className="check-ring" cx="36" cy="36" r="27" />
                  <path className="check" d="M24 37 l8 8 l16 -18" />
                </svg>
                <h3 id="modal-title" className="mb-2 text-2xl font-bold">
                  Message Sent
                </h3>
                <p className="text-[color:var(--color-ink-soft)]">
                  Thanks for reaching out. We will get back to you within 24
                  hours.
                </p>
              </div>
            ) : (
              <>
                <h3 id="modal-title" className="mb-2 text-2xl font-bold">
                  Start a <span className="ignite">Project</span>
                </h3>
                <p className="mb-6 text-sm text-[color:var(--color-ink-soft)]">
                  Tell us about what you need and we will be in touch quickly.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    aria-label="Your name"
                    required
                    onChange={handleChange}
                    className="field"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    aria-label="Your email"
                    required
                    onChange={handleChange}
                    className="field"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name (optional)"
                    aria-label="Company name (optional)"
                    onChange={handleChange}
                    className="field"
                  />
                  <textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    aria-label="Project details"
                    required
                    rows={4}
                    onChange={handleChange}
                    className="field resize-none"
                  />
                  {status === "error" && (
                    <p
                      role="alert"
                      className="text-sm"
                      style={{ color: "var(--color-orange)" }}
                    >
                      Something went wrong sending your message. Please try
                      again, or email us directly.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn w-full disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {status === "sending" ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
