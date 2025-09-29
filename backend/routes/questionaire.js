// questionnaire.js

// ---------- Helpers ----------
const $  = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const val = (sel) => ($(sel) && $(sel).value) || "";

// Track current category from the buttons
let currentCategory = null;

// ---------- Boot ----------
document.addEventListener("DOMContentLoaded", init);

async function init() {
  await loadPartials();

  const modal = $("#questionnaireModal");
  const closeBtn = $("#closeModal");
  const categoryBar = $("#categoryBar");

  // Open modal on category click
  categoryBar?.addEventListener("click", (e) => {
    const btn = e.target.closest(".category-btn");
    if (!btn) return;
    currentCategory = btn.dataset.category || btn.textContent.trim();
    localStorage.setItem("recommendationType", currentCategory);
    // highlight active
    $$(".category-btn").forEach(b => b.classList.toggle("active", b === btn));
    openQuestionnaireModal(currentCategory);
  });

  // Close modal (X)
  closeBtn?.addEventListener("click", closeQuestionnaireModal);

  // Close on backdrop
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeQuestionnaireModal();
  });

  // Auto-select first category for UX
  const first = $("#categoryBar .category-btn");
  if (first && !currentCategory) first.click();
}

function loadPartials() {
  const nav = fetch("navbar.html").then(r => r.text()).then(h => $("#navbar-placeholder").innerHTML = h).catch(()=>{});
  const foot = fetch("footer.html").then(r => r.text()).then(h => $("#footer-placeholder").innerHTML = h).catch(()=>{});
  return Promise.all([nav, foot]);
}

// ---------- Modal + Form ----------
function openQuestionnaireModal(category) {
  const modal = $("#questionnaireModal");
  const oldForm = $("#questionnaireForm");

  // Replace form node to drop old listeners
  const freshForm = oldForm.cloneNode(false);
  oldForm.parentNode.replaceChild(freshForm, oldForm);

  freshForm.innerHTML = `
    <h3 id="q-title">Preferences for ${category} Recommendations</h3>
    ${renderCategoryFields(category)}
    ${renderCommonFields()}
    <button type="submit" id="savePrefsBtn">Get Recommendations</button>
  `;

  // Submit handler
  freshForm.addEventListener("submit", onSubmitQuestionnaire(category));

  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

function closeQuestionnaireModal() {
  const modal = $("#questionnaireModal");
  const form  = $("#questionnaireForm");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  if (form) form.innerHTML = "";
}

// ---------- Category-specific fields ----------
function renderCategoryFields(category) {
  switch (category) {
    case "Food":
      return `
        <label for="cuisine" class="stack">
          <span class="label">Cuisine</span>
          <select id="cuisine">
            <option value="">Any</option>
            <option value="Malay">Malay</option>
            <option value="Chinese">Chinese</option>
            <option value="Indian">Indian</option>
            <option value="Nyonya">Nyonya</option>
            <option value="Seafood">Seafood</option>
          </select>
        </label>

        <label for="budget" class="stack">
          <span class="label">Budget</span>
          <select id="budget">
            <option value="">Any</option>
            <option value="Budget">Budget</option>
            <option value="Mid-range">Mid-range</option>
            <option value="Premium">Premium</option>
          </select>
        </label>
      `;

    case "Location":
      return `
        <label for="region" class="stack">
          <span class="label">Region</span>
          <select id="region" name="region">
            <option value="">Any</option>
            <optgroup label="Cities & Heritage">
              <option value="kl_selangor">Kuala Lumpur / Selangor</option>
              <option value="penang">Penang</option>
              <option value="melaka">Malacca (Melaka)</option>
            </optgroup>
            <optgroup label="Islands & Beaches">
              <option value="langkawi">Langkawi</option>
              <option value="sabah">Sabah</option>
              <option value="sarawak">Sarawak</option>
            </optgroup>
            <optgroup label="Highlands & Nature">
              <option value="genting">Genting Highlands</option>
              <option value="cameron">Cameron Highlands</option>
              <option value="johor">Johor</option>
            </optgroup>
          </select>
        </label>

        <label for="duration" class="stack">
          <span class="label">Duration</span>
          <select id="duration">
            <option value="">Any</option>
            <option value="1–2 days">1–2 days</option>
            <option value="3–4 days">3–4 days</option>
            <option value="5+ days">5+ days</option>
          </select>
        </label>
      `;

    case "Activities":
      return `
        <label for="activities" class="stack">
          <span class="label">Activity Type</span>
          <select id="activities">
            <option value="">Any</option>
            <option value="Theme Parks">Theme Parks</option>
            <option value="Museums & Culture">Museums & Culture</option>
            <option value="Hiking">Hiking</option>
            <option value="Island / Water">Island / Water</option>
          </select>
        </label>

        <label for="level" class="stack">
          <span class="label">Intensity</span>
          <select id="level">
            <option value="">Any</option>
            <option value="Light">Light</option>
            <option value="Moderate">Moderate</option>
            <option value="High">High</option>
          </select>
        </label>
      `;

    case "Shopping":
      return `
        <label for="style" class="stack">
          <span class="label">Style</span>
          <select id="style">
            <option value="">Any</option>
            <option value="Malls">Malls</option>
            <option value="Night Markets">Night Markets</option>
            <option value="Boutiques">Boutiques</option>
            <option value="Souvenirs">Souvenirs</option>
          </select>
        </label>
      `;

    case "Nature":
      return `
        <label for="interests" class="stack">
          <span class="label">Interests</span>
          <select id="interests">
            <option value="">Any</option>
            <option value="Beaches">Beaches</option>
            <option value="Rainforest">Rainforest</option>
            <option value="Highlands">Highlands</option>
            <option value="Wildlife">Wildlife</option>
          </select>
        </label>

        <label for="items" class="stack">
          <span class="label">Gear / Items</span>
          <input id="items" placeholder="e.g., sneakers, hat, sunscreen" />
        </label>
      `;

    default:
      return ``;
  }
}

// ---------- Common fields (clearer wording) ----------
function renderCommonFields() {
  return `
    <!-- When & context -->
    <fieldset class="group">
      <legend>When & context</legend>

    <label class="rowline">
        <input type="checkbox" id="openNowToggle" checked />
        <div>
            <div class="label">Boost places <span class="nowrap">open now</span></div>
            <div class="help">If on, currently-open venues score higher (neutral when hours unknown).</div>
        </div>
    </label>

    <label class="rowline">
        <input type="checkbox" id="allowFarTravel" />
        <div>
            <div class="label">Include far-away regions</div>
            <div class="help">Leave off to keep results in your chosen region (recommended).</div>
        </div>
    </label>

    <label class="rowline">
        <input type="checkbox" id="strictWeather" checked />
        <div>
            <div class="label">Hide things unsuitable for the current weather</div>
            <div class="help">E.g., outdoor hikes won’t show if you set <em>Rainy</em>.</div>
        </div>
    </label>

    <label class="rowline">
        <input type="checkbox" id="strictPreference" />
        <div>
            <div class="label">Only show my indoor/outdoor preference</div>
            <div class="help">Turn off to allow “semi-outdoor” or mixed options.</div>
        </div>
        </label>


    <!-- Basic context selects -->
    <label for="month" class="stack">
      <span class="label">Travel Month</span>
      <select id="month">
        <option value="">Any</option>
        <option>January</option><option>February</option><option>March</option>
        <option>April</option><option>May</option><option>June</option>
        <option>July</option><option>August</option><option>September</option>
        <option>October</option><option>November</option><option>December</option>
      </select>
    </label>

    <label for="preference" class="stack">
      <span class="label">Preference (Outdoor/Indoor)</span>
      <select id="preference">
        <option value="">Any</option>
        <option value="outdoor">Outdoor</option>
        <option value="indoor">Indoor</option>
        <option value="flexible">Flexible</option>
      </select>
    </label>

    <label for="weather" class="stack">
      <span class="label">Current Weather</span>
      <select id="weather">
        <option value="">Any</option>
        <option value="sunny">☀️ Sunny</option>
        <option value="rainy">🌧️ Rainy</option>
        <option value="cloudy">☁️ Cloudy</option>
      </select>
    </label>
  `;
}

// ---------- Normalization ----------
function normalizePrefs(raw){
  const out = { ...raw };

  const userId = out.user_id ?? null;
  delete out.user_id;

  // Keep booleans; clean strings
  for (const k of Object.keys(out)) {
    const v = out[k];
    if (typeof v === "boolean") continue;
    if (v == null) { out[k] = null; continue; }
    const s = String(v).trim();
    if (!s || s.toLowerCase() === "any" || s.toLowerCase().startsWith("select")) out[k] = null;
    else out[k] = s;
  }

  if (out.region) out.region = out.region.toLowerCase();
  if (out.month) out.month = out.month.toLowerCase();
  if (out.weather) out.weather = out.weather.toLowerCase();
  if (out.preference) out.preference = out.preference.toLowerCase();

  // Map Activities select to style if present
  if (out.activities && !out.style) out.style = out.activities;

  // open-now → localTimeISO
  out.localTimeISO = out.openNowToggle ? new Date().toISOString() : null;

  // defaults
  if (typeof out.allowFarTravel !== "boolean") out.allowFarTravel = false;
  if (typeof out.strictWeather !== "boolean") out.strictWeather = true;
  if (typeof out.strictPreference !== "boolean") out.strictPreference = false;

  return { user_id: userId, ...out };
}

// ---------- Submit ----------
function onSubmitQuestionnaire(category) {
  return async function (e) {
    e.preventDefault();
    const form = e.target;

    // Read inputs in THIS form only
    const inputs = form.querySelectorAll("input, select, textarea");
    const prefs = {};
    inputs.forEach(el => {
      if (el.type === "checkbox") prefs[el.id] = !!el.checked;
      else prefs[el.id] = el.value;
    });

    const userId = localStorage.getItem("userId");

    // Base payload from UI + toggles
    const base = {
      user_id: userId ? Number(userId) : null,
      recommendationType: localStorage.getItem("recommendationType") || category,
      allowFarTravel: prefs.allowFarTravel ?? false,
      strictWeather: prefs.strictWeather ?? true,
      strictPreference: prefs.strictPreference ?? false,
      ...prefs
    };

    const normalized = normalizePrefs(base);

    // Save locally for recommendations.html
    localStorage.setItem("userPreferences", JSON.stringify(normalized));

    // Optional: persist to backend (non-blocking)
    try {
      await fetch("http://localhost:3000/api/save-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalized)
      }).catch(()=>{});
    } catch {}

    // Optional: snapshot a plan (if engine present)
    try {
      if (window.generateRecommendations && window.savePlanToLocal) {
        const items = generateRecommendations(normalized);
        savePlanToLocal(normalized, items);
      }
    } catch (err) {
      console.warn("generateRecommendations error:", err);
    }

    closeQuestionnaireModal();
    window.location.href = "recommendations.html";
  };
}

// inside questionnaire.js
function onSubmitQuestionnaire(category) {
  return async function (e) {
    e.preventDefault();
    const form = e.target;

    // gather inputs from THIS form
    const inputs = form.querySelectorAll('input, select, textarea');
    const prefs = {};
    inputs.forEach(el => {
      prefs[el.id] = (el.type === 'checkbox') ? !!el.checked : el.value;
    });

    const userId = localStorage.getItem('userId');

    // base payload
    let base = {
      user_id: userId ? Number(userId) : null,
      recommendationType: localStorage.getItem('recommendationType') || category || '', // << ensure category
      allowFarTravel: prefs.allowFarTravel ?? false,
      strictWeather: prefs.strictWeather ?? true,
      strictPreference: prefs.strictPreference ?? false,
      ...prefs
    };

    // if still missing, default to Food so engine has a category
    if (!base.recommendationType) base.recommendationType = 'Food';

    const normalized = normalizePrefs(base);

    // save for recommendations.html
    localStorage.setItem('userPreferences', JSON.stringify(normalized));

    // (optional) snapshot, ignore errors
    try {
      if (window.generateRecommendations && window.savePlanToLocal) {
        const items = generateRecommendations(normalized);
        savePlanToLocal(normalized, items);
      }
    } catch {}

    // go to results page
    closeQuestionnaireModal();
    window.location.href = 'recommendations.html';
  };
}
