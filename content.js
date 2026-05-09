export const BOOKING_URL = "https://www.bokadirekt.se/places/rodeluxe-130945";

export const BRAND = {
  name: "Rodeluxe",
  city: "Kristianstad",
  rating: {
    value: 5.0,
    count: 95,
  },
  tagline: "Premium barberarupplevelse med precision, stil och känsla.",
};

export const ABOUT_TEXT =
  "Välkommen till Rodeluxe Salong – en plats där skönhet möter avslappning. Hos oss får du inte bara en fantastisk klippning, utan också en upplevelse. Med vår avslappnande atmosfär, professionella frisörer och ett brett utbud av tjänster, från klippning och styling till ansiktsbehandlingar, erbjuder vi något för alla. Kasta en biljard innan din behandling, njut av en kopp kaffe och få en behandling som lyfter både ditt yttre och ditt humör. Vi erbjuder även hemkörningsklippningar för våra äldre kunder, vilket gör oss till ett flexibelt och tillgängligt val för alla.";

export const CONTACT = {
  address: {
    street: "Götgatan 18",
    postalCode: "290 31",
    city: "Kristianstad",
    country: "Sverige",
  },
  phone: {
    raw: "0729304898",
    display: "072-930 48 98",
  },
  instagram: {
    handle: "rodeluxe__",
    url: "https://www.instagram.com/rodeluxe__/",
  },
  facebook: {
    name: "Rodeluxe Salong",
    url: "https://www.facebook.com/p/Rodeluxe-Salong-61573210080819/",
  },
  geo: {
    lat: 56.0337,
    lng: 14.1664,
  },
  hours: [
    { day: "Måndag",  hours: "11:00 – 21:00" },
    { day: "Tisdag",  hours: "10:00 – 22:00" },
    { day: "Onsdag",  hours: "10:00 – 22:00" },
    { day: "Torsdag", hours: "10:00 – 22:00" },
    { day: "Fredag",  hours: "10:00 – 22:00" },
    { day: "Lördag",  hours: "10:00 – 22:00" },
    { day: "Söndag",  hours: "10:00 – 22:00" },
  ],
  hoursNote:
    "Obs! För snabb bokning: kontakta oss minst 1 timme innan bokning för att undvika krockar. Vi vill ge dig bästa service – din tid är viktig för oss.",
  email: "ahmed.darkoushi99@gmail.com",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Götgatan+18,+290+31+Kristianstad,+Sweden&t=&z=16&ie=UTF8&iwloc=&output=embed",
  mapsUrl:
    "https://maps.app.goo.gl/sskJF94BQNtN2h59A",
};

const BD = "https://www.bokadirekt.se/places/rodeluxe-130945";

export const SERVICES = [
  {
    category: "Paket",
    icon: "👑",
    items: [
      {
        name: "Paket Deluxe",
        durationMin: 120,
        price: { type: "fixed", sek: 1500 },
        description: "Ingår skäggvård, klippning, ansiktsbehandling, öronrengöring, vaxbehandling som avslutas med tvätt och fön.",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/paket-deluxe-3292323",
      },
    ],
  },
  {
    category: "Klippning",
    icon: "✂️",
    items: [
      {
        name: "Herrklippning",
        durationMin: 35,
        price: { type: "fixed", sek: 350 },
        description: "Tvätt & styling ingår.",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/herr-klippning-3289290",
      },
      {
        name: "Herrklippning — Hår och skägg",
        durationMin: 45,
        price: { type: "fixed", sek: 550 },
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/herr-klippning-har-och-skagg-3289289",
      },
      {
        name: "Damklippning",
        durationMin: 50,
        price: { type: "fixed", sek: 450 },
        description: "Tvätt & styling ingår.",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/dam-klippning-3289293",
      },
      {
        name: "Barnklippning",
        durationMin: 30,
        price: { type: "fixed", sek: 250 },
        description: "Upp till 10 år.",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/barn-klippning-3289291",
      },
      {
        name: "Pensionär",
        durationMin: 35,
        price: { type: "fixed", sek: 290 },
        description: "Tvätt & styling ingår.",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/herr-klippning-3289290",
      },
    ],
  },
  {
    category: "Skägg",
    icon: "🪒",
    items: [
      {
        name: "Skäggvård",
        durationMin: 20,
        price: { type: "from", sek: 250 },
        description: "Pris varierar beroende på dina personliga förutsättningar och önskemål.",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/skagg-3289292",
      },
    ],
  },
  {
    category: "Styling & Hårbehandling",
    icon: "💈",
    items: [
      {
        name: "Hårstyling",
        durationMin: 15,
        price: { type: "fixed", sek: 100 },
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/harstyling-3289294",
      },
      {
        name: "Keratin",
        durationMin: 120,
        price: { type: "fixed", sek: 1000 },
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/keratin-3289295",
      },
      {
        name: "Hårpermanent",
        durationMin: 150,
        price: { type: "fixed", sek: 1000 },
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/har-permanent-3289296",
      },
    ],
  },
  {
    category: "Ansikte",
    icon: "✨",
    items: [
      {
        name: "Ansiktsbehandling",
        durationMin: 60,
        price: { type: "fixed", sek: 400 },
        description: "Avslappnande behandling för ren och strålande hy.",
        bookingUrl: "https://www.bokadirekt.se/boka-tjanst/rodeluxe-130945/ansiktsbehandling-3289297",
      },
    ],
  },
  {
    category: "Förmåner",
    icon: "🎁",
    items: [
      {
        name: "Fri parkering",
        durationMin: 0,
        price: { type: "fixed", sek: 0 },
        description: "Gratis parkering finns tillgänglig för alla våra kunder.",
      },
      {
        name: "Bonuskort",
        durationMin: 0,
        price: { type: "fixed", sek: 0 },
        description: "9:e klippningen gratis! Samla stämpel på varje besök.",
      },
    ],
  },
];

export const GALLERY_IMAGES = [
  {
    src: "https://cdn.bokadirekt.se/ucdn/ac19a524-46c6-4e39-9604-b183c95d1361/",
    alt: "Rodeluxe – salongbild 1",
  },
  {
    src: "https://cdn.bokadirekt.se/ucdn/b70921c2-f9d0-4756-a5bf-553d84ccbc94/",
    alt: "Rodeluxe – salongbild 2",
  },
  {
    src: "https://cdn.bokadirekt.se/ucdn/817040af-02e0-47b2-8548-0d7d3ad4f4fd/",
    alt: "Rodeluxe – salongbild 3",
  },
  {
    src: "https://cdn.bokadirekt.se/ucdn/ea188114-cfcf-4d0f-a763-b360d073bf32/",
    alt: "Rodeluxe – salongbild 4",
  },
  {
    src: "https://cdn.bokadirekt.se/ucdn/1fc31640-8104-41d3-951e-d73504445e72/",
    alt: "Rodeluxe – salongbild 5",
  },
  {
    src: "https://cdn.bokadirekt.se/ucdn/52c3857a-0515-4511-843f-0eeb93620a59/",
    alt: "Rodeluxe – salongbild 6",
  },
  {
    src: "https://cdn.bokadirekt.se/ucdn/ad6f70b9-c165-4a14-866a-92f641518924/",
    alt: "Rodeluxe – salongbild 7",
  },
  {
    src: "https://cdn.bokadirekt.se/ucdn/1434b49b-8ee4-491c-9e8e-4d8ac3d221d9/",
    alt: "Rodeluxe – salongbild 8",
  },
];
