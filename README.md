# DamuLink — Frontend

A Kenyan blood and organ donor platform connecting donors, hospitals, and recipients in real time. This is the web frontend: a multi-portal React application built on a dark "ruby-night" design system.

## Tech Stack

- **React** + **Vite**
- **Tailwind CSS v4**
- **React Router** — multi-portal routing (donor / hospital)
- **Axios / Fetch** — API client layer against the DamuLink Django REST backend
- **JWT** — auth tokens, persisted client-side

## Features

- **Donor Portal** — registration, eligibility checks, donation history, gamification (badges/points), notifications
- **Hospital Portal** — blood/organ requests, donor matching, inventory dashboards, verification workflows
- **Auth** — login/register/OTP flows, protected routes by role
- **USSD/SMS-aware UX** — surfaces statuses for users who interact via Africa's Talking USSD/SMS channels
- **Payments** — M-Pesa Daraja and Stripe flows for relevant transactions
- **Dark ruby-night design system** — consistent theming across both portals

## Project Structure

```
damulink-frontend/
├── src/
│   ├── assets/
│   ├── components/        # Shared UI components
│   ├── portals/
│   │   ├── donor/         # Donor portal pages & components
│   │   └── hospital/      # Hospital portal pages & components
│   ├── context/           # Auth & global context providers
│   ├── api/                # API client modules (per backend app: donors, hospitals, matching, etc.)
│   ├── hooks/
│   ├── styles/             # Tailwind v4 theme/tokens
│   ├── routes/             # Route definitions per portal
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

> Adjust this tree to match your actual folder layout if it's diverged.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Running DamuLink backend (Django REST API) — see backend repo for setup

### Installation

```bash
git clone <repo-url>
cd damulink-frontend
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=DamuLink
```

Add any additional keys your backend requires on the client (e.g. public Stripe key).

### Run Dev Server

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

### Build for Production

```bash
npm run build
npm run preview
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run linter |

## Design System

The UI follows a dark "ruby-night" theme defined via Tailwind v4's `@theme` block:

- Background: deep near-black/charcoal tones
- Accent: ruby/red tones (blood-donation thematic, used sparingly for CTAs/status)
- Typography: clean sans-serif, high contrast for accessibility
- Components are shared between donor and hospital portals where possible, with portal-specific variants where UX diverges (e.g. hospital dashboards are denser/data-heavy)

> Tailwind v4 note: theme tokens live in `@theme` blocks in CSS, not `tailwind.config.js` `theme.extend`. Avoid mixing v3-style config patterns into v4.

## API Integration

The frontend talks to the Django REST backend across these resource areas:

- `accounts` — auth, registration
- `donors` — donor profiles, eligibility, donation history
- `hospitals` — hospital profiles, requests
- `matching` — donor-recipient matching
- `gamification` — badges, points, leaderboards
- `payments` — M-Pesa / Stripe
- `notifications` — alerts
- `verification` — identity verification (Smile Identity)
- `ussd` — USSD-related status surfacing

Auth tokens are attached via request interceptors; unauthenticated requests redirect to login.

## Contributing

- Branch naming: `ft-<feature>` (feature), `fx-<fix>` (bugfix)
- Open PRs against `main` / `dev` (confirm with team convention)
- Run `npm run lint` before pushing

## License

Internal/proprietary — update if you intend to open-source.
