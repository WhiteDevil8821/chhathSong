# ChhathSong.in — लोक आस्था का महापर्व छठ (Chhath: The Pride of Bihar)

[![Website](https://img.shields.io/badge/Website-chhathsong.in-D4AF37?style=flat-square)](https://www.chhathsong.in/)
[![Built with React + TypeScript](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=flat-square)](#-contributing)

**ChhathSong.in** is an open-source cultural and devotional web archive dedicated to **Chhath Mahaparv** — the ancient Vedic festival of Sun worship celebrated across Bihar, Mithila, Magadh, Anga, Jharkhand, Purvanchal, and the global diaspora.

This project brings together timeless Chhath folk songs (*Chhath Geet*), full Devanagari lyrics and spiritual meanings, bilingual Hindi/English festival guides, an IST-synchronized daily greeting & countdown system, and an interactive river ghat Arghya experience.

---

## Features

- **106+ Curated Chhath Songs & Lyrics**: Timeless folk classics by Padma Bhushan Sharda Sinha, Anuradha Paudwal, Kalpana Patowary, Pawan Singh, Khesari Lal Yadav, Devi, and traditional regional artists, complete with Devanagari lyrics, spiritual meanings, and ritual context.
- **IST-Synchronized Daily Greetings & Countdown (`Asia/Kolkata`)**: Automatically counts down to the upcoming festival (**Chaiti Chhath 2027: 10–13 April 2027**) and switches daily wishes at **00:00 AM IST** across all four sacred days (*Nahay-Khay*, *Lohanda & Kharna*, *Sandhya Arghya*, and *Usha Arghya & Paran*).
- **Bilingual Experience (हिंदी / English)**: Instant language toggle across UI, hero cards, ritual timelines, and cultural guides.
- **Interactive Ganga Ghat & Virtual Arghya**: Ambient ghat scene, ritual artifact showcase (*Daura, Soop, Thekua, Ikh*), and interactive Arghya offering with sacred mantras.
- **Devotee Community Features**: Live devotees presence indicator and nostalgic Chhath memories board powered by Firebase/Firestore.
- **SEO & Pre-Rendered Static Routes**: Automatic favicon generation, XML sitemap (`scripts/generate-sitemap.ts`), JSON-LD structured data (`MusicRecording`, `MusicPlaylist`, `FAQPage`, `BreadcrumbList`), and static HTML pre-rendering (`scripts/prerender.ts`) for `/`, `/songs`, and individual `/songs/<slug>` pages.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React
- **Backend / SSR & API**: Express, Vite middleware (`server.ts`), compression
- **Persistence / Realtime**: Firebase / Firestore
- **Tooling & Build Pipeline**: Vite 6, `tsx`, `esbuild`, `@resvg/resvg-js`, `png-to-ico`

---

## Project Structure

```text
.
├── public/                     # Static assets, manifest, robots.txt, llms.txt, images
├── scripts/
│   ├── generate-favicons.mjs   # Generates PNG & ICO favicons from SVG
│   ├── generate-sitemap.ts     # Builds public/sitemap.xml for all canonical URLs
│   ├── prerender.ts            # Pre-renders /, /songs, 404, and all /songs/<slug> pages
│   └── ...                     # Lyrics & metadata enrichment helpers
├── src/
│   ├── components/             # UI components (Hero, Music Player, Directory, Modals, Guides)
│   ├── context/                # LanguageContext (Hindi / English state)
│   ├── data/                   # chhathData.ts (106 curated songs, sacred days, artifacts)
│   ├── hooks/                  # Custom hooks (useChhathDailyGreeting, etc.)
│   ├── lib/                    # Firebase & utility libraries
│   ├── server/                 # seoRenderer.ts (meta tags, JSON-LD, pre-rendered HTML)
│   ├── utils/                  # chhathDaySchedule.ts, songSlug.ts, translations.ts, audio synth
│   ├── App.tsx                 # Main application router and layout
│   └── types.ts                # Shared TypeScript interfaces
├── index.html                  # Base HTML entry point & SEO defaults
├── server.ts                   # Express server + Vite dev integration + SEO route handlers
├── vercel.json                 # Vercel static hosting & cache headers config
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** `>= 18.x` (Node 20 LTS recommended)
- **npm** (or Bun)

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install
```

### 2. Environment Variables (Optional)

Copy `.env.example` to `.env` if you are configuring optional environment values:

```bash
cp .env.example .env
```

> **Note:** Never commit `.env` files, API keys, or private credentials.

### 3. Run Locally

Start the development server (runs Express + Vite on port `3000`):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Type Check & Production Build

Verify TypeScript types:

```bash
npm run lint
```

Run the full production build (generates favicons, updates `sitemap.xml`, builds Vite client assets, pre-renders all static HTML pages into `dist/`, and bundles `dist/server.cjs`):

```bash
npm run build
```

Serve the production build locally:

```bash
npm start
```

---

## Contributing

We warmly welcome contributors! Whether you love Bihar & Purvanchal folk music, Hindi/Bhojpuri/Maithili literature, frontend engineering, accessibility, or SEO, there are many meaningful ways to help preserve and grow this cultural archive.

### Ways You Can Contribute

1. **Add or Verify Song Lyrics (`src/data/chhathData.ts`)**
   - Proofread existing Devanagari lyrics for regional accuracy (Bhojpuri, Maithili, Magahi, Angika).
   - Add missing full lyrics, cultural context, or Hindi/English meanings (`meaning`, `culturalContext`, `whenSung`).
2. **Add Traditional Chhath Songs**
   - Suggest authentic folk songs or add new entries while ensuring accurate singer attribution and unique slugs.
3. **Update Annual Festival Schedules (`src/utils/chhathDaySchedule.ts` & `src/data/chhathData.ts`)**
   - Help keep upcoming Chaiti Chhath & Kartik Chhath *Panchang* dates and *Arghya* timings accurate year after year.
4. **UI, Accessibility & Performance**
   - Improve keyboard navigation, screen-reader support, mobile responsiveness, or bundle splitting.
5. **Bug Reports & Feature Ideas**
   - Open an issue with clear steps to reproduce, screenshots, or your proposed enhancement.

### Contribution Workflow

1. **Fork** the repository and create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Make your changes** clearly and cleanly. Follow existing TypeScript types and formatting conventions.
3. **Avoid breaking canonical song URLs**: Changing a song's title or ID changes its slug (`src/utils/songSlug.ts`), which affects indexed URLs and sitemap entries. If you add new songs, check that generated slugs are unique.
4. **Verify before opening a PR**:
   ```bash
   npm run lint
   npm run build
   ```
5. **Open a Pull Request** describing what you changed, why, and screenshots for any UI updates.

---

## Community & Support

- **Live Portal**: [https://www.chhathsong.in](https://www.chhathsong.in)
- **Maintainer**: Ankit Kumar ([ankit.kumar221099@gmail.com](mailto:ankit.kumar221099@gmail.com))

If this project helps you stay connected to your roots or brings Chhath melodies to your home, please consider starring the repository and sharing it with others.

**जय छठी मैया!**
