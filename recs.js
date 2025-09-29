/*****************************************************
 * recs.js — Catalog + Matching Engine (front-end)
 * API exposed on window:
 *   - generateRecommendations(prefs, options?)
 *   - savePlanToLocal(preferences, items)
 *   - getSavedPlan()
 *   - explainScore(prefs, item, cfg?)
 * Plus: window.__RECS_OK__ = true (health flag)
 *****************************************************/

/* -------------------- CATALOG -------------------- */
const CATALOG = [
  /* ---------- FOOD ---------- */
  { name: "Village Park Nasi Lemak", category: "Food", region: "Klang Valley", cuisine: "Malay",   cost: "Budget",   indoor: true,  weather_ok: ["rainy","cloudy","sunny"],
    openingHours: { mon:["07:00-20:00"], tue:["07:00-20:00"], wed:["07:00-20:00"], thu:["07:00-20:00"], fri:["07:00-21:00"], sat:["07:00-21:00"], sun:["07:00-20:00"] } },
  { name: "Jalan Alor Food Street",   category: "Food", region: "Klang Valley", cuisine: "Mixed",   cost: "Budget",   indoor: false, weather_ok: ["cloudy","sunny"],
    openingHours: { mon:["17:00-01:00"], tue:["17:00-01:00"], wed:["17:00-01:00"], thu:["17:00-01:00"], fri:["17:00-02:00"], sat:["17:00-02:00"], sun:["17:00-01:00"] } },
  { name: "Lot 10 Hutong",            category: "Food", region: "Klang Valley", cuisine: "Chinese", cost: "Mid-range",indoor: true,  weather_ok: ["rainy","cloudy","sunny"],
    openingHours: { mon:["10:00-22:00"], tue:["10:00-22:00"], wed:["10:00-22:00"], thu:["10:00-22:00"], fri:["10:00-22:00"], sat:["10:00-22:00"], sun:["10:00-22:00"] } },
  { name: "Bijan (Fine Malay)",       category: "Food", region: "Klang Valley", cuisine: "Malay",   cost: "Premium",  indoor: true,  weather_ok: ["rainy","cloudy","sunny"],
    openingHours: { mon:["17:30-22:30"], tue:["17:30-22:30"], wed:["17:30-22:30"], thu:["17:30-22:30"], fri:["17:30-23:00"], sat:["17:30-23:00"], sun:["17:30-22:30"] } },
  { name: "LOKL Cafe",                category: "Food", region: "Klang Valley", cuisine: "Cafe",    cost: "Mid-range",indoor: true,  weather_ok: ["rainy","cloudy","sunny"],
    openingHours: { mon:["08:00-18:00"], tue:["08:00-18:00"], wed:["08:00-18:00"], thu:["08:00-18:00"], fri:["08:00-18:00"], sat:["08:00-18:00"], sun:["08:00-18:00"] } },
  { name: "Gurney Drive Hawker",      category: "Food", region: "Penang",       cuisine: "Mixed",   cost: "Budget",   indoor: false, weather_ok: ["cloudy","sunny"],
    openingHours: { mon:["17:00-23:00"], tue:["17:00-23:00"], wed:["17:00-23:00"], thu:["17:00-23:00"], fri:["17:00-23:30"], sat:["17:00-23:30"], sun:["17:00-23:00"] } },
  { name: "Jonker Night Market Bites",category: "Food", region: "Melaka",       cuisine: "Mixed",   cost: "Budget",   indoor: false, weather_ok: ["cloudy","sunny"] },
  { name: "Teluk Kumbar Seafood",     category: "Food", region: "Penang",       cuisine: "Seafood", cost: "Mid-range",indoor: false, weather_ok: ["cloudy","sunny"] },
  { name: "Ipoh Beansprout Chicken",  category: "Food", region: "Ipoh",         cuisine: "Chinese", cost: "Budget",   indoor: true,  weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Welcome Seafood",          category: "Food", region: "Kota Kinabalu",cuisine: "Seafood", cost: "Mid-range",indoor: true,  weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Oriental Kopi", category: "Food", region: "Klang Valley", style: "Café/Local", budget: "Mid-range", indoor: true, weather_ok: ["rainy","cloudy","sunny"], preference: "Indoor" },
  { name: "Kenny Hills Bakers",        category: "Food", region: "Klang Valley", style: "Bakery/Café",    budget: "Mid-range", indoor: true,  weather_ok: ["sunny","cloudy","rainy"], preference: "Indoor" },
  { name: "Chocha Foodstore",          category: "Food", region: "Klang Valley", style: "Modern Fusion",  budget: "Premium",   indoor: true,  weather_ok: ["sunny","cloudy","rainy"], preference: "Indoor" },
  { name: "Sri Nirwana Maju (Bangsar)",category: "Food", region: "Klang Valley", style: "Banana Leaf",    budget: "Mid-range", indoor: true,  weather_ok: ["sunny","cloudy","rainy"], preference: "Flexible" },
  { name: "Brinchang Night Market Bites", category: "Food", region: "Cameron Highlands",   cuisine: "Mixed/Street Food", cost: "Budget",  interests: "Highlands",  indoor: false,  weather_ok: ["cloudy","sunny"]},
  { name: "Kampung Baru Food Street",          category: "Food",     region: "Klang Valley", cuisine: "Malay",   cost: "Budget", indoor: false, weather_ok: ["cloudy","sunny"] },
  { name: "Taman Connaught Street Bites",      category: "Food",     region: "Klang Valley", cuisine: "Mixed",   cost: "Budget", indoor: false, weather_ok: ["cloudy","sunny"] },
  { name: "Steam Era Steamboat",  category: "Food",   region: "Klang Valley",   cuisine: "Chinese",  style: "Steamboat/Hotpot",  cost: "Mid-range",  indoor: true,  weather_ok: ["rainy","cloudy","sunny"],  preference: "Indoor" },
  { name: "Hakka Restaurant (KL)",  category: "Food",  region: "Klang Valley",  cuisine: "Hakka Chinese",   cost: "Mid-range",  indoor: true,  weather_ok: ["rainy","cloudy","sunny"],  preference: "Indoor" },

  /* ---------- ACTIVITIES / NATURE / ATTRACTIONS ---------- */
  { name: "FRIM Canopy Walk",             category: "Activities", region: "Klang Valley", level: "Light",    indoor: false, weather_ok: ["cloudy","sunny"], preference: "Outdoor" },
  { name: "Broga Hill Sunrise",           category: "Activities", region: "Semenyih",     level: "Moderate",  indoor: false, weather_ok: ["sunny","cloudy"], preference: "Outdoor" },
  { name: "Sunway Lagoon",                category: "Activities", region: "Subang Jaya",  level: "Moderate",  indoor: false, weather_ok: ["sunny","cloudy"] },
  { name: "Aquaria KLCC",                 category: "Activities", region: "Klang Valley", level: "Light",     indoor: true,  weather_ok: ["rainy","cloudy","sunny"], preference: "Indoor",
    openingHours: { mon:["10:00-20:00"], tue:["10:00-20:00"], wed:["10:00-20:00"], thu:["10:00-20:00"], fri:["10:00-20:00"], sat:["10:00-20:00"], sun:["10:00-20:00"] } },
  { name: "Islamic Arts Museum",          category: "Activities", region: "Klang Valley",                    indoor: true,  weather_ok: ["rainy","cloudy","sunny"], preference: "Indoor",
    openingHours: { mon:["10:00-18:00"], tue:["10:00-18:00"], wed:["10:00-18:00"], thu:["10:00-18:00"], fri:["10:00-18:00"], sat:["10:00-18:00"], sun:["10:00-18:00"] } },
  { name: "Batu Caves Morning",           category: "Activities", region: "Klang Valley",                    indoor: false, weather_ok: ["sunny","cloudy"], preference: "Outdoor" },
  { name: "Putrajaya Sunset Cruise",      category: "Activities", region: "Putrajaya",                       indoor: "either", weather_ok: ["sunny","cloudy"] },
  { name: "Genting Awana SkyWay",         category: "Activities", region: "Genting Highlands",               indoor: "either", weather_ok: ["sunny","cloudy"] },

  /* ---------- NIGHT MARKETS (Shopping / Food crossovers) ---------- */
  { name: "Taman Connaught Night Market (Wed)", category: "Shopping", region: "Klang Valley", style: "Night Markets", indoor: false, weather_ok: ["cloudy","sunny"],
    openingHours: { wed:["17:00-23:00"] } },
  { name: "Setia Alam Night Market (Sat)",     category: "Shopping", region: "Klang Valley", style: "Night Markets", indoor: false, weather_ok: ["cloudy","sunny"],
    openingHours: { sat:["17:00-23:00"] } },
  { name: "SS2 Night Market (Mon)",            category: "Shopping", region: "Klang Valley", style: "Night Markets", indoor: false, weather_ok: ["cloudy","sunny"],
    openingHours: { mon:["17:00-23:00"] } },
  { name: "Batu Ferringhi Night Market",       category: "Shopping", region: "Penang",       style: "Night Markets", indoor: false, weather_ok: ["cloudy","sunny"] },
  { name: "Jonker Street Night Market",        category: "Shopping", region: "Melaka",       style: "Night Markets", indoor: false, weather_ok: ["cloudy","sunny"] },

  /* ---------- CAMERON HIGHLANDS ---------- */
  { name: "Big Red Strawberry Farm",           category: "Activities", region: "Cameron Highlands",     level: "Light",   interests: "Highlands", indoor: "either", weather_ok: ["cloudy","sunny"] },
  { name: "Raju Hill Strawberry Farm",         category: "Activities", region: "Cameron Highlands",     level: "Light",   interests: "Highlands", indoor: "either", weather_ok: ["cloudy","sunny"] },
  { name: "BOH Tea Plantation (Sungei Palas)", category: "Nature",     region: "Cameron Highlands",     interests: "Highlands", indoor: false, months_ok: ["march","april","july","august"], weather_ok: ["cloudy","sunny"] },
  { name: "Lavender Garden Cameron",           category: "Activities", region: "Cameron Highlands",     level: "Light",   indoor: "either", weather_ok: ["cloudy","sunny"] },
  { name: "Kea Farm Market",                   category: "Shopping",   region: "Cameron Highlands",     style: "Souvenirs", indoor: "either", weather_ok: ["cloudy","sunny"] },
  { name: "Brinchang Night Market (Pasar Malam)", category: "Shopping", region: "Cameron Highlands",    style: "Night Markets", interests: "Highlands",  indoor: false,  weather_ok: ["cloudy","sunny"],
    openingHours: { fri:["17:00-23:00"], sat:["17:00-23:00"] }},

  /* ---------- KL AREA EXTRAS ---------- */
  { name: "KL Forest Eco Park Canopy Walk",    category: "Activities", region: "Klang Valley", level: "Light",  indoor: false, weather_ok: ["cloudy","sunny"], preference: "Outdoor" },
  { name: "KL Bird Park",                      category: "Activities", region: "Klang Valley", level: "Light",  indoor: false, weather_ok: ["cloudy","sunny"], preference: "Outdoor" },
  { name: "Perdana Botanical Gardens",         category: "Activities", region: "Klang Valley", level: "Light",  indoor: false, weather_ok: ["cloudy","sunny"], preference: "Outdoor" },
  { name: "KL Tower Sky Deck",                 category: "Activities", region: "Klang Valley", level: "Light",  indoor: "either", weather_ok: ["rainy","cloudy","sunny"] },

  /* ---------- BATU CAVES (seasonal) ---------- */
  { name: "Batu Caves (Thaipusam Season)",     category: "Activities", region: "Klang Valley", indoor: false, months_ok: ["january","february"], weather_ok: ["sunny","cloudy"], preference: "Outdoor" },

  /* ---------- MOSQUES / LANDMARKS ---------- */
  { name: "Putra Mosque (Pink Mosque)", category: "Activities", region: "Putrajaya",  style: "Religious Landmark",  interests: "Architecture",  level: "Light", indoor: "either",  weather_ok: ["rainy","cloudy","sunny"],  preference: "Flexible",
    openingHours: { mon:["09:00-17:00"], tue:["09:00-17:00"], wed:["09:00-17:00"], thu:["09:00-17:00"], fri:["09:00-17:00"], sat:["09:00-17:00"], sun:["09:00-17:00"] } },
  { name: "Sultan Salahuddin Abdul Aziz Shah Mosque (Blue Mosque)",   category: "Activities", region: "Klang Valley",  style: "Religious Landmark", interests: "Architecture",  level: "Light", indoor: "either", weather_ok: ["rainy","cloudy","sunny"], preference: "Flexible"},

  /* ---------- NATURE ---------- */
  { name: "Cameron Highlands + Mossy Forest", category: "Nature", region: "Cameron Highlands",  interests: "Highlands", indoor: false, months_ok: ["march","april","july","august"], weather_ok: ["cloudy","sunny"] },
  { name: "Penang National Park Coastal Hike", category: "Nature", region: "Penang", interests: "Beaches",   indoor: false, weather_ok: ["sunny","cloudy"] },
  { name: "Taman Negara Day Trip",            category: "Nature", region: "Pahang",  interests: "Rainforest", indoor: false, weather_ok: ["sunny","cloudy"] },

  /* ---------- SHOPPING ---------- */
  { name: "Suria KLCC",              category: "Shopping", region: "Klang Valley", style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"],
    openingHours: { mon:["10:00-22:00"], tue:["10:00-22:00"], wed:["10:00-22:00"], thu:["10:00-22:00"], fri:["10:00-22:00"], sat:["10:00-22:00"], sun:["10:00-22:00"] } },
  { name: "Pavilion Kuala Lumpur",   category: "Shopping", region: "Klang Valley", style: "Luxury Mall",  indoor: true, weather_ok: ["rainy","cloudy","sunny"],
    openingHours: { mon:["10:00-22:00"], tue:["10:00-22:00"], wed:["10:00-22:00"], thu:["10:00-22:00"], fri:["10:00-22:00"], sat:["10:00-22:00"], sun:["10:00-22:00"] } },
  { name: "The Exchange TRX",        category: "Shopping", region: "Klang Valley", style: "Luxury Mall",  indoor: true, weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Sunway Pyramid",          category: "Shopping", region: "Klang Valley", style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"] },
  { name: "1 Utama Shopping Centre", category: "Shopping", region: "Klang Valley", style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"] },
  { name: "The Gardens Mall",        category: "Shopping", region: "Klang Valley", style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Paradigm Mall",           category: "Shopping", region: "Klang Valley", style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"] },
  { name: "IOI City Mall",           category: "Shopping", region: "Putrajaya",    style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Queensbay Mall",          category: "Shopping", region: "Penang",       style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Gurney Plaza",            category: "Shopping", region: "Penang",       style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Mahkota Parade",          category: "Shopping", region: "Melaka",       style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Dataran Pahlawan Mall",   category: "Shopping", region: "Melaka",       style: "Malls",        indoor: true, weather_ok: ["rainy","cloudy","sunny"] },

  /* ---------- ITINERARIES / LOCATIONS ---------- */
  { name: "Klang Valley City Highlights",   category: "Location", region: "Klang Valley",       duration: "1–2 days", indoor: "either", weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Klang Valley Shopping & Food",   category: "Location", region: "Klang Valley",       duration: "3–4 days", indoor: "either", weather_ok: ["rainy","cloudy","sunny"] },

  { name: "Penang Heritage & Food",         category: "Location", region: "Penang",             duration: "3–4 days", indoor: "either", weather_ok: ["cloudy","sunny"] },
  { name: "Penang Beaches (Batu Ferringhi)",category: "Location", region: "Penang",             duration: "1–2 days", indoor: "either", weather_ok: ["cloudy","sunny"] },

  { name: "Melaka Heritage Weekend",        category: "Location", region: "Melaka",             duration: "1–2 days", indoor: "either", weather_ok: ["cloudy","sunny"] },

  { name: "Cameron Highlands Tea & Trails", category: "Location", region: "Cameron Highlands",   duration: "3–4 days", indoor: "either", weather_ok: ["cloudy","sunny"] },
  { name: "Cameron Highlands Family Break", category: "Location", region: "Cameron Highlands",   duration: "1–2 days", indoor: "either", weather_ok: ["cloudy","sunny"] },

  { name: "Genting Highlands Theme Park",   category: "Location", region: "Genting Highlands",   duration: "1–2 days", indoor: "either", weather_ok: ["cloudy","sunny"] },
  { name: "Genting Highlands Outlet + Views", category: "Location", region: "Genting Highlands", duration: "1–2 days", indoor: "either", weather_ok: ["cloudy","sunny"] },

  { name: "Johor Bahru City & Legoland",    category: "Location", region: "Johor",              duration: "1–2 days", indoor: "either", weather_ok: ["rainy","cloudy","sunny"] },
  { name: "Johor Desaru Coast",             category: "Location", region: "Johor",              duration: "3–4 days", indoor: "either", weather_ok: ["cloudy","sunny"] },

  { name: "Putrajaya Day Trip",             category: "Location", region: "Putrajaya",          duration: "1–2 days", indoor: "either", weather_ok: ["rainy","cloudy","sunny"] },

  { name: "Sabah (KK & Kundasang)",         category: "Location", region: "Sabah",              duration: "3–4 days", indoor: "either", weather_ok: ["cloudy","sunny"] },
  { name: "Sabah Islands (TARP)",           category: "Location", region: "Sabah",              duration: "1–2 days", indoor: "either", weather_ok: ["sunny","cloudy"] },

  { name: "Sarawak (Kuching & Bako)",       category: "Location", region: "Sarawak",            duration: "3–4 days", indoor: "either", weather_ok: ["cloudy","sunny"] },

  { name: "Langkawi Beach Holiday",         category: "Location", region: "Langkawi",           duration: "3–4 days", indoor: "either", weather_ok: ["sunny","cloudy"] },
  { name: "Langkawi Cable Car & Nature",    category: "Location", region: "Langkawi",           duration: "1–2 days", indoor: "either", weather_ok: ["sunny","cloudy"] },
];

/* ---------------- HELPERS & NORMALIZERS ---------------- */
function norm(v){ return (v ?? "").toString().trim().toLowerCase(); }
function clamp01(x){ x = Number(x)||0; return x<0?0:x>1?1:x; }
function dedupeByName(items){
  const seen = new Set();
  return items.filter(it => {
    const key = norm(it.name || JSON.stringify(it));
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/* Time helpers (open-now & evening detection) */
function parseHM(s){ const [h,m] = s.split(":").map(Number); return h*60+m; }
function isTimeInRanges(minutes, ranges){
  return ranges.some(r => {
    const [a,b] = r.split("-").map(parseHM);
    return (a <= b) ? (minutes >= a && minutes <= b) : (minutes >= a || minutes <= b); // supports overnight
  });
}
function isOpenNow(item, localDate){
  if (!item.openingHours) return null; // unknown → neutral
  const days = ["sun","mon","tue","wed","thu","fri","sat"];
  const d = days[localDate.getDay()];
  const ranges = item.openingHours[d];
  if (!ranges || !ranges.length) return false;
  const mins = localDate.getHours()*60 + localDate.getMinutes();
  return isTimeInRanges(mins, ranges);
}
function isEvening(dt){
  const mins = dt.getHours()*60 + dt.getMinutes();
  return mins >= parseHM("16:30");
}

/* Night market detection */
function isNightMarket(item){
  return norm(item.style) === 'night markets';
}

/* Region aliases → canonical slugs */
const REGION_ALIASES = {
  "kuala lumpur / selangor":"kl_selangor",
  "klang valley":"kl_selangor",
  "kuala lumpur":"kl_selangor",
  "selangor":"kl_selangor",
  "subang jaya":"kl_selangor",
  "semenyih":"kl_selangor",

  "penang":"penang",
  "george town":"penang",

  "langkawi":"langkawi",
  "kedah":"langkawi",

  "melaka":"melaka",
  "malacca":"melaka",

  "johor":"johor",

  "putrajaya":"putrajaya",

  "sabah":"sabah",
  "kota kinabalu":"sabah",

  "sarawak":"sarawak",
  "kuching":"sarawak",

  "genting":"genting",
  "genting highlands":"genting",

  "cameron":"cameron",
  "cameron highlands":"cameron",
  "brinchang":"cameron",
  "tanah rata":"cameron",

  "pahang":"pahang" // generic Pahang (e.g., Taman Negara)
};

const REGION_CHILDREN = {
  pahang: new Set(['cameron','genting']),
  kedah:  new Set(['langkawi'])
};

function regionSlug(v){
  const k = norm(v);
  return REGION_ALIASES[k] || k;
}

function regionMatchesUser(itemRegion, userRegion){
  const item = regionSlug(itemRegion);
  const user = regionSlug(userRegion);
  if (!user) return true;
  if (item === user) return true;
  const kids = REGION_CHILDREN[user];
  return !!(kids && kids.has(item));
}

const MONTH_KEYS = {
  january:"january", february:"february", march:"march", april:"april", may:"may", june:"june",
  july:"july", august:"august", september:"september", october:"october", november:"november", december:"december"
};
function monthKey(v){ const k = norm(v); return MONTH_KEYS[k] || ""; }

/* richer indoor typing */
function indoorKind(v){
  if (v === true) return 'indoor';
  if (v === false) return 'outdoor';
  const s = norm(v);
  if (s === 'indoor')  return 'indoor';
  if (s === 'outdoor') return 'outdoor';
  if (s === 'semi' || s === 'either' || s === 'mixed') return 'semi';
  return null;
}
function boolIndoor(v){
  const k = indoorKind(v);
  return k === 'indoor' ? true : k === 'outdoor' ? false : null;
}

/* Budget mapping */
function parseBudgetToBucket(v){
  if (v == null || v === "") return null;               // “Any”
  const s = norm(v);
  if (s === "budget" || s === "low" || s === "cheap") return 1;
  if (s === "mid-range" || s === "mid" || s === "normal") return 2;
  if (s === "premium" || s === "high" || s === "expensive") return 3;
  const num = Number(s.replace(/[^0-9.]/g,""));
  if (!Number.isNaN(num) && num > 0){
    if (num <= 30) return 1;
    if (num <= 80) return 2;
    return 3;
  }
  return null;
}
function budgetsCompatible(itemBudget, userBudget){
  const i = parseBudgetToBucket(itemBudget);
  const u = parseBudgetToBucket(userBudget);
  if (u == null || i == null) return true; // “Any” or unknown → don’t block
  return Math.abs(i - u) <= 1;
}

/* ---------------- WEIGHTED SCORING CONFIG ---------------- */
const DEFAULT_WEIGHTS = {
  hard: { weather: 1 },
  soft: {
    category: 15,
    region: 15,
    cuisine: 10,
    style: 6,
    interests: 8,
    indoor: 10,
    weather: 10,
    month: 5,
    budget: 10,
    duration: 3,
    openNow: 8,     // NEW
    diversity: 6    // NEW (used in reranker)
  },
  penalties: {
    outdoorInRain: 12,
    farRegion: 6,
    budgetMismatch: 8
  }
};

function deepMerge(base, add){
  const out = JSON.parse(JSON.stringify(base));
  if (!add) return out;
  for (const k of Object.keys(add)){
    if (add[k] && typeof add[k] === 'object' && !Array.isArray(add[k])){
      out[k] = deepMerge(base[k] || {}, add[k]);
    } else {
      out[k] = add[k];
    }
  }
  return out;
}

function budgetDistance(userBudget, itemBudget){
  const U = parseBudgetToBucket(userBudget);
  const I = parseBudgetToBucket(itemBudget);
  if (U == null || I == null) return 0.5; // neutral
  const d = Math.abs(U - I);
  return d === 0 ? 1 : d === 1 ? 0.6 : 0.2;
}

/* ------------- CATEGORY ELIGIBILITY (Night Market bridging) ------------- */
function categoryEligible(item, targetCat, p={}){
  const ic = norm(item.category);
  const tc = norm(targetCat);
  if (!tc) return true;         // no filter → everything eligible
  if (ic === tc) return true;   // exact category match

  // Night Markets behave as Activities in the evening, and as Food anytime
  if (isNightMarket(item)){
    if (tc === 'activities'){
      const dt = p.localTimeISO ? new Date(p.localTimeISO) : new Date();
      return isEvening(dt);
    }
    if (tc === 'food') return true;
  }
  return false;
}

/* ---------------- HARD FILTERS ---------------- */
function passesHardRules(item, p){
  const kind = indoorKind(item.indoor);
  const pref = norm(p.preference);
  const w    = norm(p.weather);
  const strictWeather    = p.strictWeather ?? true;
  const strictPreference = p.strictPreference === true;

  // Hard region filter when user selected a region and didn't allow far travel
  if (p.region && !p.allowFarTravel){
    if (!regionMatchesUser(item.region, p.region)) return false;
  }

  // Only hard-enforce indoor/outdoor if strictPreference is on
  if (strictPreference){
    if (pref === "indoor"  && kind === 'outdoor') return false;
    if (pref === "outdoor" && kind === 'indoor')  return false;
  }

  // Weather hard filter (if strict) — drop items that don't list this weather
  if (strictWeather && w && Array.isArray(item.weather_ok) && !item.weather_ok.includes(w)){
    return false;
  }

  return true;
}

/* ---------------- EXPLAINABLE SCORING ---------------- */
function explainScore(p={}, item={}, cfg={}){
  const W = deepMerge(DEFAULT_WEIGHTS, cfg.weights || {});
  const strictWeather = p.strictWeather ?? true;

  // Hard reject due to weather
  if (W.hard.weather && p.weather && Array.isArray(item.weather_ok)){
    const ok = item.weather_ok.includes(norm(p.weather));
    if (!ok && strictWeather){
      return { item: item.name||item, hardRejected: true, reason: `Weather '${p.weather}' not ok` };
    }
  }

  let total = 0; let penalty = 0; const comp = {}; const pen = {};
  const add = (label, w, s) => { const m = clamp01(s); const pts = w*m; total += pts; comp[label] = { weight:w, match:m, points: +pts.toFixed(2) }; };

  // Category (use eligibility so Night Markets get credit under Activities-evening / Food)
  const targetCat = p.recommendationType || p.category;
  const catMatch = categoryEligible(item, targetCat, p) ? 1 : 0;
  add('category', W.soft.category, catMatch);

  // Region (soft score still shown, but hard filter already applied above)
  const sameRegion = p.region && regionSlug(item.region) === regionSlug(p.region);
  const regionMatch = sameRegion ? 1 : (p.allowFarTravel ? 0.6 : 0);
  add('region', W.soft.region, regionMatch);
  if (!sameRegion && p.region && !p.allowFarTravel){ pen.farRegion = W.penalties.farRegion || 0; penalty += W.penalties.farRegion || 0; }

  // Cuisine/Style/Interests
  if (p.cuisine && item.cuisine) add('cuisine', W.soft.cuisine, norm(item.cuisine) === norm(p.cuisine)); else add('cuisine', W.soft.cuisine, 0.5);
  if (p.style && item.style)     add('style',   W.soft.style,   norm(item.style)   === norm(p.style));
  if (p.interests && item.interests) add('interests', W.soft.interests, norm(item.interests) === norm(p.interests)); else add('interests', W.soft.interests, 0.5);

  // Indoor preference (soft, supports 'semi')
  const kind = indoorKind(item.indoor);
  const pref = norm(p.preference);
  let indoorMatch = 0.5;
  if (pref === 'indoor'){
    indoorMatch = (kind === 'indoor') ? 1 : (kind === 'semi' ? 0.7 : 0.3);
  } else if (pref === 'outdoor'){
    indoorMatch = (kind === 'outdoor') ? 1 : (kind === 'semi' ? 0.7 : 0.3);
  } else if (pref === 'flexible' || pref === '' || pref == null){
    indoorMatch = (kind === 'semi') ? 0.8 : 0.7;
  }
  add('indoor', W.soft.indoor, indoorMatch);

  // Weather suitability (soft)
  const w = norm(p.weather);
  let weatherMatch = 0.5;
  if (w && Array.isArray(item.weather_ok)) weatherMatch = item.weather_ok.includes(w) ? 1 : 0;
  add('weather', W.soft.weather, weatherMatch);
  if (w === 'rainy' && kind === 'outdoor'){
    pen.outdoorInRain = W.penalties.outdoorInRain || 0;
    penalty += W.penalties.outdoorInRain || 0;
  }

  // Month / seasonal
  const mk = monthKey(p.month);
  let monthMatch = 0.5;
  if (mk && Array.isArray(item.months_ok)) monthMatch = item.months_ok.includes(mk) ? 1 : 0.5;
  add('month', W.soft.month, monthMatch);

  // Budget
  const budgetMatch = budgetDistance(p.budget || p.cost || p.budgetRange, item.cost || item.budget);
  add('budget', W.soft.budget, budgetMatch);
  if (budgetMatch <= 0.2){ pen.budgetMismatch = W.penalties.budgetMismatch || 0; penalty += W.penalties.budgetMismatch || 0; }

  // Duration (for Location/itins)
  if (norm(targetCat)==='location' && p.duration && item.duration){
    add('duration', W.soft.duration, norm(p.duration) === norm(item.duration) ? 1 : 0.5);
  }

  // OPEN-NOW (soft): reward items open at the given local time; neutral if unknown
  let openNowMatch = 0.5;
  if (p.localTimeISO){
    const dt = new Date(p.localTimeISO);
    const open = isOpenNow(item, dt);
    if (open === true) openNowMatch = 1.0;
    else if (open === false) openNowMatch = 0.0;
  }
  add('openNow', W.soft.openNow, openNowMatch);

  const maxSoft = Object.values(W.soft).reduce((a,b)=>a+b,0);
  const totalAfterPenalty = Math.max(0, total - penalty);
  const score = clamp01(totalAfterPenalty / maxSoft) * 100;

  return {
    item: item.name || item,
    components: comp,
    penalties: pen,
    totalBeforePenalty: +total.toFixed(2),
    totalAfterPenalty: +totalAfterPenalty.toFixed(2),
    maxPoints: maxSoft,
    score: +score.toFixed(2),
    hardRejected: false
  };
}

/* ---------------- WRAPPER: simple score (0–100) ---------------- */
function scoreItem(item, p, cfg={}){
  const detail = explainScore(p, item, cfg);
  if (detail.hardRejected) return 0;
  return detail.score;
}

/* ---------------- DIVERSITY RERANKER (deterministic) ---------------- */
function rerankWithDiversity(scoredList, w = DEFAULT_WEIGHTS.soft.diversity, K = 12){
  const out = [];
  const counts = new Map(); // category -> freq encountered

  const safeName = e => String(e.it?.name || e.name || "");
  const safeCat  = e => norm(e.it?.category || e.category || "unknown");

  // one pass to apply small penalty proportional to existing freq
  for (const entry of scoredList){
    const cat = safeCat(entry);
    const freq = counts.get(cat) || 0;
    const penalty = (w * Math.max(0, freq)) / K; // small, bounded
    const adjusted = entry.score - penalty;
    out.push({ ...entry, score: +adjusted.toFixed(2), __cat: cat, __n: safeName(entry) });
    counts.set(cat, freq + 1);
  }

  // stable sort: score desc, then name asc (deterministic tie-break)
  return out.sort((a,b) => b.score - a.score || a.__n.localeCompare(b.__n));
}

/* ---------------- ENGINE ---------------- */
function generateRecommendations(prefs={}, options={}){
  const p = { allowFarTravel: false, strictWeather: true, strictPreference: false, ...prefs };

  // normalize once
  if (p.region) p.region = regionSlug(p.region);
  const cat = (p.recommendationType || p.category || "").trim();

  // prefilter by (bridged) category
  let pool = CATALOG.filter(it => categoryEligible(it, cat, p));

  // lock to chosen region unless user explicitly allows far travel
  if (p.region && !p.allowFarTravel){
    pool = pool.filter(it => regionMatchesUser(it.region, p.region));
  }

  // feasible by hard rules (weather/strict pref)
  const feasible = pool.filter(it => passesHardRules(it, p));
  const base = feasible.length ? feasible : pool;

  // score → re-rank for diversity → map to final cards
  const scored = base.map(it => ({ it, score: scoreItem(it, p, options) }));
  const diversified = rerankWithDiversity(scored, (options?.weights?.soft?.diversity ?? DEFAULT_WEIGHTS.soft.diversity), 12);

  const final = diversified
    .slice(0, 12)
    .map(x => ({
      name: x.it.name,
      description: makeDescription(x.it),
      location: x.it.region || "Malaysia",
      cost: x.it.cost || x.it.budget || "Varies",
      score: +(+x.score).toFixed(2)
    }));

  return dedupeByName(final).slice(0, 8);
}

/* -------- Description for cards -------- */
function makeDescription(it){
  const bits = [];
  if (it.category)  bits.push(it.category);
  if (it.cuisine)   bits.push(it.cuisine);
  if (it.style)     bits.push(it.style);
  if (it.interests) bits.push(it.interests);
  if (it.level)     bits.push(`Level: ${it.level}`);

  const k = indoorKind(it.indoor);
  if (k === 'indoor')  bits.push("Indoor");
  if (k === 'outdoor') bits.push("Outdoor");
  if (k === 'semi')    bits.push("Semi-Outdoor");

  return bits.join(" • ");
}

/* -------- Saved plan helpers -------- */
function savePlanToLocal(preferences, items){
  const bundle = { preferences, items, savedAt: new Date().toISOString() };
  localStorage.setItem("savedPlan", JSON.stringify(bundle));
  return bundle;
}
function getSavedPlan(){
  try { const raw = localStorage.getItem("savedPlan"); return raw ? JSON.parse(raw) : null; }
  catch { return null; }
}

/* -------- Expose for plain <script> usage -------- */
try {
  window.generateRecommendations = generateRecommendations;
  window.savePlanToLocal = savePlanToLocal;
  window.getSavedPlan = getSavedPlan;
  window.explainScore = explainScore;
  window.__CATALOG__ = CATALOG; // helpful for debuggers/overlays
  window.__RECS_OK__ = true;
  console.log('[recs.js] ready — catalog items:', Array.isArray(CATALOG) ? CATALOG.length : 'n/a');
} catch (e) {
  console.error('Failed to expose recs.js API:', e);
}
