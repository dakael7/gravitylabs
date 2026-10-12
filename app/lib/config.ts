// ============================================================
// GRAVITY LABS — Configuración central
// Edita este archivo para actualizar número de WhatsApp,
// enlaces, planes, portafolio y flags de funciones.
// ============================================================

export type WhatsAppMessageKey =
  | "default"
  | "heroCall"
  | "nebulaLanding"
  | "supernovaBusiness"
  | "customProject";

export const siteConfig = {
  // ----------------------------------------------------------
  // CONTACTO
  // ----------------------------------------------------------
  whatsappNumber: "584123907028",
  instagramUrl: "",

  // ----------------------------------------------------------
  // MENSAJES DE WHATSAPP
  // ----------------------------------------------------------
  whatsappMessages: {
    default:
      "Hola, estuve viendo la web de Gravity Labs y me gustaría información sobre sus servicios.",
    heroCall:
      "Hola, quiero agendar la llamada gratuita de 20 minutos con Gravity Labs.",
    nebulaLanding:
      "Hola, vi la web de Gravity Labs y quiero el plan Nebula Landing.",
    supernovaBusiness:
      "Hola, vi la web de Gravity Labs y quiero el plan Supernova Business.",
    customProject:
      "Hola, tengo un proyecto a medida que me gustaría comentarles. Me gustaría una propuesta.",
  } as Record<WhatsAppMessageKey, string>,

  // ----------------------------------------------------------
  // OFERTA DE LANZAMIENTO (Nebula Landing)
  // ----------------------------------------------------------
  launchOffer: {
    enabled: false,
    price: 78,
    spotsLeft: 3,
  },

  // ----------------------------------------------------------
  // FLAGS DE FUNCIONES
  // ----------------------------------------------------------
  showTeam: false,

  // ----------------------------------------------------------
  // PLANES
  // ----------------------------------------------------------
  plans: [
    {
      id: "nebula",
      name: "Nebula Landing",
      tagline: "Tu página de presentación, lista para recibir clientes.",
      priceFrom: 98,
      featured: false,
      badge: null as string | null,
      features: [
        "Landing page diseñada a tu medida",
        "Adaptada a celular",
        "Botón de WhatsApp con mensaje preparado",
        "Analíticas básicas",
      ],
      whatsappMessageKey: "nebulaLanding" as WhatsAppMessageKey,
    },
    {
      id: "supernova",
      name: "Supernova Business",
      tagline: "Tu casa digital completa.",
      priceFrom: 389,
      featured: true,
      badge: "Más completo" as string | null,
      features: [
        "Web profesional con varias secciones",
        "Sistema autogestionable para editar tu contenido",
        "Adaptada a celular",
        "Botón de WhatsApp con mensaje preparado",
      ],
      whatsappMessageKey: "supernovaBusiness" as WhatsAppMessageKey,
    },
  ],

  // ----------------------------------------------------------
  // PORTAFOLIO
  // ----------------------------------------------------------
  projects: [
    {
      id: "zenit",
      title: "Zénit",
      label: "Concepto de diseño" as "Concepto de diseño" | "Proyecto real",
      description:
        "Web para un estudio dental, pensada para que cada visita termine en un mensaje de WhatsApp.",
      type: "web" as "web" | "app",
      screenshot: "/images/portafolio/zenit-ss.png",
      alt: "Captura de pantalla completa del sitio web de Zénit, estudio dental",
      url: "https://zenitdental.vercel.app",
      ctaLabel: "Ver demo completa",
      featured: true,
    },
    {
      id: "arraigo",
      title: "Arraigo",
      label: "Concepto de diseño" as "Concepto de diseño" | "Proyecto real",
      description:
        "Concepto inmobiliario en Caracas con inventario directo y una experiencia guiada que prioriza documentos, estructura y servicios verificados.",
      type: "web" as "web" | "app",
      screenshot: "/images/portafolio/arraigo-ss.png",
      alt: "Captura del sitio de Arraigo Bienes Raíces, con su propuesta de inmuebles en Caracas",
      url: "https://rs-arraigo.vercel.app",
      ctaLabel: "Ver demo completa",
      featured: true,
    },
    {
      id: "rinde",
      title: "RINDE",
      label: "Proyecto real" as "Concepto de diseño" | "Proyecto real",
      description:
        "App de finanzas personales para Android, publicada en Google Play. Diseño, desarrollo y publicación completos.",
      type: "app" as "web" | "app",
      screenshot: "/images/res/RINDE.jpeg",
      alt: "Captura de pantalla de la app RINDE en un dispositivo Android",
      url: "https://play.google.com/store/apps/details?id=com.gravitylabs.rinde",
      ctaLabel: "Ver en Google Play",
      featured: false,
    },
  ],

  // ----------------------------------------------------------
  // PREGUNTAS FRECUENTES
  // ----------------------------------------------------------
  faq: [
    {
      id: "start",
      question: "¿Qué necesito para empezar?",
      answer:
        "Cuéntanos qué hace tu negocio y qué necesitas; con eso definimos los siguientes pasos.",
    },
    {
      id: "design-preview",
      question: "¿Voy a ver el diseño antes de que lo programen?",
      answer:
        "Sí. En el paso de diseño ves y pruebas tu web antes de iniciar el desarrollo.",
    },
    {
      id: "payment",
      question: "¿Cómo se paga?",
      answer: "Aceptamos Pago Móvil o Binance.",
    },
    {
      id: "edit",
      question: "¿Podré editar mi web yo mismo?",
      answer:
        "Con Supernova Business sí: incluye un sistema autogestionable. Nebula Landing es una página de presentación fija.",
    },
    {
      id: "which-plan",
      question: "¿Y si no sé qué plan elegir?",
      answer:
        "Comparamos lo que incluye cada plan y te orientamos según las necesidades de tu web.",
    },
  ],

  // ----------------------------------------------------------
  // EQUIPO (solo visible si showTeam = true)
  // ----------------------------------------------------------
  team: [
    {
      id: "team-1",
      name: "Tu nombre aquí",
      role: "Diseño & Producto",
      initials: "TN",
    },
    {
      id: "team-2",
      name: "Tu nombre aquí",
      role: "Desarrollo",
      initials: "TN",
    },
  ],
};

export type Project = (typeof siteConfig.projects)[number];
export type Plan = (typeof siteConfig.plans)[number];
export type FaqItem = (typeof siteConfig.faq)[number];
