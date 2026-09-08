import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Lang = "en" | "de" | "tr";

type Entry = { en: string; de: string; tr: string };
const D = (en: string, de: string, tr: string): Entry => ({ en, de, tr });

const dict: Record<string, Entry> = {
  // nav
  about: D("About Us", "Über uns", "Hakkımızda"),
  awards: D("Our Awards", "Unsere Auszeichnungen", "Ödüllerimiz"),
  projects: D("Our Projects", "Unsere Projekte", "Projelerimiz"),
  robots: D("Our Robots", "Unsere Roboter", "Robotlarımız"),
  contact: D("Contact", "Kontakt", "İletişim"),
  "nav.join": D("Join", "Mitmachen", "Katıl"),

  // hero
  "hero.subtitle": D(
    "Tech with no limits, team with no boundaries.",
    "Technik ohne Grenzen, ein Team ohne Barrieren.",
    "Sınırsız teknoloji, sınır tanımayan takım.",
  ),
  "hero.cta1": D("Meet Us", "Lern uns kennen", "Bizi Tanıyın"),
  "hero.cta2": D("Contact", "Kontakt", "İletişim"),

  // about
  "about.who": D("Who We Are", "Wer wir sind", "Biz Kimiz"),
  "about.h1": D("FROM ALL", "AUS DER GANZEN", "TÜM"),
  "about.h2": D("OVER THE", "WELT", "DÜNYAYA"),
  "about.h3": D("WORLD", "HINAUS", "ULAŞIYORUZ"),
  "about.body1.pre": D(
    "is robotics team number",
    "ist das Robotik-Team mit der Nummer",
    "robotik takım numarası",
  ),
  "about.body1.post": D(
    ", founded in 2024 by students of Istanbul Technical University Vocational and Technical Anatolian High School for the FRC competition.",
    ", gegründet 2024 von Schüler:innen der Beruflichen und Technischen Anatolischen Oberschule der Istanbul Technischen Universität für den FRC-Wettbewerb.",
    " olan ve 2024'te İstanbul Teknik Üniversitesi Mesleki ve Teknik Anadolu Lisesi öğrencileri tarafından FRC yarışması için kurulan bir robotik takımıdır.",
  ),
  "about.body2": D(
    "Our vision is to spread FRC, STEM, and positive sciences — inspiring everyone we reach. Although new, we move fast and share what we learn with the world.",
    "Unsere Vision ist es, FRC, MINT und die positiven Wissenschaften zu verbreiten – und alle zu inspirieren, die wir erreichen. Obwohl wir neu sind, bewegen wir uns schnell und teilen unser Wissen mit der Welt.",
    "Vizyonumuz; FRC, STEM ve pozitif bilimleri yaygınlaştırarak bilime ve teknolojiye olan ilgiyi artırmak, ulaştığımız herkese ilham vermek. Infinitech olarak deneyimlerimizi paylaşarak sürekli gelişiyor, üretiyor ve öğrendiklerimizi daha geniş kitlelere aktarıyoruz. Geçmişten aldığımız tecrübeyle geleceğe yön veriyor, birlikte öğrenerek daha ileriye ilerliyoruz.",
  ),
  "about.location": D("Location", "Standort", "Konum"),
  "about.locationVal": D("Istanbul · TR", "Istanbul · TR", "İstanbul · TR"),
  "about.competition": D("Competition", "Wettbewerb", "Yarışma"),
  "about.scroll": D("Scroll", "Scrollen", "Kaydır"),
  "about.scrollVal": D("↓ Read more", "↓ Mehr lesen", "↓ Devamını Oku"),

  // awards
  "awards.season": D("2025 Season", "Saison 2025", "2025 Sezonu"),
  "awards.title1": D("Our", "Unsere", "Bizim"),
  "awards.title2": D("Awards", "Auszeichnungen", "Ödüllerimiz"),
  "awards.desc": D(
    "The awards we have earned throughout competitions — a reflection of our success.",
    "Die Auszeichnungen, die wir über Wettbewerbe hinweg gewonnen haben – ein Spiegel unseres Erfolgs.",
    "Yarışmalar boyunca kazandığımız ödüller — başarımızın yansıması.",
  ),

  // projects
  "projects.tag": D("What We Build", "Was wir bauen", "Neler Yapıyoruz"),
  "projects.title1": D("Our", "Unsere", "Bizim"),
  "projects.title2": D("Projects", "Projekte", "Projelerimiz"),
  "projects.desc": D(
    "Our social responsibility projects inspiring our community and the future.",
    "Unsere Sozialprojekte, die unsere Gemeinschaft und die Zukunft inspirieren.",
    "Toplumumuza ve geleceğe ilham veren sosyal sorumluluk projelerimiz.",
  ),
  "projects.impact": D("Community Impact", "Wirkung in der Community", "Toplumsal Etki"),
  "projects.p1.title": D("WOMAN IN STEM", "FRAUEN IN MINT", "STEM'DE KADIN"),
  "projects.p1.tag": D("Empowerment", "Stärkung", "Güçlendirme"),
  "projects.p1.desc": D(
    "The Women in STEM project aims to encourage women in science, technology, engineering and mathematics fields and support their advancement. Through training, mentoring, and awareness-raising activities, we work toward equal representation in STEM careers.",
    "Das Projekt „Women in STEM“ möchte Frauen in Wissenschaft, Technik, Ingenieurwesen und Mathematik ermutigen und ihre Weiterentwicklung unterstützen. Durch Trainings, Mentoring und Awareness-Aktivitäten arbeiten wir an einer gleichberechtigten Repräsentation in MINT-Berufen.",
    "STEM'de Kadın projesi, bilim, teknoloji, mühendislik ve matematik alanlarında kadınları teşvik etmeyi ve ilerlemelerini desteklemeyi amaçlar. Eğitim, mentorluk ve farkındalık etkinlikleriyle STEM kariyerlerinde eşit temsil için çalışıyoruz.",
  ),

  // robots
  "robots.tag": D("Our Fleet", "Unsere Flotte", "Robotlarımız"),
  "robots.title": D("MANIFEST", "MANIFEST", "MANIFEST"),
  "robots.desc": D(
    "Our 2026 season competition robot, engineered from the ground up by team Infinitech.",
    "Unser Wettbewerbsroboter der Saison 2026 – von Team Infinitech von Grund auf entwickelt.",
    "2026 Sezonu Yarışma Robotumuz — Infinitech Takımı Tarafından Sıfırdan Tasarlanmıştır.",
  ),
  "robots.season": D("Season", "Saison", "Sezon"),
  "robots.code": D("Code", "Code", "Kod"),
  "robots.status": D("Status", "Status", "Durum"),
  "robots.active": D("Active", "Aktiv", "Aktif"),
  "robots.inactive": D("Inactive", "Inaktiv", "Pasif"),
  "robots.balli.desc": D(
    "Our 2025 season competition robot, designed by team Infinitech.",
    "Unser Wettbewerbsroboter der Saison 2025 – von Team Infinitech entwickelt.",
    "2025 Sezonu Yarışma Robotumuz — Infinitech Takımı Tarafından Tasarlanmıştır.",
  ),
  "robots.team": D("Team", "Team", "Takım"),
  "robots.competition": D("Competition", "Wettbewerb", "Yarışma"),
  "robots.origin": D("Origin", "Herkunft", "Köken"),
  "robots.marker": D("Built to compete", "Für den Wettkampf gebaut", "Yarışmak İçin Tasarlandı"),
  "projects.p2.title": D("HOPE FOR THE FUTURE", "HOFFNUNG FÜR DIE ZUKUNFT", "GELECEĞE UMUT"),
  "projects.p2.tag": D("Outreach", "Outreach", "Sosyal Yardım"),
  "projects.p2.desc": D(
    "In 2023, we organized an event in Istanbul to support children affected by the major earthquake in Türkiye. We delivered STEM presentations and an art workshop to spark curiosity, imagination, and a hopeful future for young minds.",
    "Im Jahr 2023 organisierten wir in Istanbul eine Veranstaltung, um Kinder zu unterstützen, die vom schweren Erdbeben in der Türkei betroffen waren. Mit MINT-Präsentationen und einem Kunstworkshop wollten wir Neugier, Fantasie und Hoffnung für die Zukunft wecken.",
    "2023'te Türkiye'deki büyük depremden etkilenen çocukları desteklemek için İstanbul'da bir etkinlik düzenledik. Genç zihinlerde merak, hayal gücü ve umut dolu bir gelecek için STEM sunumları ve sanat atölyesi gerçekleştirdik.",
  ),

  // contact
  "contact.tag": D("Get In Touch", "Kontakt aufnehmen", "Bize Ulaşın"),
  "contact.title1": D("Let's", "Lass uns", "Hadi"),
  "contact.title2": D("Connect", "Kontakt aufnehmen", "Bizimle İletişime Geçin"),
  "contact.desc": D(
    "Reach us for questions, collaboration offers or sponsorships.",
    "Kontaktier uns für Fragen, Kooperationsangebote oder Sponsoring.",
    "Sorularınız, İş Birliği Teklifleri Veya Sponsorluk İçin Bize Ulaşın.",
  ),
  "contact.send": D("Send a message", "Nachricht senden", "Bize Mesaj Gönder"),
  "contact.headline": D("Get in touch with us", "Kontaktiere uns", "Bizimle İletişime Geç"),
  "contact.name": D("Name", "Name", "İsim"),
  "contact.email": D("Email", "E-Mail", "E-posta"),
  "contact.message": D("Message", "Nachricht", "Mesaj"),
  "contact.placeholder": D("Write your message…", "Schreib deine Nachricht…", "Mesajınızı yazın…"),
  "contact.submit": D("SUBMIT", "SENDEN", "GÖNDER"),
  "contact.thanks": D("THANKS ✓", "DANKE ✓", "TEŞEKKÜRLER ✓"),
  "contact.note": D(
    "We'll get back to you as soon as possible.",
    "Wir melden uns so schnell wie möglich bei dir.",
    "En kısa sürede dönüş yapacağız.",
  ),

  // sponsors
  "sponsors.tag": D("Powered By", "Unterstützt von", "Destekçilerimiz"),
  "sponsors.title1": D("Our", "Unsere", "Bizim"),
  "sponsors.title2": D("Supporters", "Unterstützer", "Destekçilerimiz"),
  "sponsors.desc": D(
    "The partners who support us and turn our dreams into reality.",
    "Partner, die uns unterstützen und unsere Träume Wirklichkeit werden lassen.",
    "Bizi Destekleyen Ve Hayallerimizi Gerçeğe Dönüştüren Paydaşlarımız.",
  ),
  "sponsors.become": D("+ Become a Sponsor", "+ Sponsor werden", "+ Sponsor Ol"),
  "sponsors.join": D("Join the hive", "Werde Teil des Schwarms", "Aramıza Katıl"),

  // footer
  "footer.team": D(
    "Infinitech FRC Team · Est. 2024",
    "Infinitech FRC Team · Gegr. 2024",
    "Infinitech FRC Takımı · Kuruluş 2024",
  ),
  "footer.rights": D("All rights reserved.", "Alle Rechte vorbehalten.", "Tüm Hakları Saklıdır."),
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
