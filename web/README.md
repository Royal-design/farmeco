# Farmeco Web — Frontend

![Farmeco](https://farmeco.vercel.app/)

The **Farmeco** web application — a modern marketplace for livestock & poultry, built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**.

> **🌐 Live Application:** [https://farmeco.vercel.app/](https://farmeco.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Live URL](#live-url)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Page Map](#page-map)
- [State & Data Fetching](#state--data-fetching)
- [Design System](#design-system)
- [Deployment](#deployment)
- [API Integration](#api-integration)

---

## Overview

The Farmeco frontend is a fully-featured e-commerce experience for livestock and farm essentials. Buyers can browse the marketplace, manage carts and wishlists, check out, track orders, write reviews, and subscribe to the blog. Sellers get a dedicated dashboard for their products and orders, and administrators have a complete back office covering users, products, orders, coupons, blog, messages, settings, and audit logs.

The app is deployed to **Vercel**:

- **Live URL:** https://farmeco.vercel.app/

---

## Live URL

| Environment | URL |
| --- | --- |
| Production (Vercel) | https://farmeco.vercel.app/ |
| Local dev server | http://localhost:3000 |

---

## Features

- **Marketplace browsing** — product grid, filters, category pages, and search.
- **Product detail pages** with reviews, ratings, and badges (featured, best-seller, new, organic, sale, certified, top).
- **Shopping cart & wishlist** — persistent client state via Zustand.
- **Checkout** — card (Paystack), cash on delivery, and bank transfer.
- **Order tracking** across the full lifecycle (pending → confirmed → processing → shipped → delivered).
- **Authentication** — email/password with JWT refresh tokens, Google OAuth, and password reset flows.
- **Role-based areas:**
  - `/account` — buyer profile, orders, notifications, settings
  - `/seller` — product and order management for sellers
  - `/admin` — full back office with analytics dashboard, audit logs, and settings
- **Blog** — SEO-friendly content with sitemap and robots rules.
- **Contact & newsletter** — contact form, FAQ, privacy, and terms pages.
- **Dark mode** — theme switching via `next-themes`.
- **Smooth animations** — Framer Motion for page and component transitions.
- **Toast notifications** — Sonner for real-time user feedback.
- **Form validation** — react-hook-form + Zod across all forms.

---

## Tech Stack

| Category | Library |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui, CVA, tailwind-merge, tw-animate-css |
| Server state | TanStack React Query 5 (+ Devtools) |
| Client state | Zustand |
| Forms | react-hook-form, Zod, @hookform/resolvers |
| Animation | Framer Motion |
| Carousels | Swiper, Embla Carousel |
| Notifications | Sonner |
| Icons | lucide-react |
| HTTP | Axios |
| Dates | date-fns |
| Theme | next-themes |
| Package manager | Bun |

---

## Project Structure

```
web/
├── public/                  # Static assets (favicons, images, og)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # login, register, forgot/reset password
│   │   ├── (public)/        # home, shop, categories, blog, contact, cart, etc.
│   │   ├── account/         # buyer dashboard
│   │   ├── seller/          # seller dashboard
│   │   └── admin/           # admin back office
│   ├── components/          # Reusable UI components (shadcn/ui primitives)
│   ├── config/              # Site config, dashboard config
│   ├── constants/           # Shared constants
│   ├── features/            # Feature-scoped components & logic
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Shared layout components
│   ├── lib/                 # Utilities (API client, helpers)
│   ├── mock/                # Mock data for offline development
│   ├── providers/           # React Query, Theme, etc.
│   ├── schemas/             # Zod schemas
│   ├── services/            # Server interactions & API functions
│   ├── store/               # Zustand stores (cart, wishlist, auth, ui)
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Helper functions
├── components.json          # shadcn/ui configuration
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── vercel.json              # Vercel deployment configuration
├── Dockerfile               # Multi-stage production build
├── bun.lock
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+ or [Bun](https://bun.sh/)
- A running Farmeco backend (see the [root README](../README.md))

### Install & Run

```bash
bun install          # or npm install
bun run dev          # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create a `.env` file in the `web/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=https://farmeco.vercel.app
```

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the Farmeco backend API (must include `/api/v1`). |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL used for SEO (sitemap, robots, og tags). |

---

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| Dev | `bun run dev` / `npm run dev` | Start the development server with hot reload. |
| Build | `bun run build` / `npm run build` | Create an optimized production build. |
| Start | `bun run start` / `npm run start` | Serve the production build. |
| Lint | `bun run lint` | Run ESLint across the codebase. |
| Format | `bun run format` | Auto-format TypeScript/TSX files with Prettier. |
| Typecheck | `bun run typecheck` | Run `tsc --noEmit` for type checking. |

You can also use the root-level scripts from the monorepo root:

```bash
npm run dev          # runs web dev server
npm run build        # builds the web app
npm run lint
npm run typecheck
```

---

## Page Map

### Public
| Route | Description |
| --- | --- |
| `/` | Home page |
| `/shop` | Marketplace catalog with filters |
| `/shop/:slug` | Product detail page |
| `/categories` | Browse by category (cattle, goats & sheep, pigs, poultry, supplies) |
| `/cart` | Shopping cart |
| `/checkout` | Checkout flow |
| `/wishlist` | Saved products |
| `/blog` | Blog listing & posts |
| `/about` | About page |
| `/contact` | Contact form |
| `/faq` | Frequently asked questions |
| `/privacy` | Privacy policy |
| `/terms` | Terms & conditions |

### Auth
| Route | Description |
| --- | --- |
| `/login` | Sign in (credentials or Google) |
| `/register` | Create an account |
| `/forgot-password` | Request password reset |
| `/reset-password` | Complete password reset |

### Account (Buyer)
| Route | Description |
| --- | --- |
| `/account` | Dashboard / profile overview |
| `/account/orders` | Order history |
| `/account/notifications` | Notifications |
| `/account/messages` | Messages |
| `/account/settings` | Account settings |
| `/account/profile` | Edit profile |

### Seller
| Route | Description |
| --- | --- |
| `/seller` | Seller dashboard |
| `/seller/products` | Manage products |
| `/seller/orders` | Fulfil orders |
| `/seller/messages` | Buyer conversations |

### Admin
| Route | Description |
| --- | --- |
| `/admin` | Analytics & overview |
| `/admin/products` | Manage all products |
| `/admin/categories` | Manage categories |
| `/admin/coupons` | Manage coupons |
| `/admin/orders` | Manage all orders |
| `/admin/users` | Manage users |
| `/admin/blog` | Manage blog posts |
| `/admin/messages` | Contact messages |
| `/admin/audit-log` | Audit trail |
| `/admin/settings` | Site & shipping settings |

---

## State & Data Fetching

- **Server state:** TanStack React Query handles all API data fetching, caching, and invalidation. Hooks are organized under `src/services` and `src/features`.
- **Client state:** Zustand stores in `src/store` manage UI state that doesn't belong on the server — cart, wishlist, theme, and UI toggles.
- **Forms:** react-hook-form with Zod schemas (`src/schemas`) gives end-to-end typed validation.

---

## Design System

- Built on **shadcn/ui** primitives (see `components.json`) with Tailwind CSS v4 theming.
- **Class variance authority** (CVA) + `tailwind-merge` power the design tokens and component variants.
- **tw-animate-css** adds animation utilities used across the app.
- Dark mode via `next-themes` with class-based switching.
- Components live in `src/components` (primitives) and `src/features` (feature-specific composites).

---

## Deployment

### Vercel (Production)

The app deploys to Vercel with the configuration in `vercel.json`:

- Framework preset: **Next.js**
- Build command: `next build`
- Region: `iad1`
- Includes redirects for legacy `/index.html` and `/shop/product/:slug` URLs.

1. Push the `web/` directory to a Vercel project (or use the monorepo root with the Vercel framework auto-detection).
2. Add the environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`).
3. Deploy:

```bash
vercel --prod
```

**Live:** https://farmeco.vercel.app/

### Docker

A multi-stage `Dockerfile` is included for containerized deployments:

```bash
docker build -t farmeco-web .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 farmeco-web
```

Set `NEXT_PUBLIC_API_URL` as a build argument when building for a specific backend:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com/api/v1 -t farmeco-web .
```

---

## API Integration

The frontend talks to the Farmeco backend through the base URL defined by `NEXT_PUBLIC_API_URL`. The API is versioned at `/api/v1` and includes endpoints for auth, users, products, orders, coupons, reviews, blog, notifications, payments, and more. See the [root README](../README.md#api-reference) for the full API map and the backend Swagger docs at `/docs`.

---

**Farmeco — the modern marketplace for livestock & poultry.**  
🌐 [https://farmeco.vercel.app/](https://farmeco.vercel.app/)
