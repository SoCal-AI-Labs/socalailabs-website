"use client";
import { useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch("https://formspree.io/f/xykqgeeg", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      setSubmitted(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="min-h-screen bg-[#0B0C10] text-white font-sans">

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src="/SoCal_AI_Labs_logo_no_text-removebg.png"
            alt="SoCal AI Labs"
            className="h-10 w-auto mix-blend-screen"
          />
          <span className="text-xl font-bold tracking-tight">SoCal AI Labs</span>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="text-sm px-4 py-2 rounded-full border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black transition-all"
        >
          Get in Touch
        </button>
      </nav>

      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl">
          We Build AI Systems That{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
            Work For You
          </span>
        </h1>
        <p className="mt-6 text-lg text-white/60 max-w-xl">
          SoCal AI Labs designs and deploys autonomous AI systems for small and
          mid-size businesses — from lead generation to full operations
          automation.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="mt-10 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-lg hover:opacity-90 transition-all"
        >
          Start a Project
        </button>
      </section>

      {/* SERVICES */}
      <section className="px-8 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What We Build</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "AI Agent Systems",
              desc: "Autonomous multi-agent pipelines that handle tasks, make decisions, and operate without constant supervision.",
            },
            {
              title: "Lead Generation Automation",
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
          ].map((service) => (
            <div
              key={service.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-orange-400/50 transition-all"
            >
              <h3 className="text-lg font-semibold mb-3 text-orange-400">
                {service.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="px-8 py-20 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">About</h2>
        <p className="text-white/60 text-lg leading-relaxed">
          SoCal AI Labs is a Southern California based AI systems company
          founded by Matt. We specialize in building autonomous, production-ready
          AI systems that generate leads, automate operations, and create new
          revenue streams — without requiring your constant attention.
        </p>
      </section>

      {/* CONTACT */}
      <section className="px-8 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Build?</h2>
        <p className="text-white/60 mb-8">
          Tell us what you need. We will scope it, build it, and hand it off.
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-lg hover:opacity-90 transition-all"
        >
          Start a Project
        </button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-8 py-6 text-center text-white/30 text-sm">
        2026 SoCal AI Labs. All rights reserved.
      </footer>

      {/* CONTACT FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#13141a] border border-white/10 rounded-2xl p-8 w-full max-w-lg relative">
            <button
              onClick={() => { setShowForm(false); setSubmitted(false); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-xl"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-2">Message Sent</h3>
                <p className="text-white/60">
                  Thanks for reaching out. We will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-2">Start a Project</h3>
                <p className="text-white/60 mb-6 text-sm">
                  Tell us about what you need and we will be in touch quickly.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400 transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400 transition-all"
                  />
                  <input
                    type="text"
                    name="company"
                    placeholder="Company Name (optional)"
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400 transition-all"
                  />
                  <textarea
                    name="message"
                    placeholder="Tell us about your project..."
                    required
                    rows={4}
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-orange-400 transition-all resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-lg hover:opacity-90 transition-all"
                  >
                    Send Message
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