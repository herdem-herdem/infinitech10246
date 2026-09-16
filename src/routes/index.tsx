  function About() {
  const { t } = useLang();
  return (
    <section id="about" className="relative bg-[#05060a] overflow-hidden">
      {/* HERO with GLOBE */}
      <div className="relative h-[92vh] min-h-[680px] w-full overflow-hidden">
        {/* deep blue gradient backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 600px at 10% 60%, #0b2a55 0%, transparent 55%), radial-gradient(700px 500px at 90% 30%, #0a1a3a 0%, transparent 55%), linear-gradient(180deg, #03060f 0%, #05060a 100%)",
          }}
        />
        <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />

        {/* Globe */}
        <div className="absolute inset-0 flex items-center justify-center md:justify-end">
          <Globe className="w-[90vw] max-w-[820px] md:mr-[-8%] md:translate-y-2" />
        </div>

        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(1200px 600px at 50% 100%, rgba(0,0,0,0.7), transparent 60%)" }} />

        {/* top label */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-[0.4em] uppercase border border-white/15 text-white" style={{ background: "rgba(255,255,255,0.02)" }}>
            <Sparkles size={12} /> {t("about.who")}
          </div>
        </div>

        {/* left tagline */}
        <div className="relative z-10 h-full flex items-center pointer-events-none">
          <div className="px-6 md:pl-16 max-w-2xl">
            <h2
              className="text-white font-light leading-[0.95] tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(3rem, 7vw, 6.5rem)" }}
            >
              {t("about.h1")}
              <br />
              {t("about.h2")}
              <br />
              <span className="italic" style={{ color: "#cfe0ff" }}>{t("about.h3")}</span>
            </h2>
            <div className="mt-6 space-y-3 text-white/65 text-sm md:text-base max-w-md leading-relaxed">
              <p>
                <span className="font-black text-white">TEAM INFINITECH</span> {t("about.body1.pre")} {" "}
                <span className="font-black" style={{ color: ORANGE }}>#10246</span>
                {t("about.body1.post")}
              </p>
              <p>{t("about.body2")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
