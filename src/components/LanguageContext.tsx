import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Lang = "en" | "tr";

type Entry = { en: string; tr: string };
const D = (en: string, _es: string, tr: string): Entry => ({ en, tr });

const dict: Record<string, Entry> = {
  // nav
  about: D("About Us", "Nosotros", "Hakkımızda"),
  awards: D("Our Awards", "Premios", "Ödüllerimiz"),
  projects: D("Our Projects", "Proyectos", "Projelerimiz"),
  robots: D("Our Robots", "Nuestros Robots", "Robotlarımız"),
  contact: D("Contact", "Contacto", "İletişim"),
  "nav.join": D("Join", "Únete", "Katıl"),

  // hero
  "hero.subtitle": D(
    "Tech with no limits, team with no boundaries.",
    "Tech with no limits, team with no boundaries.",
    "Sınırsız teknoloji, sınır tanımayan takım."
  ),
  "hero.cta1": D("Meet Us", "Conócenos", "Bizi Tanıyın"),
  "hero.cta2": D("Contact", "Contacto", "İletişim"),

  // about
  "about.who": D("Who We Are", "Quiénes Somos", "Biz Kimiz"),
  "about.h1": D("FROM ALL", "DESDE TODO", "TÜM"),
  "about.h2": D("OVER THE", "EL", "DÜNYAYA"),
  "about.h3": D("WORLD", "MUNDO", "ULAŞIYORUZ"),
  "about.body1.pre": D("is robotics team number", "es el equipo de robótica número", "robotik takım numarası"),
  "about.body1.post": D(
    ", founded in 2024 by students of Istanbul Technical University Vocational and Technical Anatolian High School for the FRC competition.",
    ", fundado en 2024 por estudiantes de la Escuela Secundaria Técnica de la Universidad Técnica de Estambul para la competición FRC.",
    " olan ve 2024'te İstanbul Teknik Üniversitesi Mesleki ve Teknik Anadolu Lisesi öğrencileri tarafından FRC yarışması için kurulan bir robotik takımıdır."
  ),
  "about.body2": D(
    "Our vision is to spread FRC, STEM, and positive sciences — inspiring everyone we reach. Although new, we move fast and share what we learn with the world.",
    "Nuestra visión es difundir FRC, STEM y las ciencias positivas — inspirando a todos los que alcanzamos. Aunque somos nuevos, avanzamos rápido y compartimos lo que aprendemos con el mundo.",
    "Vizyonumuz FRC, STEM ve pozitif bilimleri yaymak — ulaştığımız herkese ilham vermek. Yeni olsak da hızlı ilerliyor ve öğrendiklerimizi dünyayla paylaşıyoruz."
  ),
  "about.location": D("Location", "Ubicación", "Konum"),
  "about.locationVal": D("Istanbul · TR", "Estambul · TR", "İstanbul · TR"),
  "about.competition": D("Competition", "Competición", "Yarışma"),
  "about.scroll": D("Scroll", "Desplaza", "Kaydır"),
  "about.scrollVal": D("↓ Read more", "↓ Leer más", "↓ Devamını Oku"),

  // awards
  "awards.season": D("2025 Season", "Temporada 2025", "2025 Sezonu"),
  "awards.title1": D("Our", "Nuestros", ""),
  "awards.title2": D("Awards", "Premios", "Ödüllerimiz"),
  "awards.desc": D(
    "The awards we have earned throughout competitions — a reflection of our success.",
    "Los premios que hemos ganado a lo largo de las competiciones — un reflejo de nuestro éxito.",
    "Yarışmalar boyunca kazandığımız ödüller — başarımızın yansıması."
  ),

  // projects
  "projects.tag": D("What We Build", "Lo Que Construimos", "Neler Yapıyoruz"),
  "projects.title1": D("Our", "Nuestros", ""),
  "projects.title2": D("Projects", "Proyectos", "Projelerimiz"),
  "projects.desc": D(
    "Our social responsibility projects inspiring our community and the future.",
    "Nuestros proyectos de responsabilidad social inspirando a nuestra comunidad y al futuro.",
    "Toplumumuza ve geleceğe ilham veren sosyal sorumluluk projelerimiz."
  ),
  "projects.impact": D("Community Impact", "Impacto Comunitario", "Toplumsal Etki"),
  "projects.p1.title": D("WOMAN IN STEM", "MUJER EN STEM", "STEM'DE KADIN"),
  "projects.p1.tag": D("Empowerment", "Empoderamiento", "Güçlendirme"),
  "projects.p1.desc": D(
    "The Women in STEM project aims to encourage women in science, technology, engineering and mathematics fields and support their advancement. Through training, mentoring, and awareness-raising activities, we work toward equal representation in STEM careers.",
    "El proyecto Mujeres en STEM busca alentar a las mujeres en los campos de ciencia, tecnología, ingeniería y matemáticas y apoyar su avance. A través de capacitación, mentoría y actividades de concienciación, trabajamos hacia la representación igualitaria en carreras STEM.",
    "STEM'de Kadın projesi, bilim, teknoloji, mühendislik ve matematik alanlarında kadınları teşvik etmeyi ve ilerlemelerini desteklemeyi amaçlar. Eğitim, mentorluk ve farkındalık etkinlikleriyle STEM kariyerlerinde eşit temsil için çalışıyoruz."
  ),

  // robots
  "robots.tag": D("Our Fleet", "Nuestra Flota", "Robotlarımız"),
  "robots.title": D("MANIFEST", "MANIFEST", "MANIFEST"),
  "robots.desc": D(
    "Our 2026 season competition robot, engineered from the ground up by team Infinitech.",
    "Nuestro robot de competición de la temporada 2026, diseñado desde cero por el equipo Infinitech.",
    "2026 Sezonu Yarışma Robotumuz — Infinitech Takımı Tarafından Sıfırdan Tasarlanmıştır."
  ),
  "robots.season": D("Season", "Temporada", "Sezon"),
  "robots.code": D("Code", "Código", "Kod"),
  "robots.status": D("Status", "Estado", "Durum"),
  "robots.active": D("Active", "Activo", "Aktif"),
  "robots.team": D("Team", "Equipo", "Takım"),
  "robots.competition": D("Competition", "Competición", "Yarışma"),
  "robots.origin": D("Origin", "Origen", "Köken"),
  "robots.marker": D("Built to compete", "Construido para competir", "Yarışmak İçin Tasarlandı"),
  "projects.p2.title": D("HOPE FOR THE FUTURE", "ESPERANZA PARA EL FUTURO", "GELECEĞE UMUT"),
  "projects.p2.tag": D("Outreach", "Difusión", "Sosyal Yardım"),
  "projects.p2.desc": D(
    "In 2023, we organized an event in Istanbul to support children affected by the major earthquake in Türkiye. We delivered STEM presentations and an art workshop to spark curiosity, imagination, and a hopeful future for young minds.",
    "En 2023, organizamos un evento en Estambul para apoyar a los niños afectados por el gran terremoto en Turquía. Realizamos presentaciones STEM y un taller de arte para despertar la curiosidad, la imaginación y un futuro esperanzador.",
    "2023'te Türkiye'deki büyük depremden etkilenen çocukları desteklemek için İstanbul'da bir etkinlik düzenledik. Genç zihinlerde merak, hayal gücü ve umut dolu bir gelecek için STEM sunumları ve sanat atölyesi gerçekleştirdik."
  ),

  // contact
  "contact.tag": D("Get In Touch", "Contáctanos", "Bize Ulaşın"),
  "contact.title1": D("Let's", "Vamos a", ""),
  "contact.title2": D("Connect", "Conectar", "Bizimle İletişime Geçin"),
  "contact.desc": D(
    "Reach us for questions, collaboration offers or sponsorships.",
    "Contáctanos para preguntas, propuestas de colaboración o patrocinios.",
    "Sorularınız, İş Birliği Teklifleri Veya Sponsorluk İçin Bize Ulaşın."
  ),
  "contact.send": D("Send a message", "Envía un mensaje", "Bize Mesaj Gönder"),
  "contact.headline": D("Get in touch with us", "Ponte en contacto", "Bizimle İletişime Geç"),
  "contact.name": D("Name", "Nombre", "İsim"),
  "contact.email": D("Email", "Correo", "E-posta"),
  "contact.message": D("Message", "Mensaje", "Mesaj"),
  "contact.placeholder": D("Write your message…", "Escribe tu mensaje…", "Mesajınızı yazın…"),
  "contact.submit": D("SUBMIT", "ENVIAR", "GÖNDER"),
  "contact.thanks": D("THANKS ✓", "GRACIAS ✓", "TEŞEKKÜRLER ✓"),
  "contact.note": D(
    "We'll get back to you as soon as possible.",
    "Te responderemos lo antes posible.",
    "En kısa sürede dönüş yapacağız."
  ),

  // sponsors
  "sponsors.tag": D("Powered By", "Impulsado Por", "Destekçilerimiz"),
  "sponsors.title1": D("Our", "Nuestros", ""),
  "sponsors.title2": D("Supporters", "Patrocinadores", "Destekçilerimiz"),
  "sponsors.desc": D(
    "The partners who support us and turn our dreams into reality.",
    "Los socios que nos apoyan y convierten nuestros sueños en realidad.",
    "Bizi Destekleyen Ve Hayallerimizi Gerçeğe Dönüştüren Paydaşlarımız."
  ),
  "sponsors.become": D("+ Become a Sponsor", "+ Sé un Patrocinador", "+ Sponsor Ol"),
  "sponsors.join": D("Join the hive", "Únete a la colmena", "Aramıza Katıl"),

  // footer
  "footer.team": D("ISTAF FRC Team · Est. 2024", "Equipo ISTAF FRC · Est. 2024", "ISTAF FRC Takımı · Kuruluş 2024"),
  "footer.rights": D("All rights reserved.", "Todos los derechos reservados.", "Tüm Hakları Saklıdır."),
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (stored && ["en", "tr"].includes(stored)) setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  };

  const t = (k: string) => dict[k]?.[lang] ?? k;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
