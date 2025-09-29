// backend/server.js
'use strict';

require('dotenv').config();              // reads .env from project root (run from root)
const path = require('path');
const express = require('express');
const cors = require('cors');

const app = express();

// --- DB (keep the existing connection) ---
const db = require('./db'); // assumes backend/db.js exists

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Static frontend (serve files in project root) ---
app.use(express.static(path.join(__dirname, '..')));

// --- Your existing API routes ---
const userRoutes = require('./routes/users');
const savePreferencesRoute = require('./routes/savePreferences');
const recommendationRoutes = require('./routes/recommendation');
const contactRoutes = require('./routes/contact');

app.use('/api', userRoutes);
app.use('/api', savePreferencesRoute);
app.use('/api', recommendationRoutes);
app.use('/api', contactRoutes);

// --- AI assistant route (LLM-backed JSON extractor) ---
app.post('/api/assistant', async (req, res) => {
  try {
    const { message = '', history = [] } = req.body || {};
    const SYSTEM = `
You are "Go Malaysia Assistant". Extract the user's travel intent as STRICT JSON:
{
  "recommendationType": "Food | Shopping | Activities | Nature | Location | null",
  "region": "Klang Valley | Penang | Melaka | Ipoh | Putrajaya | Pahang | Langkawi | null",
  "month": "january..december | null",
  "weather": "rainy | cloudy | sunny | null",
  "preference": "Indoor | Outdoor | Flexible | null",
  "budget": "Budget | Mid-range | Premium | null",
  "interests": "Highlands | Beaches | Rainforest | Night Markets | null"
}
Always return ONLY JSON. Use null for unknown.
`.trim();

    const payload = {
      model: process.env.AI_MODEL || 'gpt-4o-mini',
      temperature: 0,
      messages: [
        { role: 'system', content: SYSTEM },
        ...history,
        { role: 'user', content: message }
      ]
    };

    // Node 18+ has global fetch; I am on v22 so this is fine.
    const resp = await fetch(process.env.AI_BASE_URL || 'https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(500).json({ ok: false, error: `LLM error: ${text}` });
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content?.trim() || '{}';

    let prefs = null;
    try { prefs = JSON.parse(text); } catch (_) { prefs = null; }

    // Only return allowed keys; normalize null/empty → null
    const clean = (x) => (x == null || x === '') ? null : String(x);
    const allowed = ['recommendationType','region','month','weather','preference','budget','interests'];
    const out = {};
    if (prefs && typeof prefs === 'object') {
      for (const k of allowed) out[k] = clean(prefs[k]);
    }

    res.json({ ok: true, prefs: out });
  } catch (e) {
    console.error('assistant error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log('   Static files from:', path.join(__dirname, '..'));
});
