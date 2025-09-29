// storage.js — single-itinerary version
(function () {
  window.GM = window.GM || {};

  // Keys
  GM.KEYS = {
    SELECTED: 'gm_selected_items', // temp selection on results page
    ITI: 'gm_itinerary',           // single itinerary (overwrite on save)
    LEGACY_ITIS: 'gm_itineraries', // old multi-itinerary list (for migration)
  };

  // Basic load/save
  GM.load = function (key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : (fallback === undefined ? null : fallback);
    } catch {
      return (fallback === undefined ? null : fallback);
    }
  };
  GM.save = function (key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // --- Single Itinerary API ---
  GM.getItinerary = function () {
    // Migrate once from legacy multi-itinerary (keep the first)
    const legacy = GM.load(GM.KEYS.LEGACY_ITIS, null);
    if (legacy && Array.isArray(legacy) && legacy.length) {
      const first = legacy[0];
      const items = (first.items || []).map((x, i) => ({ ...x, position: i + 1 }));
      const payload = {
        name: first.name || 'My Itinerary',
        items,
        updatedAt: new Date().toISOString(),
      };
      GM.save(GM.KEYS.ITI, payload);
      localStorage.removeItem(GM.KEYS.LEGACY_ITIS);
      return payload;
    }
    return GM.load(GM.KEYS.ITI, { name: 'My Itinerary', items: [] });
  };

  GM.saveItinerary = function (items, name) {
    const payload = {
      name: (name && String(name).trim()) || 'My Itinerary',
      items: (items || []).map((x, i) => ({ ...x, position: i + 1 })),
      updatedAt: new Date().toISOString(),
    };
    GM.save(GM.KEYS.ITI, payload);
    return payload;
  };

  GM.clearItinerary = function () {
    localStorage.removeItem(GM.KEYS.ITI);
  };

  GM.updateItinerary = function (mutatorFn) {
    const iti = GM.getItinerary();
    const next = mutatorFn(iti) || iti;
    GM.save(GM.KEYS.ITI, next);
    return next;
  };
})();
