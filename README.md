# PITTY FIT — Fitness E-commerce

A full-stack fitness apparel e-commerce site built with **Django REST Framework** and **React + Vite + Tailwind CSS**.

## Features

- Landing page matching the PITTY FIT brand design
- Product catalog with category filtering
- Shopping cart (guest + authenticated)
- User registration and login (JWT)
- Checkout with Stripe (demo mode without API keys)
- Order history
- Newsletter signup
- About, Journal, and Contact pages

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 5, DRF, SimpleJWT, Stripe |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Database | SQLite (dev) |

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```

The API runs at `http://localhost:8000/api/`.

Optional: copy `.env.example` to `.env` and add Stripe keys for live checkout.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The site runs at `http://localhost:5173/`.

Optional: copy `.env.example` to `.env` and set `VITE_API_URL` and `VITE_STRIPE_PUBLIC_KEY`.

### Admin Panel

```bash
cd backend
python manage.py createsuperuser
```

Visit `http://localhost:8000/admin/` to manage products, categories, testimonials, and orders.

## Project Structure

```
the_pitty_fit/
├── backend/          # Django REST API
│   ├── config/       # Settings and URL routing
│   └── apps/         # products, cart, orders, accounts, reviews, newsletter
├── frontend/         # React SPA
│   └── src/
│       ├── api/      # API client and types
│       ├── components/
│       ├── context/  # Auth and Cart providers
│       └── pages/
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories/` | List categories |
| GET | `/api/products/` | List products (filter by `?category=slug`) |
| GET | `/api/products/:slug/` | Product detail |
| GET | `/api/cart/` | Current cart |
| POST | `/api/cart/add/` | Add item to cart |
| POST | `/api/auth/register/` | Register user |
| POST | `/api/auth/login/` | Login (JWT) |
| POST | `/api/orders/create-checkout/` | Create checkout session |
| GET | `/api/testimonials/` | Featured testimonials |
| POST | `/api/newsletter/subscribe/` | Newsletter signup |

## Demo Mode

Without Stripe API keys configured, checkout runs in **demo mode** — orders are created and marked as paid without redirecting to Stripe.
