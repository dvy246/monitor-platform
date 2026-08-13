/**
 * Internationalization (i18n) translation dictionary and route helper
 */

export const locales = ['en', 'es', 'de', 'fr'] as const;
export type Locale = typeof locales[number];

const translations = {
  en: {
    // Navigation
    displayTests: "Display Tests",
    touchTests: "Touch Tests",
    inputTests: "Input & Peripherals",
    audioTests: "Audio/Video I/O",
    arcadeSuite: "Arcade Suite",
    glossary: "Glossary",
    // Homepage
    telemetryOnline: "SYSTEM TELEMETRY ONLINE",
    heroTitle: "DISPLAY TEST ONLINE",
    heroDesc: "An advanced display engineering and digitizer calibration benchmark operating entirely client-side. Exposes pixel response times, sub-pixel structures, and touch grid stability.",
    resLabel: "Screen Resolution",
    dprLabel: "Device Pixel Ratio",
    depthLabel: "Color Depth",
    touchLabel: "Touch Interface",
    vsyncLabel: "V-Sync Refresh Rate",
    detecting: "Detecting...",
    measuring: "Measuring...",
    openVisual: "Open Visual Tests",
    openTouch: "Open Touch Tests",
    arcadeHeading: "Monitor Testing Arcade",
    arcadeDesc: "Play response blur checkers, Delta-E color puzzles, input latency tests, and spatial accuracy digitizer maps.",
    enterArcade: "Enter Arcade",
    // Common
    notice: "Notice",
    medicalNotice: "Looking for Medical or Toxicology Screening? This website is an engineering utility for electronic displays and mobile touch screens.",
    learnTerm: "Learn Terminology Differences",
    healthDir: "Accredited Health Directory",
    backHome: "Back to Home",
    startTest: "Start Test",
    stopTest: "Stop Test"
  },
  es: {
    displayTests: "Pruebas de Pantalla",
    touchTests: "Pruebas Táctiles",
    inputTests: "Entrada y Periféricos",
    audioTests: "E/S de Audio y Video",
    arcadeSuite: "Juegos de Arcade",
    glossary: "Glosario",
    telemetryOnline: "TELEMETRÍA DEL SISTEMA ACTIVA",
    heroTitle: "DISPLAY TEST ONLINE",
    heroDesc: "Un benchmark avanzado de ingeniería de pantallas y calibración de digitalizadores que funciona completamente del lado del cliente. Expone tiempos de respuesta de píxeles, estructuras de subpíxeles y estabilidad táctil.",
    resLabel: "Resolución de Pantalla",
    dprLabel: "Relación de Píxeles",
    depthLabel: "Profundidad de Color",
    touchLabel: "Interfaz Táctil",
    vsyncLabel: "Tasa de Refresco V-Sync",
    detecting: "Detectando...",
    measuring: "Midiendo...",
    openVisual: "Abrir Pruebas Visuales",
    openTouch: "Abrir Pruebas Táctiles",
    arcadeHeading: "Arcade de Pruebas",
    arcadeDesc: "Juegue a los comprobadores de desenfoque, acertijos de color Delta-E, pruebas de latencia y mapas de precisión táctil.",
    enterArcade: "Entrar al Arcade",
    notice: "Aviso",
    medicalNotice: "¿Busca pruebas médicas o toxicológicas? Este sitio web es una utilidad de ingeniería para pantallas electrónicas y pantallas táctiles móviles.",
    learnTerm: "Aprender diferencias de terminología",
    healthDir: "Directorio de salud acreditado",
    backHome: "Volver al inicio",
    startTest: "Iniciar prueba",
    stopTest: "Detener prueba"
  },
  de: {
    displayTests: "Display-Tests",
    touchTests: "Touchscreen-Tests",
    inputTests: "Eingabe & Peripherie",
    audioTests: "Audio/Video I/O",
    arcadeSuite: "Arcade-Spiele",
    glossary: "Glossar",
    telemetryOnline: "SYSTEMTELEMETRIE AKTIV",
    heroTitle: "DISPLAY TEST ONLINE",
    heroDesc: "Ein fortschrittlicher Benchmark für Display-Engineering und Digitalisierungs-Kalibrierung, der vollständig clientseitig ausgeführt wird. Zeigt Reaktionszeiten, Subpixel-Geometrien und Touch-Stabilität.",
    resLabel: "Bildschirmauflösung",
    dprLabel: "Pixelverhältnis (DPR)",
    depthLabel: "Farbtiefe",
    touchLabel: "Touch-Schnittstelle",
    vsyncLabel: "V-Sync Bildwiederholrate",
    detecting: "Erkennen...",
    measuring: "Messung...",
    openVisual: "Visual-Tests öffnen",
    openTouch: "Touchscreen-Tests öffnen",
    arcadeHeading: "Bildschirm-Test Arcade",
    arcadeDesc: "Spielen Sie Bewegungsunschärfe-Tester, Delta-E Farbrätsel, Klick-Latenz-Benchmarks und Touchscreen-Präzisionskarten.",
    enterArcade: "Arcade betreten",
    notice: "Hinweis",
    medicalNotice: "Suchen Sie nach medizinischen Drogentests? Diese Website ist eine technische Hilfsanwendung für elektronische Bildschirme und mobile Touchscreens.",
    learnTerm: "Begriffsunterschiede lernen",
    healthDir: "Akkreditiertes Gesundheitsverzeichnis",
    backHome: "Zurück zur Startseite",
    startTest: "Test starten",
    stopTest: "Test stoppen"
  },
  fr: {
    displayTests: "Tests d'Écran",
    touchTests: "Tests Tactiles",
    inputTests: "Entrées & Périphériques",
    audioTests: "E/S Audio/Vidéo",
    arcadeSuite: "Jeux d'Arcade",
    glossary: "Glossaire",
    telemetryOnline: "TÉLÉMÉTRIE SYSTÈME ACTIVE",
    heroTitle: "DISPLAY TEST ONLINE",
    heroDesc: "Un benchmark avancé d'ingénierie d'affichage et de calibrage de numériseur fonctionnant entièrement côté client. Expose les temps de réponse, les géométries de sous-pixels et la stabilité tactile.",
    resLabel: "Résolution d'Écran",
    dprLabel: "Rapport de Pixels (DPR)",
    depthLabel: "Profondeur de Couleur",
    touchLabel: "Interface Tactile",
    vsyncLabel: "Fréquence de Rafraîchissement",
    detecting: "Détection...",
    measuring: "Mesure...",
    openVisual: "Ouvrir les Tests Visuels",
    openTouch: "Ouvrir les Tests Tactiles",
    arcadeHeading: "Arcade de Test d'Écran",
    arcadeDesc: "Jouez à des testeurs de flou de mouvement, des puzzles de couleurs Delta-E, des benchmarks de latence et des cartes de précision tactile.",
    enterArcade: "Entrer dans l'Arcade",
    notice: "Remarque",
    medicalNotice: "Vous recherchez des dépistages médicaux ou toxicologiques ? Ce site web est un outil d'ingénierie pour les écrans électroniques et tactiles mobiles.",
    learnTerm: "Apprendre les différences de termes",
    healthDir: "Annuaire de santé accrédité",
    backHome: "Retour à l'accueil",
    startTest: "Démarrer le test",
    stopTest: "Arrêter le test"
  }
};

/**
 * Returns localized dictionary translation based on path locale prefix
 */
export function useTranslations(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const prefix = segments[0] as Locale;
  const lang: Locale = locales.includes(prefix) ? prefix : 'en';
  return {
    t: translations[lang],
    lang
  };
}

/**
 * Prefix standard path links with current locale if applicable
 */
export function localizeLink(path: string, currentLocale: string): string {
  if (currentLocale === 'en' || !locales.includes(currentLocale as Locale)) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${currentLocale}${cleanPath}`;
}
