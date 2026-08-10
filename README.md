# Farmeco — The Modern Marketplace for Livestock & Poultry

![Farmeco](https://farmeco.vercel.app/)

**Buy and sell premium cattle, goats, sheep, pigs, poultry and farm essentials with trusted local farms. Verified sellers, health-certified animals, and doorstep delivery.**

> **🌐 Live Application:** [https://farmeco.vercel.app/](https://farmeco.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Live URL](#live-url)
- [Key Features](#key-features)
- [Monorepo Structure](#monorepo-structure)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Run the Backend](#run-the-backend)
  - [Run the Web App](#run-the-web-app)
  - [Run Everything with Docker Compose](#run-everything-with-docker-compose)
- [Seeding the Database](#seeding-the-database)
- [API Reference](#api-reference)
- [Project Roles & Permissions](#project-roles--permissions)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

Farmeco is a full-stack marketplace connecting local farmers and livestock sellers with buyers across Nigeria. It is a monorepo containing a **FastAPI** backend and a **Next.js 16** frontend.

The platform covers the entire commerce lifecycle: user authentication (email + Google OAuth), a browsable product catalog, shopping cart and wishlist, checkout with multiple payment methods, order tracking, seller dashboards, an admin panel with analytics, a blog, coupons, notifications, and more.

The production frontend is hosted on **Vercel** and is available live at:

- **Web App:** https://farmeco.vercel.app/

---

## Live URL

| Environment | URL |
| --- | --- |
| Frontend (Vercel) | https://farmeco.vercel.app/ |

---

## Key Features

### Marketplace
- Catalog of livestock and farm essentials: cattle, goats & sheep, pigs, poultry, feed & supplies.
- Product search, filtering, and category browsing (`/shop`, `/categories`).
- Product badges (featured, best seller, new, organic, sale, certified, top).
- Product reviews and ratings.
- Wishlist management.

### Commerce
- Shopping cart and secure checkout flow.
- Payment methods: **card** (Paystack), **cash on delivery (COD)**, and **bank transfer**.
- Coupons — percentage or fixed-amount discounts.
- Order lifecycle tracking: pending → confirmed → processing → shipped → delivered, with cancellation support.

### Accounts & Roles
- **Buyers** — shop, checkout, manage orders and notifications.
- **Sellers** — publish products, manage their inventory, and fulfil orders.
- **Admins** — full control: users, products, orders, coupons, blog, categories, messages, settings, and audit logs.

### User Experience
- Authentication with credentials (JWT access + refresh tokens) or **Google OAuth**.
- Password reset flow.
- Responsive, modern UI built with shadcn/ui + Tailwind CSS v4, Framer Motion animations, and next-themes dark mode.
- Notifications for messages, orders, payments, and system events.
- Contact form and newsletter subscription.
- Blog with SEO-friendly posts.

### Platform / Back Office
- Audit logging for sensitive operations.
- Bulk product import.
- Cloudinary media uploads.
- Site settings and shipping configuration.
- API docs auto-generated (Swagger / OpenAPI).

---

## Monorepo Structure

```
farmeco/
├── backend/               # FastAPI REST API (Python)
│   ├── alembic/           # Database migrations
│   ├── app/
│   │   ├── api/           # Route definitions (v1)
│   │   ├── core/          # Config, exceptions, security
│   │   ├── models/        # SQLAlchemy ORM models
│   │   ├── repositories/  # Data-access layer
│   │   ├── schemas/       # Pydantic request/response schemas
│   │   ├── services/      # Business logic
│   │   └── main.py        # FastAPI app factory
│   ├── requirements.txt
│   ├── seed.py            # Database seed script
│   └── Dockerfile
├── web/                   # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages (public, auth, account, seller, admin)
│   │   ├── components/    # Reusable UI components (shadcn/ui)
│   │   ├── config/        # Site & dashboard configuration
│   │   ├── constants/
│   │   ├── features/      # Feature-specific components/logic
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout components
│   │   ├── lib/           # Utility libraries
│   │   ├── mock/          # Mock data
│   │   ├── providers/     # React providers (React Query, theme, etc.)
│   │   ├── schemas/       # Zod validation schemas
│   │   ├── services/      # API client & server interactions
│   │   ├── store/         # Zustand state stores
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helper functions
│   ├── public/
│   ├── Dockerfile
│   └── vercel.json
├── docker-compose.yml     # Local orchestration (web + backend)
├── package.json           # Root convenience scripts
└── README.md
```

---

## Technology Stack

### Backend
- **FastAPI** — high-performance async Python web framework
- **SQLAlchemy 2.0** + **psycopg** — ORM and Postgres driver
- **Alembic** — database migrations
- **Pydantic v2** — data validation & settings management
- **PyJWT** — access/refresh token auth
- **pwdlib[argon2]** — password hashing
- **Cloudinary** — image/media uploads
- **Resend / fastapi-mail** — transactional email
- **google-auth** — Google OAuth verification
- **openpyxl** — bulk Excel imports

### Frontend
- **Next.js 16** (App Router, TypeScript)
- **React 19**
- **Tailwind CSS v4** + **shadcn/ui**
- **TanStack React Query** — server-state management
- **Zustand** — client-state management
- **react-hook-form** + **Zod** — form validation
- **Framer Motion** — animations
- **Swiper / Embla Carousel** — carousels
- **Sonner** — toast notifications
- **lucide-react** — icons

### Infrastructure
- **PostgreSQL** (Supabase-hosted in production)
- **Docker & Docker Compose** for local development
- **Vercel** for the web deployment
- **Bun** — package manager & build tooling

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/) (or [Bun](https://bun.sh/))
- [Python 3.12+](https://www.python.org/)
- [Docker](https://www.docker.com/) & Docker Compose (optional, for containerized dev)
- A **PostgreSQL** database (local or hosted)

### Environment Variables

Create a `.env` file in both `backend/` and `web/`. See `.env.example`-style keys below.

**Backend (`backend/.env`):**

```env
# Database
DATABASE_URL=postgresql+psycopg://user:password@host:5432/farmeco

# Security
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxx
PAYSTACK_PUBLIC_KEY=pk_test_xxx

# Email (SMTP)
MAIL_USERNAME=your-smtp-username
MAIL_PASSWORD=your-smtp-password
MAIL_PORT=587
MAIL_SERVER=smtp.example.com
MAIL_FROM_NAME=Farmeco
MAIL_STARTTLS=true
MAIL_SSL_TLS=false

# Resend
RESEND_API_KEY=re_xxx
MAIL_FROM=Farmeco <onboarding@resend.dev>

# Frontend
FRONTEND_URL=https://farmeco.vercel.app
```

**Frontend (`web/.env`):**

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_SITE_URL=https://farmeco.vercel.app
```

> **Note:** `NEXT_PUBLIC_API_URL` points to the backend base URL. When running against the deployed API, set it to your production backend URL.

### Run the Backend

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

alembic upgrade head            # apply migrations
uvicorn app.main:app --reload   # start dev server on :8000
```

API docs will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### Run the Web App

```bash
cd web
bun install        # or npm install
bun run dev        # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Everything with Docker Compose

```bash
docker compose up --build
```

This builds and starts:

- `web` → http://localhost:3000
- `backend` → http://localhost:8000

> The local Postgres service is commented out by default — the project uses Supabase in production. Uncomment the `db` service in `docker-compose.yml` if you want a local database.

---

## Seeding the Database

The backend ships a seed script to populate the database with demo data:

```bash
cd backend
python seed.py
```

This creates initial users (buyer/seller/admin), categories, products, and other reference data so you can explore the platform immediately.

---

## API Reference

The REST API is versioned under `/api/v1` and auto-documented via OpenAPI/Swagger at `http://localhost:8000/docs`.

| Prefix | Description |
| --- | --- |
| `/api/v1/auth` | Registration, login, refresh, Google OAuth, password reset |
| `/api/v1/users` | User management & roles |
| `/api/v1/account` | Authenticated user's own account actions |
| `/api/v1/categories` | Product categories |
| `/api/v1/products` | Product catalog, search, badges |
| `/api/v1/orders` | Order creation & lifecycle |
| `/api/v1/coupons` | Discount coupon management |
| `/api/v1/reviews` | Product reviews & ratings |
| `/api/v1/uploads` | Cloudinary media uploads |
| `/api/v1/blog` | Blog posts |
| `/api/v1/bulk` | Bulk product import |
| `/api/v1/contact` | Contact messages |
| `/api/v1/settings` | Site & shipping settings |
| `/api/v1/audit-logs` | Admin audit trail |
| `/api/v1/notifications` | User notifications |
| `/api/v1/payments` | Paystack / payment flow |

---

## Project Roles & Permissions

| Role | Capabilities |
| --- | --- |
| **Buyer** | Browse catalog, add to cart/wishlist, checkout, manage own orders, reviews, notifications |
| **Seller** | Publish & manage own products, fulfil orders, seller dashboard |
| **Admin** | Manage everything: users, products, orders, coupons, blog, categories, contact messages, settings, audit logs |

---

## Deployment

### Frontend (Vercel)

The web app is deployed to Vercel. Set the following environment variables in your Vercel project:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SITE_URL`

Deploy using the Vercel dashboard or CLI:

```bash
vercel --prod
```

**Live:** [https://farmeco.vercel.app/](https://farmeco.vercel.app/)

### Backend

The FastAPI backend can be deployed to any container platform (Render, Railway, Fly.io, etc.) using the provided `Dockerfile`:

```bash
docker build -t farmeco-backend ./backend
docker run -p 8000:8000 --env-file backend/.env farmeco-backend
```

The container runs `alembic upgrade head` automatically on startup.

---

## Roadmap

- [ ] Real-time chat between buyers and sellers
- [ ] Delivery logistics & tracking integration
- [ ] Multi-vendor analytics and reporting
- [ ] Mobile application
- [ ] Enhanced marketplace search (full-text)
- [ ] Multi-language & multi-currency support

---

## License

This project is private and not yet licensed for public distribution.

---

**Farmeco — the modern marketplace for livestock & poultry.**  
🌐 [https://farmeco.vercel.app/](https://farmeco.vercel.app/)
