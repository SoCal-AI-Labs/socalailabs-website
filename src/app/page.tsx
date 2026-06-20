import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0C10] text-white font-sans">

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Image
            src="/SoCal_AI_Labs_logo_no_text-removebg.png"
            alt="SoCal AI Labs"
            width={56}
            height={56}
            className="h-14 w-auto mix-blend-screen"
            priority
          />
          <span className="text-xl font-bold tracking-tight">SoCal AI Labs</span>
        </div>
        <a
          href="mailto:matt@socalailabs.com"
          className="text-sm px-4 py-2 rounded-full border border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-black transition-all"
        >
          Get in Touch
        </a>
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
        <a
          href="mailto:matt@socalailabs.com"
          className="mt-10 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-lg hover:opacity-90 transition-all"
        >
          Start a Project
        </a>
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
        <a
          href="mailto:matt@socalailabs.com"
          className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-semibold text-lg hover:opacity-90 transition-all"
        >
          matt@socalailabs.com
        </a>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 px-8 py-8 flex flex-col items-center gap-3 text-white/30 text-sm">
        <Image
          src="/logo.png"
          alt="SoCal AI Labs"
          width={140}
          height={40}
          className="h-8 w-auto opacity-50"
        />
        <span>© 2026 SoCal AI Labs. All rights reserved.</span>
      </footer>

    </main>
  );
}