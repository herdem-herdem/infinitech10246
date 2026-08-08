import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useState, useEffect, useRef } from "react";
import {
  Trophy,
  Users,
  Rocket,
  Mail,
  Heart,
  Instagram,
  Send,
  Award,
  Menu,
  X,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import logo from "@/assets/logo.png";
import teamFrame from "@/assets/team-frame.jpg";
import teamCompetition from "@/assets/team-competition.jpg";
import teamCool from "@/assets/team-cool.jpg";
import mascot from "@/assets/mascot.jpg";
import flagBearer from "@/assets/flag-bearer.jpg";
import award1 from "@/assets/award-1.png";
import award2 from "@/assets/award-2.png";
import award3 from "@/assets/award-3.png";
import award4 from "@/assets/award-4.png";
import award5 from "@/assets/award-5.png";
import award6 from "@/assets/award-6.jpg";
import projectWomenStem from "@/assets/project-women-stem.jpg";
import projectHopeFuture from "@/assets/project-hope-future.jpg";
import manifestRobot from "@/assets/manifest-robot.png";
import { Globe } from "@/components/Globe";
import { useLang } from "@/components/LanguageContext";

export const Route = createFileRoute("/")({
  component: Index,
});

const ORANGE = "#f5a524";
const ORANGE_DEEP = "#e8941a";
const BLACK = "#0d0d0d";

const NAV = [
  { id: "about", key: "about" },
  { id: "awards", key: "awards" },
  { id: "projects", key: "projects" },
  { id: "robots", key: "robots" },
  { id: "contact", key: "contact" },
];

const LANGS: { code: "en" | "de" | "tr"; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "de", label: "DE", flag: "🇩🇪" },
  { code: "tr", label: "TR", flag: "🇹🇷" },
];

/* ---------------- SERVER ACTIONS ---------------- */
async function sendContactEmail(data: { name: string; email: string; message: string }) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (res.ok) return { ok: true as const };

  const details = await (async () => {
    try {
      const body = await res.json();
      if (body && typeof body === "object") return JSON.stringify(body);
    } catch {
      // ignore
    }
    try {
      return await res.text();
    } catch {
      return "";
    }
  })();

  return { ok: false as const, status: res.status, details };
}

/* ---------------- HEX BG ---------------- */
const HEX_BG = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='70' viewBox='0 0 80 70'%3E%3Cpath fill='none' stroke='%23000' stroke-opacity='0.15' stroke-width='1.2' d='M20 1 L60 1 L79 35 L60 69 L20 69 L1 35 Z'/%3E%3C/svg%3E\")",
};

/* ---------------- NAVBAR ---------------- */
function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  const order: { code: "en" | "de" | "tr"; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "de", label: "DE" },
    { code: "tr", label: "TR" },
  ];
  return (
    <div className="inline-flex items-center rounded-md border border-white/25 overflow-hidden bg-white/[0.04] backdrop-blur-sm">
      {order.map((l, i) => {
        const active = l.code === lang;
        return (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`px-3 py-1.5 text-[11px] font-bold tracking-[0.15em] transition-colors ${
              i > 0 ? "border-l border-white/25" : ""
            } ${active ? "bg-white text-black" : "text-white/85 hover:text-white hover:bg-white/10"}`}
            aria-pressed={active}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}

function AnimatePresenceFade({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, left: 0 });
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
    >
      <div
        className={`relative mx-auto max-w-6xl rounded-2xl border transition-all duration-500 ${
          scrolled
            ? "border-white/10 bg-black/20 backdrop-blur-md shadow-[0_8px_40px_-8px_rgba(0,0,0,0.4)]"
            : "border-white/[0.05] bg-black/5 backdrop-blur-sm"
        }`}
      >
        {/* glow accent */}
        <div className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-orange-400/60 to-transparent" />

        <div className="h-16 px-5 md:px-6 flex items-center justify-between gap-4">
          {/* logo + brand */}
          <a href="#home" onClick={(e) => handleNavClick(e, "home")} className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-orange-500/30 blur-md group-hover:bg-orange-500/50 transition-all" />
              <img
                src={logo}
                alt="Infinitech"
                className="relative h-10 w-10 object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-[10px] font-mono tracking-[0.3em] text-orange-400/80">#10246</span>
              <span className="text-sm font-black tracking-wider text-white" style={{ fontFamily: "'Impact', sans-serif" }}>
                INFINITECH
              </span>
            </div>
          </a>

          {/* center nav */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={(e) => handleNavClick(e, n.id)}
                className="relative px-3.5 py-2 text-[12px] font-bold uppercase tracking-[0.15em] text-white/70 hover:text-white transition-colors group"
              >
                {t(n.key)}
                <span className="absolute left-3.5 right-3.5 bottom-1 h-px bg-orange-400 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            ))}
          </nav>

          {/* right side */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-500 text-black hover:bg-orange-400 transition-colors shadow-[0_4px_20px_-4px_rgba(245,165,36,0.6)]"
            >
              <Sparkles size={12} /> {t("nav.join")}
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg text-orange-400 hover:bg-white/5 transition-colors"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="md:hidden border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col">
              {NAV.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-white/85 hover:text-orange-300 hover:bg-white/[0.04] rounded-lg transition-colors"
                >
                  {t(n.key)}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const { t } = useLang();

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-24"
      style={{ backgroundColor: BLACK }}
    >
      {/* photo backdrop */}
      <div className="absolute inset-0">
        <img
          src={teamCompetition}
          alt=""
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black" />
      </div>
      {/* honeycomb backdrop with orange dots */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${ORANGE}55, transparent 45%), radial-gradient(circle at 80% 70%, ${ORANGE_DEEP}55, transparent 45%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='70' viewBox='0 0 80 70'%3E%3Cpath fill='none' stroke='%23f5a524' stroke-width='1.2' d='M20 1 L60 1 L79 35 L60 69 L20 69 L1 35 Z'/%3E%3C/svg%3E\")",
        }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-6 max-w-5xl">
        <img
          src={logo}
          alt="Infinitech logo"
          className="w-44 md:w-64 mx-auto mb-6 drop-shadow-[0_0_40px_rgba(245,165,36,0.6)]"
        />

        <div
          className="inline-block px-4 py-1 mb-4 text-xs font-black tracking-[0.4em] text-black bg-[color:var(--c)] rounded-sm"
          style={{ "--c": ORANGE } as React.CSSProperties}
        >
          10246
        </div>

        <h1
          className="text-7xl md:text-9xl font-black tracking-tight"
          style={{ color: ORANGE, fontFamily: "'Impact', 'Oswald', sans-serif", letterSpacing: "-0.02em" }}
        >
          INFINITECH
        </h1>

        <p className="mt-6 text-base md:text-xl text-white/80 max-w-2xl mx-auto">
          {t("hero.subtitle")}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a
            href="#about"
            onClick={(e) => { e.preventDefault(); document.getElementById("about")?.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", window.location.pathname); }}
            className="inline-block px-8 py-3 rounded-full font-black text-black shadow-[0_10px_30px_-10px_rgba(245,165,36,0.8)] cursor-pointer transition-transform hover:scale-105"
            style={{ backgroundColor: ORANGE }}
          >
            {t("hero.cta1")}
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", window.location.pathname); }}
            className="inline-block px-8 py-3 rounded-full font-black border-2 cursor-pointer transition-transform hover:scale-105"
            style={{ borderColor: ORANGE, color: ORANGE }}
          >
            {t("hero.cta2")}
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------------- ABOUT ---------------- */
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
              "radial-gradient(900px 600px at 10% 60%, #0b2a55 0%, transparent 55%), radial-gradient(700px 500px at 90% 30%, #0a1a3a 0%, transparent 55%), linear-gradient(180deg, #03060f 0%, #05080f 100%)",
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black tracking-[0.4em] uppercase border border-white/15 text-white" style={{ background: "rgba(255,255,255,0.04)" }}>
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
                <span className="font-black text-white">TEAM INFINITECH</span> {t("about.body1.pre")}{" "}
                <span className="font-black" style={{ color: ORANGE }}>#10246</span>
                {t("about.body1.post")}
              </p>
              <p>{t("about.body2")}</p>
            </div>
          </div>
        </div>

        {/* bottom corner data */}
        <div className="absolute bottom-8 left-8 right-8 z-10 flex items-end justify-between text-white/50 text-[10px] font-mono uppercase tracking-widest">
          <div>
            <div className="text-white/30">{t("about.location")}</div>
            <div className="mt-1 text-white/90">{t("about.locationVal")}</div>
          </div>
          <div className="hidden md:block">
            <div className="text-white/30">{t("about.competition")}</div>
            <div className="mt-1 text-white/90">FRC · FIRST Robotics</div>
          </div>
          <div className="text-right">
            <div className="text-white/30">{t("about.scroll")}</div>
            <div className="mt-1 text-white/90">{t("about.scrollVal")}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- PHOTO STRIP ---------------- */
function PhotoStrip() {
  const photos = [teamCompetition, flagBearer, mascot, teamCool];
  const loop = [...photos, ...photos];
  return (
    <section className="relative bg-black py-10 overflow-hidden border-y border-orange-500/30">
      <div className="flex gap-6 animate-marquee w-max">
        {loop.map((src, i) => (
          <div
            key={i}
            className="relative w-[340px] h-[220px] rounded-xl overflow-hidden shrink-0 border-2 border-orange-500/30 shadow-[0_10px_40px_-10px_rgba(245,165,36,0.4)]"
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent" />
    </section>
  );
}

/* ---------------- AWARDS ---------------- */
const AWARDS = [
  { event: "EastBay Regional", title: "DEANS LIST FINALIST", img: award1 },
  { event: "Yıldız Off-Season", title: "FINALIST", img: award2 },
  { event: "EastBay Regional", title: "ROOKIE ALL-STAR", img: award3 },
  { event: "Ümraniye Off-Season", title: "TEAM SPIRIT", img: award4 },
  { event: "Yıldız Off-Season", title: "RISING ALL-STAR", img: award5 },
  { event: "İBB Off-Season", title: "JUDGES AWARD", img: award6 },
];

function Awards() {
  const [index, setIndex] = useState(0);
  const total = AWARDS.length;
  const go = (dir: number) => setIndex((i) => (i + dir + total) % total);
  const { t } = useLang();

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 5500);
    return () => clearInterval(id);
  }, [total]);

  return (
    <section
      id="awards"
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(900px 500px at 80% 10%, #1c1610 0%, transparent 60%), radial-gradient(800px 500px at 10% 90%, #181410 0%, transparent 55%), linear-gradient(180deg, #0a0908 0%, #0e0b08 100%)",
      }}
    >
      <div className="pointer-events-none absolute top-10 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-15" style={{ background: ORANGE }} />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-10" style={{ background: "#7a5cff" }} />
      <div className="absolute inset-0 hex-pattern opacity-[0.06]" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black tracking-[0.3em] uppercase mb-5 border border-white/15" style={{ background: "rgba(255,255,255,0.04)", color: "#fff" }}>
            <Trophy size={11} /> {t("awards.season")}
          </div>
          <h2 className="text-6xl md:text-8xl font-black leading-none text-white" style={{ fontFamily: "'Impact', sans-serif" }}>
            <RevealText>{t("awards.title1")}</RevealText>{" "}<span style={{ color: ORANGE }}><RevealText>{t("awards.title2")}</RevealText></span>
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-base md:text-lg text-white/60">
            {t("awards.desc")}
          </p>
        </div>


        {/* 3D COVERFLOW */}
        <div className="relative" style={{ perspective: 1600 }}>
          <div className="relative mx-auto max-w-5xl h-[460px] md:h-[540px] flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
            {AWARDS.map((a, i) => {
              const offset = ((i - index + total) % total);
              const rel = offset > total / 2 ? offset - total : offset;
              const abs = Math.abs(rel);
              const isActive = rel === 0;
              return (
                <motion.div
                  key={i}
                  animate={{
                    x: rel * 220,
                    z: -abs * 240,
                    rotateY: -rel * 28,
                    opacity: abs > 2 ? 0 : 1 - abs * 0.15,
                    scale: isActive ? 1 : 0.85,
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 22 }}
                  className="absolute"
                  style={{ width: "min(560px, 80vw)", transformStyle: "preserve-3d", zIndex: 10 - abs }}
                  onClick={() => setIndex(i)}
                >
                  <div className="relative aspect-[4/5] md:aspect-[16/11] rounded-[1.75rem] overflow-hidden border border-white/15 shadow-[0_50px_120px_-30px_rgba(0,0,0,0.95)] cursor-pointer">
                    <img src={a.img} alt={a.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 transition-opacity ${isActive ? "bg-gradient-to-t from-black/90 via-black/30 to-transparent" : "bg-black/60"}`} />
                    {isActive && (
                      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3 text-[10px] font-black tracking-[0.25em] uppercase border border-white/20"
                          style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", color: "#fff" }}
                        >
                          <Award size={11} /> {a.event}
                        </motion.div>
                        <motion.h3
                          initial={{ opacity: 0, y: 25 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-white font-black tracking-wider leading-none text-3xl md:text-5xl"
                          style={{ fontFamily: "'Impact', sans-serif" }}
                        >
                          {a.title}
                        </motion.h3>
                        <div className="mt-3 text-white/60 text-xs font-bold tracking-widest">
                          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* arrows */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous award"
            className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl border border-white/20 transition hover:scale-110 z-20"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", color: "#fff" }}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next award"
            className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-2xl border border-white/20 transition hover:scale-110 z-20"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", color: "#fff" }}
          >
            <ChevronRight size={24} />
          </button>

          {/* dots */}
          <div className="mt-10 flex justify-center gap-2">
            {AWARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-10" : "w-2"}`}
                style={{ background: i === index ? ORANGE : "rgba(255,255,255,0.2)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ---------------- PROJECTS ---------------- */
const PROJECTS = [
  { key: "p1", icon: Heart },
  { key: "p2", icon: Rocket },
];

function Projects() {
  const { t } = useLang();
  return (
    <section
      id="projects"
      className="relative py-24 px-6 overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: BLACK }}
    >
      {/* Energetic glows */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[420px] rounded-full blur-3xl opacity-25"
        style={{ background: ORANGE }}
      />
      <div className="absolute inset-0 hex-pattern opacity-15" />

      <div className="relative w-full max-w-6xl flex flex-col gap-8">
        {/* Header */}
        <div className="z-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-400/30 bg-orange-400/5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_#f5a524]" />
            <span className="text-[10px] tracking-[0.25em] font-bold text-orange-300 uppercase">
              {t("projects.tag")}
            </span>
          </div>
          <h2
            className="text-6xl md:text-8xl font-black text-white tracking-tight leading-none"
            style={{ fontFamily: "'Impact', sans-serif" }}
          >
            <RevealText>{t("projects.title1")}</RevealText>{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(180deg, ${ORANGE}, ${ORANGE_DEEP})` }}
            >
              <RevealText>{t("projects.title2")}</RevealText>
            </span>
          </h2>
        </div>

        {/* Collage */}
        <div className="relative h-[460px] md:h-[540px] w-full">
          {/* Project 1: Woman in STEM */}
          <article className="group absolute top-0 left-0 md:left-[4%] w-[68%] md:w-[55%] h-[75%] z-10 transition-all duration-500 hover:z-30 hover:scale-[1.02]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
              <img
                src={projectWomenStem}
                alt="Woman in STEM"
                loading="lazy"
                width={896}
                height={704}
                className="w-full h-full object-cover grayscale brightness-[0.55] contrast-125"
              />
              {/* Duotone wash */}
              <div
                className="absolute inset-0 mix-blend-color z-10"
                style={{ background: ORANGE }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-20" />
              <div className="absolute bottom-6 left-6 right-6 z-30">
                <span className="text-orange-300 font-bold text-[10px] tracking-[0.3em] uppercase">
                  {t("projects.p1.tag")}
                </span>
                <h3
                  className="text-2xl md:text-4xl font-black text-white mt-1 leading-tight"
                  style={{ fontFamily: "'Impact', sans-serif" }}
                >
                  {t("projects.p1.title")}
                </h3>
                <p className="text-white/70 text-xs md:text-sm max-w-sm mt-2 leading-relaxed line-clamp-3">
                  {t("projects.p1.desc")}
                </p>
              </div>
            </div>
          </article>

          {/* Project 2: Hope for the Future */}
          <article className="group absolute bottom-0 right-0 md:right-[4%] w-[64%] md:w-[50%] h-[72%] z-20 transition-all duration-500 hover:z-30 hover:scale-[1.02]">
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-orange-400/25 shadow-2xl shadow-orange-500/10">
              <img
                src={projectHopeFuture}
                alt="Hope for the Future"
                loading="lazy"
                width={896}
                height={704}
                className="w-full h-full object-cover grayscale brightness-[0.45] contrast-150"
              />
              {/* Duotone wash */}
              <div
                className="absolute inset-0 mix-blend-color z-10"
                style={{ background: ORANGE_DEEP }}
              />
              <div
                className="absolute inset-0 z-20 opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${ORANGE}22 0%, transparent 50%, ${BLACK} 100%)`,
                }}
              />
              <div className="absolute bottom-6 left-6 right-6 z-30">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-orange-300 font-bold text-[10px] tracking-[0.3em] uppercase">
                    {t("projects.p2.tag")}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-black font-black text-[9px] uppercase"
                    style={{ background: ORANGE }}
                  >
                    2023
                  </span>
                </div>
                <h3
                  className="text-2xl md:text-4xl font-black text-white leading-tight"
                  style={{ fontFamily: "'Impact', sans-serif" }}
                >
                  {t("projects.p2.title")}
                </h3>
                <p className="text-white/70 text-xs md:text-sm max-w-sm mt-2 leading-relaxed line-clamp-3">
                  {t("projects.p2.desc")}
                </p>
              </div>
              {/* Corner flare */}
              <div
                className="absolute top-0 right-0 w-32 h-32 blur-2xl z-20"
                style={{ background: `linear-gradient(225deg, ${ORANGE}55, transparent)` }}
              />
            </div>
          </article>

          {/* Decorative orbits */}
          <div className="absolute top-[44%] right-[28%] w-20 h-20 border border-orange-400/20 rounded-full hidden md:block animate-pulse" />
          <div className="absolute bottom-[18%] left-[34%] w-12 h-12 border border-orange-400/30 rotate-45 hidden md:block" />
        </div>

        {/* Footer accent */}
        <div className="z-20 flex justify-center mt-2">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em]">
              {t("projects.impact")}
            </span>
            <div className="w-12 h-px bg-orange-400/60" />
          </div>
        </div>
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,5,0.6)_100%)]" />
    </section>
  );
}



/* ---------------- ROBOTS ---------------- */
function Robots() {
  const { t } = useLang();
  return (
    <section
      id="robots"
      className="relative py-28 px-6 overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Background accents */}
      <div className="absolute inset-0 hex-pattern opacity-20 pointer-events-none" />
      <div
        className="pointer-events-none absolute top-1/3 -left-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-25"
        style={{ background: ORANGE }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -right-40 w-[520px] h-[520px] rounded-full blur-3xl opacity-20"
        style={{ background: ORANGE_DEEP }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-400/40 bg-orange-400/10 text-orange-300 text-xs font-bold tracking-[0.25em] uppercase mb-4"
          >
            <Rocket size={12} /> {t("robots.tag")}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tight"
            style={{ fontFamily: "'Impact', sans-serif" }}
          >
            {t("robots.title")}
          </motion.h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">{t("robots.desc")}</p>
        </div>

        {/* Robot showcase */}
        <div className="relative grid md:grid-cols-12 gap-8 items-center">
          {/* Left meta */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-3 space-y-6 order-2 md:order-1"
          >
            <div className="border-l-2 border-orange-400 pl-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
                {t("robots.season")}
              </div>
              <div
                className="text-4xl font-black text-white"
                style={{ fontFamily: "'Impact', sans-serif" }}
              >
                2026
              </div>
            </div>
            <div className="border-l-2 border-orange-400/60 pl-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
                {t("robots.code")}
              </div>
              <div className="text-lg font-mono text-orange-300">#10246 / R-01</div>
            </div>
            <div className="border-l-2 border-orange-400/40 pl-4">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
                {t("robots.status")}
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400" />
                </span>
                <span className="text-sm font-semibold text-white">
                  {t("robots.active")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Centered robot image */}
          <div className="md:col-span-6 order-1 md:order-2 relative flex items-center justify-center">
            {/* Rotating orbital ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, ease: "linear", repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[92%] aspect-square rounded-full border border-dashed border-orange-400/30" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 60, ease: "linear", repeat: Infinity }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[78%] aspect-square rounded-full border border-orange-400/20" />
            </motion.div>

            {/* Glow */}
            <div
              className="absolute w-[70%] aspect-square rounded-full blur-3xl opacity-40"
              style={{ background: `radial-gradient(circle, ${ORANGE}66 0%, transparent 70%)` }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <motion.img
                src={manifestRobot}
                alt="MANIFEST — 2026 Robot"
                className="relative w-full max-w-[520px] drop-shadow-[0_30px_50px_rgba(245,165,36,0.35)]"
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
              />
            </motion.div>

            {/* Name plate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20"
            >
              <div className="px-6 py-2 rounded-full border border-orange-400/50 bg-black/70 backdrop-blur-md">
                <span
                  className="text-2xl md:text-3xl font-black text-white tracking-[0.3em]"
                  style={{ fontFamily: "'Impact', sans-serif" }}
                >
                  MANIFEST
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right meta */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-3 space-y-6 order-3"
          >
            <div className="border-r-2 border-orange-400 pr-4 text-right">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
                {t("robots.team")}
              </div>
              <div
                className="text-lg font-black text-white"
                style={{ fontFamily: "'Impact', sans-serif" }}
              >
                INFINITECH
              </div>
            </div>
            <div className="border-r-2 border-orange-400/60 pr-4 text-right">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
                {t("robots.competition")}
              </div>
              <div className="text-sm text-white/80">FRC 2026</div>
            </div>
            <div className="border-r-2 border-orange-400/40 pr-4 text-right">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-1">
                {t("robots.origin")}
              </div>
              <div className="text-sm text-white/80">Istanbul · TR</div>
            </div>
          </motion.div>
        </div>

        {/* Bottom marker */}
        <div className="mt-20 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-orange-400/60" />
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.4em]">
              {t("robots.marker")}
            </span>
            <div className="w-12 h-px bg-orange-400/60" />
          </div>
        </div>
      </div>
    </section>
  );
}





/* ---------------- CONTACT ---------------- */
function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLang();
  return (
    <section
      id="contact"
      className="relative py-28 px-6 overflow-hidden"
      style={{ backgroundColor: BLACK }}
    >
      <div
        className="pointer-events-none absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full blur-3xl opacity-30"
        style={{ background: ORANGE }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full blur-3xl opacity-20"
        style={{ background: ORANGE_DEEP }}
      />
      <div className="absolute inset-0 hex-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-400/40 bg-orange-400/10 text-orange-300 text-xs font-bold tracking-[0.25em] uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            {t("contact.tag")}
          </div>
          <h2
            className="text-6xl md:text-8xl font-black text-white leading-none"
            style={{ fontFamily: "'Impact', sans-serif" }}
          >
            <RevealText>{t("contact.title1")}</RevealText>{" "}<span style={{ color: ORANGE }}><RevealText>{t("contact.title2")}</RevealText></span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
            {t("contact.desc")}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-5">
            <div className="relative group">
              <div
                className="absolute -inset-1 rounded-3xl blur-lg opacity-60 group-hover:opacity-90 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DEEP})` }}
              />
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-orange-400/30">
                <img src={teamCool} alt="Team Infinitech" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/90 backdrop-blur text-black text-xs font-black">
                    <MapPin size={12} /> ISTANBUL · TÜRKİYE
                  </div>
                  <div className="text-white font-black text-lg mt-2 leading-tight">
                    INFINITECH FRC TEAM #10246
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <SocialCard
                href="https://docs.google.com/forms/d/1gkE7U2z5IMtBZ1-nHg87BS_tF8JKUrUskV6uTfM7XGw/edit"
                label="Bize Katılın!"
                handle="Google Form"
                gradient="linear-gradient(135deg, #ea4335, #fbbc05)"
                icon={<JoinLogo />}
              />
              <SocialCard
                href="https://instagram.com/team.infinitech"
                label="Instagram"
                handle="@team.infinitech"
                gradient="linear-gradient(135deg, #515BD4, #8134AF, #DD2A7B, #F58529)"
                icon={<InstagramLogo />}
              />
              <SocialCard
                href="https://tiktok.com/@team.infinitech"
                label="TikTok"
                handle="@team.infinitech"
                gradient="linear-gradient(135deg, #25F4EE, #000000, #FE2C55)"
                icon={<TikTokLogo />}
              />
            </div>

            <a
              href="mailto:10246.infinitech@gmail.com"
              className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.04] backdrop-blur border border-white/10 hover:border-orange-400/50 hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                  style={{ background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DEEP})` }}
                >
                  <Mail size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Email</div>
                  <div className="text-white text-sm font-semibold truncate">10246.infinitech@gmail.com</div>
                </div>
              </div>
              <Send size={14} className="text-orange-400 shrink-0" />
            </a>
          </div>

          <div className="lg:col-span-3 relative">
            <div
              className="absolute -inset-px rounded-3xl opacity-80"
              style={{ background: `linear-gradient(135deg, ${ORANGE}, transparent 50%, ${ORANGE_DEEP})` }}
            />
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError(null);
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                try {
                  const data = {
                    name: formData.get("name")?.toString() || "",
                    email: formData.get("email")?.toString() || "",
                    message: formData.get("message")?.toString() || "",
                  };
                  const res = await sendContactEmail(data);
                  if (res.ok) {
                    setSent(true);
                    form.reset();
                    setTimeout(() => setSent(false), 4000);
                  } else {
                    const detail = (res.details || "").toString().trim();
                    if (res.status === 404) {
                      setError(
                        "Mesaj gönderilemedi (HTTP 404). `/api/contact` bulunamadı: Pages Functions/worker deploy edilmemiş veya `_worker.js` algılanmıyor.",
                      );
                    } else {
                      setError(
                        `Mesaj gönderilemedi (HTTP ${res.status}). ${detail ? `Detay: ${detail}` : ""}`.trim(),
                      );
                    }
                  }
                } catch {
                  setError("Bir hata oluştu. Lütfen tekrar deneyin.");
                } finally {
                  setLoading(false);
                }
              }}
              className="relative rounded-3xl bg-zinc-950/90 backdrop-blur-xl p-8 md:p-10 space-y-5 border border-white/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-orange-400 text-xs font-bold tracking-widest uppercase">
                    {t("contact.send")}
                  </div>
                  <div className="text-white text-2xl font-black mt-1">{t("contact.headline")}</div>
                </div>
                <img src={logo} alt="" className="w-14 opacity-90" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label={t("contact.name")} type="text" name="name" />
                <FormField label={t("contact.email")} type="email" name="email" />
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-300/90 mb-2 tracking-widest uppercase">
                  {t("contact.message")}
                </label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition resize-none"
                  placeholder={t("contact.placeholder")}
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs text-center font-semibold">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading || sent}
                className="w-full py-4 rounded-xl font-black text-black flex items-center justify-center gap-2 transition-all relative overflow-hidden group hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_DEEP})` }}
              >
                <span className="relative tracking-widest">
                  {loading ? "GÖNDERİLİYOR…" : sent ? t("contact.thanks") : t("contact.submit")}
                </span>
                {!loading && !sent && <Send size={16} className="relative" />}
              </button>

              <p className="text-xs text-zinc-500 text-center pt-1">
                {t("contact.note")}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialCard({
  href,
  label,
  handle,
  gradient,
  icon,
}: {
  href: string;
  label: string;
  handle: string;
  gradient: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative rounded-2xl p-[1.5px] overflow-hidden"
      style={{ background: gradient }}
    >
      <div className="relative h-full rounded-2xl bg-zinc-950/90 backdrop-blur p-4 flex flex-col items-center text-center gap-2 transition-transform group-hover:-translate-y-0.5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
          style={{ background: gradient }}
        >
          {icon}
        </div>
        <div className="text-white text-xs font-black tracking-wide mt-1">{label}</div>
        <div className="text-[10px] text-zinc-400 truncate w-full" title={handle}>{handle}</div>
      </div>
    </a>
  );
}

function GmailLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M12 13.065 1.5 6.75v10.5A1.75 1.75 0 0 0 3.25 19h3.5V12.5L12 16l5.25-3.5V19h3.5a1.75 1.75 0 0 0 1.75-1.75V6.75L12 13.065Z" />
      <path d="M22.5 5.25A1.75 1.75 0 0 0 20.75 3.5h-.5L12 9.5 3.75 3.5h-.5A1.75 1.75 0 0 0 1.5 5.25v1.5L12 13.065 22.5 6.75v-1.5Z" opacity=".85" />
    </svg>
  );
}

function JoinLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2 L14.6 8.2 L21.3 8.8 L16.2 13.3 L17.8 19.9 L12 16.3 L6.2 19.9 L7.8 13.3 L2.7 8.8 L9.4 8.2 Z" fill="currentColor" fillOpacity="0.15" />
      <circle cx="18.5" cy="5.5" r="2.2" fill="currentColor" stroke="none" />
      <path d="M18.5 4.2 V6.8 M17.2 5.5 H19.8" stroke="#0d0d0d" strokeWidth="1.4" />
    </svg>
  );
}


function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden>
      <path d="M16.5 3c.4 2.1 1.6 3.7 3.7 4.1v2.6c-1.4 0-2.7-.4-3.9-1.1v6.1a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.9 2.9 0 1 0 2 2.7V3h2.9Z" />
    </svg>
  );
}

function FormField({ label, type, name }: { label: string; type: string; name: string }) {
  return (
    <div>
      <label className="block text-xs font-bold text-orange-300/90 mb-2 tracking-widest uppercase">
        {label}
      </label>
      <input
        required
        name={name}
        type={type}
        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/30 transition"
      />
    </div>
  );
}

/* ---------------- SPONSORS ---------------- */
const SPONSORS = [
  { name: "TAŞÇILAR", sub: "" },
  { name: "POZA", sub: "" },
  { name: "SOYLULAR", sub: "Group" },
  { name: "FIKRET YÜKSEL", sub: "Foundation" },
  { name: "EXEN", sub: "" },
  { name: "COMCONT", sub: "" },
  { name: "EKŞIOĞLU", sub: "" },
];

function Sponsors() {
  const { t } = useLang();
  return (
    <section
      id="sponsors"
      className="relative py-28 px-6 overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${BLACK} 0%, #1a1208 50%, ${BLACK} 100%)`,
      }}
    >
      <div className="absolute inset-0 hex-pattern opacity-20" />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-20"
        style={{ background: ORANGE }}
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-400/40 bg-orange-400/10 text-orange-300 text-xs font-bold tracking-[0.25em] uppercase mb-4">
            <Heart size={12} fill="currentColor" /> {t("sponsors.tag")}
          </div>
          <h2
            className="text-6xl md:text-8xl font-black text-white leading-none"
            style={{ fontFamily: "'Impact', sans-serif" }}
          >
            <RevealText>{t("sponsors.title1")}</RevealText>{" "}<span style={{ color: ORANGE }}><RevealText>{t("sponsors.title2")}</RevealText></span>
          </h2>
          <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
            {t("sponsors.desc")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {SPONSORS.map((s, i) => (
            <div key={i} className="group relative">
              <div
                className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"
                style={{ background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DEEP})` }}
              />
              <div className="relative h-32 rounded-2xl bg-zinc-950/80 backdrop-blur border border-white/10 group-hover:border-orange-400/50 flex flex-col items-center justify-center text-center px-4 transition-colors overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${ORANGE}, transparent)` }}
                />
                <div className="font-black text-white text-base md:text-lg tracking-wider group-hover:text-orange-300 transition-colors">
                  {s.name}
                </div>
                {s.sub && (
                  <div className="text-[10px] text-zinc-500 mt-1 tracking-wider uppercase">
                    {s.sub}
                  </div>
                )}
              </div>
            </div>
          ))}

          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); history.replaceState(null, "", window.location.pathname); }}
            className="relative h-32 rounded-2xl flex flex-col items-center justify-center text-center px-4 group overflow-hidden hover:brightness-110 transition-all"
            style={{ background: `linear-gradient(135deg, ${ORANGE}, ${ORANGE_DEEP})` }}
          >
            <div className="relative text-black font-black text-base">{t("sponsors.become")}</div>
            <div className="relative text-black/70 text-[10px] mt-1 tracking-widest uppercase">
              {t("sponsors.join")}
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}


/* ---------------- FOOTER ---------------- */
function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-black border-t-4 border-orange-500 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <img src={logo} alt="Infinitech logo" className="h-10 w-10 object-contain" />
          </div>
          <div>
            <div className="font-black text-orange-400 tracking-wider">INFINITECH · 10246</div>
            <div className="text-xs text-white/40">{t("footer.team")}</div>
          </div>
        </div>
        <div className="text-sm text-white/40">
          © {new Date().getFullYear()} Team Infinitech. {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}

/* ---------------- REVEAL TEXT (word-by-word) ---------------- */
function RevealText({ children, className, style, as: As = "span" }: { children: string; className?: string; style?: React.CSSProperties; as?: "span" | "h2" }) {
  return <As className={className} style={style}>{children}</As>;
}

/* ---------------- COUNT UP ---------------- */
function CountUp({ to, suffix = "", duration = 1.8 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min(1, (now - start) / (duration * 1000));
            const eased = 1 - Math.pow(1 - p, 3);
            setVal(Math.round(to * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ---------------- STATS ---------------- */
function Stats() {
  const items = [
    { n: 2, suffix: "", label: "YIL DENEYİM" },
    { n: 20, suffix: "+", label: "ÜYE" },
    { n: 6, suffix: "", label: "ÖDÜL" },
  ];
  return (
    <section className="relative bg-black py-20 border-y border-white/10 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
      <div className="relative max-w-5xl mx-auto px-6 grid grid-cols-3 gap-8">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="text-center"
          >
            <div
              className="text-5xl md:text-7xl font-black"
              style={{ fontFamily: "'Impact', sans-serif", color: ORANGE, textShadow: "0 0 30px rgba(245,165,36,0.35)" }}
            >
              <CountUp to={it.n} suffix={it.suffix} />
            </div>
            <div className="mt-2 text-[10px] md:text-xs font-black text-white/60 tracking-[0.3em]">
              {it.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- SCROLL PROGRESS ---------------- */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      style={{
        scaleX,
        transformOrigin: "0% 50%",
        background: `linear-gradient(90deg, ${ORANGE}, ${ORANGE_DEEP}, ${ORANGE})`,
      }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[100] shadow-[0_0_12px_rgba(245,165,36,0.8)]"
    />
  );
}


function Index() {
  return (
    <main className="bg-black text-black overflow-x-hidden">
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <PhotoStrip />
      <Stats />
      <Awards />
      <Projects />
      <Robots />

      <Contact />
      <Sponsors />
      <Footer />
    </main>
  );
}
