#!/usr/bin/env node
/**
 * Hämtar aktuellt betyg och antal recensioner från Google Places API (New)
 * och skriver in siffrorna i index.html (hero-text, aria-label, stjärnor och
 * båda aggregateRating-blocken i JSON-LD) samt i content.js.
 *
 * Körs av .github/workflows/update-reviews.yml. Kräver GOOGLE_PLACES_API_KEY.
 * Sätt GOOGLE_PLACE_ID för att hoppa över sökningen (ett API-anrop mindre).
 */

import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const INDEX = join(ROOT, "index.html");
const CONTENT = join(ROOT, "content.js");

const SEARCH_QUERY = "Rodeluxe hair salong, Götgatan 18, 290 31 Kristianstad";
const FIELDS = "id,displayName,rating,userRatingCount";

function fail(msg) {
  console.error(`FEL: ${msg}`);
  process.exit(1);
}

const apiKey = process.env.GOOGLE_PLACES_API_KEY;
if (!apiKey) fail("GOOGLE_PLACES_API_KEY saknas.");

async function fetchPlace() {
  const placeId = process.env.GOOGLE_PLACE_ID?.trim();

  if (placeId) {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=sv`,
      { headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELDS } },
    );
    if (!res.ok) fail(`Places details ${res.status}: ${await res.text()}`);
    return res.json();
  }

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELDS.split(",").map((f) => `places.${f}`).join(","),
    },
    body: JSON.stringify({ textQuery: SEARCH_QUERY, languageCode: "sv", maxResultCount: 1 }),
  });
  if (!res.ok) fail(`Places searchText ${res.status}: ${await res.text()}`);

  const place = (await res.json()).places?.[0];
  if (!place) fail(`Ingen träff för "${SEARCH_QUERY}".`);
  console.log(`Tips: sätt GOOGLE_PLACE_ID=${place.id} som repository variable för att hoppa över sökningen.`);
  return place;
}

/** Nuvarande siffror i index.html – används som sanity-referens. */
function currentValues(html) {
  const m = html.match(/<span class="hero__rating-text">([\d.]+) · (\d+) recensioner<\/span>/);
  return m ? { rating: Number(m[1]), count: Number(m[2]) } : null;
}

/** Bustar ?v=-frågan för en cachad asset. Konvention i repot: YYYYMMDD-NN. */
function bumpVersion(text, file, stamp) {
  const marker = `${file}?v=`;
  const start = text.indexOf(marker);
  if (start === -1) return text;

  let end = start + marker.length;
  while (end < text.length && /[\w-]/.test(text[end])) end++;

  const current = text.slice(start + marker.length, end);
  const counter = Number(current.split("-")[1]);
  const next = Number.isInteger(counter) ? counter + 1 : 1;

  return text.split(marker + current).join(`${marker}${stamp}-${next}`);
}

const place = await fetchPlace();
const rating = place.rating;
const count = place.userRatingCount;

if (typeof rating !== "number" || rating < 1 || rating > 5) fail(`Orimligt betyg: ${rating}`);
if (!Number.isInteger(count) || count < 1) fail(`Orimligt antal recensioner: ${count}`);

let html = readFileSync(INDEX, "utf8");
const prev = currentValues(html);
if (prev && count < prev.count * 0.8) {
  fail(`Antalet recensioner föll från ${prev.count} till ${count} (>20 %). Avbryter – kontrollera manuellt.`);
}

const ratingStr = rating.toFixed(1);
const filled = Math.round(rating);
const stars = "★".repeat(filled) + "☆".repeat(5 - filled);

const before = html;
html = html
  .replace(
    /(<span class="hero__rating-text">)[^<]*(<\/span>)/,
    `$1${ratingStr} · ${count} recensioner$2`,
  )
  .replace(/aria-label="Betyg [^"]*"/g, `aria-label="Betyg ${ratingStr} av 5"`)
  .replace(
    /(<span class="owner-badge">⭐ )[\d.]+(\/5 Betyg<\/span>)/,
    `$1${ratingStr}$2`,
  )
  .replace(
    /(<div class="hero__stars"[^>]*>)[\s\S]*?(<\/div>)/,
    (_, open, close) =>
      `${open}\n                ${[...stars].map((s) => `<span>${s}</span>`).join("")}\n              ${close}`,
  )
  // Träffar bara aggregateRating – enskilda Review-block saknar reviewCount.
  .replace(
    /("ratingValue":\s*")[^"]*(",\s*"reviewCount":\s*")[^"]*(")/g,
    `$1${ratingStr}$2${count}$3`,
  );

let content = readFileSync(CONTENT, "utf8");
const contentBefore = content;
content = content.replace(
  /(rating:\s*\{\s*value:\s*)[\d.]+(,\s*count:\s*)\d+/,
  `$1${ratingStr}$2${count}`,
);

// content.js cachas immutable via ?v= i main.js – busta kedjan när innehållet ändras.
if (content !== contentBefore) {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  let main = readFileSync(join(ROOT, "main.js"), "utf8");
  const mainBefore = main;
  main = bumpVersion(main, "content.js", stamp);
  if (main !== mainBefore) {
    writeFileSync(join(ROOT, "main.js"), main);
    html = bumpVersion(html, "main.js", stamp);
  }
  writeFileSync(CONTENT, content);
}

if (html !== before) writeFileSync(INDEX, html);

const changed = html !== before || content !== contentBefore;
console.log(
  changed
    ? `Uppdaterat: ${ratingStr} · ${count} recensioner (var ${prev?.rating} · ${prev?.count})`
    : `Oförändrat: ${ratingStr} · ${count} recensioner`,
);

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `changed=${changed}\nrating=${ratingStr}\ncount=${count}\n`,
  );
}
