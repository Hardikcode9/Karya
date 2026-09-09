# Karya — rural gig & local services platform

A multilingual, offline-first frontend for Karya, built with React, Vite, Tailwind CSS,
Framer Motion, React Router, i18next and IndexedDB.

## What's implemented

**Fully working**
- Design system: Tailwind tokens for the olive/clay/cream palette, Fraunces + Manrope type
- Full routing for every page in the spec (public site, worker/SHG profiles, 4 dashboards)
- Home page: hero, animated stats, about, services, live service search, an actual
  weighted smart-matching engine (`src/utils/matching.js`) with animated visualization,
  how-it-works, offline-first explainer, multilingual/voice demo, SHG ecosystem, impact,
  testimonials carousel
- Floating responsive navbar with animated mobile drawer + language switcher (i18next)
- Offline architecture: `OfflineContext` queues actions in IndexedDB (via `idb`) and syncs
  when back online; a live offline/online indicator; a cache-first service worker
- Worker, SHG, service, work and resource detail pages
- Contact form, role-aware login/register forms
- Four dashboards (Customer/Worker/SHG/Admin) with sidebar nav, live overview pages
  (stats, a bar chart, tables), and clean placeholder states for deeper sub-pages
- PWA manifest + service worker registration + install-ready icons

**Intentionally stubbed for later**
- 5 of 7 languages only have nav labels translated (falls back to English elsewhere —
  add more keys to `src/i18n/locales/*.json` any time, no code changes needed)
- Dashboard sub-pages beyond "Overview" show a clean empty state rather than full CRUD
- No backend: auth, payments and the sync queue are all local-only, structured so a
  real API can be dropped in without touching component code
- Images are pulled live from Unsplash by keyword (`ImageTile` component) — swap for
  real photography before shipping

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build      # production build -> dist/
npm run preview    # preview the production build
```

## Where things live

```
src/
  components/
    ui/          reusable primitives (Button, Badge, ServiceCard, StatCard, ...)
    layout/      Navbar, Footer, DashboardLayout, OfflineIndicator, LoadingScreen
    sections/    homepage sections (Hero, SmartMatchingSection, ...)
  pages/         one file per route, plus pages/dashboards/ for the 4 role dashboards
  context/       LanguageContext, OfflineContext, AuthContext
  data/          mockData.js -- swap for real API responses later
  utils/         matching.js (the ranking algorithm), iconMap.js
  i18n/          i18next setup + locales/*.json
public/
  manifest.json, sw.js, icons/   PWA assets
```
