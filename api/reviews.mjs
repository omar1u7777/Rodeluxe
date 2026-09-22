/**
 * GET /api/reviews
 *
 * Returnerar betyg, antal recensioner och de senaste recensionstexterna
 * från Google Places API (New).
 *
 * API-nyckeln lever bara här på servern och når aldrig webbläsaren.
 *
 * Svaret cachas på Vercels edge i ett dygn. Googles villkor tillåter
 * cachning för prestanda men inte att recensionstexter lagras permanent —
 * därför hämtas de vid körning i stället för att checkas in i repot som
 * betyget och antalet gör (se scripts/update-reviews.mjs).
 */

const PLACE_ID = process.env.GOOGLE_PLACE_ID || "ChIJge-wbXYDVEYRzvr4opWpFpM";
const FIELD_MASK = "rating,userRatingCount,googleMapsUri,reviews";
const MAX_REVIEWS = 5;

/** Skicka aldrig vidare en URL med ett annat schema än https. */
function httpsOnly(value) {
  try {
    return new URL(value).protocol === "https:" ? value : "";
  } catch {
    return "";
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    // Sidan faller tillbaka på de statiska korten – inget fel för besökaren.
    res.setHeader("Cache-Control", "no-store");
    return res.status(503).json({ error: "missing_api_key" });
  }

  let place;
  try {
    const upstream = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(PLACE_ID)}?languageCode=sv&regionCode=SE`,
      { headers: { "X-Goog-Api-Key": apiKey, "X-Goog-FieldMask": FIELD_MASK } },
    );
    if (!upstream.ok) {
      res.setHeader("Cache-Control", "no-store");
      return res.status(502).json({ error: "upstream_error", status: upstream.status });
    }
    place = await upstream.json();
  } catch {
    res.setHeader("Cache-Control", "no-store");
    return res.status(502).json({ error: "upstream_unreachable" });
  }

  const reviews = (place.reviews ?? [])
    .map(r => ({
      author: (r.authorAttribution?.displayName ?? "").trim(),
      rating: typeof r.rating === "number" ? r.rating : null,
      text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
      when: r.relativePublishTimeDescription ?? "",
      // Googles attributionskrav: recensionen ska gå att klicka sig till.
      url: httpsOnly(r.googleMapsUri) || httpsOnly(place.googleMapsUri) || "",
    }))
    .filter(r => r.author && r.text && r.rating)
    .slice(0, MAX_REVIEWS);

  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
  return res.status(200).json({
    rating: place.rating ?? null,
    count: place.userRatingCount ?? null,
    mapsUrl: place.googleMapsUri ?? "",
    reviews,
  });
}
