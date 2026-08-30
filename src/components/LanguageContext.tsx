import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Lang = "en" | "tr";

type Entry = { en: string; tr: string };
const D = (en: string, tr: string): Entry => ({ en, tr });

const dict: Record<string, Entry> = {
  // nav
  about: D("About Us", "Hakkımızda"),
  awards: D("Our Awards", "Ödüllerimiz"),
  projects: D("Our Projects", "Projelerimiz"),
  robots: D("Our Robots", "Robotlarımız"),
  contact: D("Contact", "İletişim"),
  "nav.join": D("Join", "Katıl"),

  // hero
  "hero.subtitle": D(
    "Tech with no limits, team with no boundaries.",
    "Sınırsız teknoloji, sınır tanımayan takım.",
  ),
  "hero.cta1": D("Meet Us", "Bizi Tanıyın"),
  "hero.cta2": D("Contact", "İletişim"),

  // about
  "about.who": D("Who We Are", "Biz Kimiz"),
  "about.h1": D("FROM ALL", "TÜM"),
  "about.h2": D("OVER THE", "DÜNYAYA"),
  "about.h3": D("WORLD", "ULAŞIYORUZ"),
  "about.body1.pre": D(
    "is robotics team number",
    "robotik takım numarası",
  ),
  "about.body1.post": D(
    ", founded in 2024 by students of Istanbul Technical University Vocational and Technical Anatolian High School for the FRC competition.",
    " olan ve 2024'te İstanbul Teknik Üniversitesi Mesleki ve Teknik Anadolu Lisesi öğrencileri tarafından FRC yarışması için kurulan bir robotik takımıdır.",
  ),
  "about.body2": D(
    "Our vision is to spread FRC, STEM, and positive sciences — inspiring everyone we reach. Although new, we move fast and share what we learn with the world.",
    "Vizyonumuz FRC, STEM ve pozitif bilimleri yaymak — ulaştığımız herkese ilham vermek. Yeni olsak da hızlı ilerliyor ve öğrendiklerimizi dünyayla paylaşıyoruz.",
  ),
  "about.location": D("Location", "Konum"),
  "about.locationVal": D("Istanbul · TR", "İstanbul · TR"),
  "about.competition": D("Competition", "Yarışma"),
  "about.scroll": D("Scroll", "Kaydır"),
  "about.scrollVal": D("↓ Read more", "↓ Devamını Oku"),

  // awards
  "awards.season": D("2025 Season", "2025 Sezonu"),
  "awards.title1": D("Our", "Bizim"),
  "awards.title2": D("Awards", "Ödüllerimiz"),
  "awards.desc": D(
    "The awards we have earned throughout competitions — a reflection of our success.",
    "Yarışmalar boyunca kazandığımız ödüller — başarımızın yansıması.",
  ),

  // projects
  "projects.tag": D("What We Build", "Neler Yapıyoruz"),
  "projects.title1": D("Our", "Bizim"),
  "projects.title2": D("Projects", "Projelerimiz"),
  "projects.desc": D(
    "Our social responsibility projects inspiring our community and the future.",
    "Toplumumuza ve geleceğe ilham veren sosyal sorumluluk projelerimiz.",
  ),
  "projects.impact": D("Community Impact", "Toplumsal Etki"),
  "projects.p1.title": D("WOMAN IN STEM", "STEM'DE KADIN"),
  "projects.p1.tag": D("Empowerment", "Güçlendirme"),
  "projects.p1.desc": D(
    "The Women in STEM project aims to encourage women in science, technology, engineering and mathematics fields and support their advancement. Through training, mentoring, and awareness-raising activities, we work toward equal representation in STEM careers.",
    "STEM'de Kadın projesi, bilim, teknoloji, mühendislik ve matematik alanlarında kadınları teşvik etmeyi ve ilerlemelerini desteklemeyi amaçlar. Eğitim, mentorluk ve farkındalık etkinlikleriyle STEM kariyerlerinde eşit temsil için çalışıyoruz.",
  ),

  // robots
  "robots.tag": D("Our Fleet", "Robotlarımız"),
  "robots.title": D("MANIFEST", "MANIFEST"),
  "robots.desc": D(
    "Our 2026 season competition robot, engineered from the ground up by team Infinitech.",
    "2026 Sezonu Yarışma Robotumuz — Infinitech Takımı Tarafından Sıfırdan Tasarlanmıştır.",
  ),
  "robots.season": D("Season", "Sezon"),
  "robots.code": D("Code", "Kod"),
  "robots.status": D("Status", "Durum"),
  "robots.active": D("Active", "Aktif"),
  "robots.team": D("Team", "Takım"),
  "robots.competition": D("Competition", "Yarışma"),
  "robots.origin": D("Origin", "Köken"),
  "robots.marker": D("Built to compete", "Yarışmak İçin Tasarlandı"),
  "projects.p2.title": D("HOPE FOR THE FUTURE", "GELECEĞE UMUT"),
  "projects.p2.tag": D("Outreach", "Sosyal Yardım"),
  "projects.p2.desc": D(
    "In 2023, we organized an event in Istanbul to support children affected by the major earthquake in Türkiye. We delivered STEM presentations and an art workshop to spark curiosity, imagination, and a hopeful future for young minds.",
    "2023'te Türkiye'deki büyük depremden etkilenen çocukları desteklemek için İstanbul'da bir etkinlik düzenledik. Genç zihinlerde merak, hayal gücü ve umut dolu bir gelecek için STEM sunumları ve sanat atölyesi gerçekleştirdik.",
  ),

  // contact
  "contact.tag": D("Get In Touch", "Bize Ulaşın"),
  "contact.title1": D("Let's", "Hadi"),
  "contact.title2": D("Connect", "Bizimle İletişime Geçin"),
  "contact.desc": D(
    "Reach us for questions, collaboration offers or sponsorships.",
    "Sorularınız, İş Birliği Teklifleri Veya Sponsorluk İçin Bize Ulaşın.",
  ),
  "contact.send": D("Send a message", "Bize Mesaj Gönder"),
  "contact.headline": D("Get in touch with us", "Bizimle İletişime Geç"),
  "contact.name": D("Name", "İsim"),
  "contact.email": D("Email", "E-posta"),
  "contact.message": D("Message", "Mesaj"),
  "contact.placeholder": D("Write your message…", "Mesajınızı yazın…"),
  "contact.submit": D("SUBMIT", "GÖNDER"),
  "contact.thanks": D("THANKS ✓", "TEŞEKKÜRLER ✓"),
  "contact.note": D(
    "We'll get back to you as soon as possible.",
    "En kısa sürede dönüş yapacağız.",
  ),

  // sponsors
  "sponsors.tag": D("Powered By", "Destekçilerimiz"),
  "sponsors.title1": D("Our", "Bizim"),
  "sponsors.title2": D("Supporters", "Destekçilerimiz"),
  "sponsors.desc": D(
    "The partners who support us and turn our dreams into reality.",
    "Bizi Destekleyen Ve Hayallerimizi Gerçeğe Dönüştüren Paydaşlarımız.",
  ),
  "sponsors.become": D("+ Become a Sponsor", "+ Sponsor Ol"),
  "sponsors.join": D("Join the hive", "Aramıza Katıl"),

  // footer
  "footer.team": D(
    "ISTAF FRC Team · Est. 2024",
    "ISTAF FRC Takımı · Kuruluş 2024",
  ),
  "footer.rights": D("All rights reserved.", "Tüm Hakları Saklıdır."),
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored =
      typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (stored && ["en", "tr"].includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {
      // ignore
    }
  };

  const t = (k: string) => dict[k]?.[lang] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
