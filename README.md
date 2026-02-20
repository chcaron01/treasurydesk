# Treasury Desk

A full-stack web application for viewing US Treasury yield data and placing simulated treasury purchase orders. Yield data is sourced in real time from the [FRED API](https://fred.stlouisfed.org/) (Federal Reserve Bank of St. Louis).

---

## What it does

- Displays a live **yield curve snapshot** across all 11 standard treasury terms (1M → 30Y)
- Renders an **interactive historical yield chart** for any selected term, with configurable time ranges (1Y, 5Y, 10Y, or a custom date range)
- Lets users **place simulated purchase orders**, locking in the current yield for a chosen term and principal amount
- Shows an **order history table** of all previously placed orders

---

## Architecture

```
treasury_yields/
├── api/          Go REST API (Gin + Huma)
│   ├── db/       Postgres Database initialization and connection
│   ├── gateway/  FRED API client
│   ├── handler/  HTTP handlers, route registration, request/response models
│   └── migrations/  PostgreSQL schema
└── ui/           React frontend (Vite + TypeScript + Tailwind)
    └── src/
        ├── api/        Fetch functions and TanStack Query hooks
        ├── components/ UI components
        ├── types/      Shared TypeScript types
        └── utils/      Date, format and chart utilities
```

### API (`api/`)

| File / Package | Purpose |
|---|---|
| `main.go` | Entry point — wires Gin, CORS middleware, Huma, and routes |
| `db/` | Opens the PostgreSQL connection via `DATABASE_URL` |
| `gateway/fred_gateway.go` | Fetches latest and historical observations from the FRED API |
| `handler/routes.go` | Registers all four HTTP operations with Huma |
| `handler/yields.go` | `GET /yields` and `GET /yields/history` handlers |
| `handler/orders.go` | `GET /orders` and `POST /orders` handlers |
| `handler/models.go` | Request/response structs shared across handlers |
| `migrations/` | SQL schema run automatically by the Postgres Docker image on first start |

### UI (`ui/src/`)

| Component | Purpose |
|---|---|
| `App.tsx` | Root layout — composes the header, chart, order form, and order history |
| `components/Header.tsx` | Top navigation bar with brand name and current date/time |
| `components/YieldCurve/` | Area chart showing historical yields for a selected term |
| `components/YieldCurve/YieldCurveHeader.tsx` | Displays the selected term, current yield, and loading state above the chart |
| `components/YieldCurve/SeriesSelector.tsx` | Pill buttons for selecting which treasury term to chart |
| `components/YieldCurve/TimeRangeSelector.tsx` | Preset (1Y / 5Y / 10Y) and custom date range picker |
| `components/YieldCurve/DateRangePicker.tsx` | Start/end date inputs used by `TimeRangeSelector` |
| `components/OrderForm.tsx` | Term selector, yield preview, amount input, and submit button for placing orders |
| `components/OrderHistory.tsx` | Table of all placed orders with term, yield, amount, and timestamp |
| `api/useYields.ts` | TanStack Query hook — fetches the current yield curve snapshot |
| `api/useYieldHistory.ts` | TanStack Query hook — fetches historical data for a given term and date range |
| `api/useOrders.ts` | TanStack Query hooks — fetches order list and exposes a `useSubmitOrder` mutation |

---

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- A free [FRED API key](https://fred.stlouisfed.org/docs/api/api_key.html)

For local development without Docker:

- [Go 1.25+](https://go.dev/dl/)
- [Node.js 22+](https://nodejs.org/) and [pnpm](https://pnpm.io/)
- PostgreSQL 16+

---

## Configuration

The API reads secrets from environment variables. Before running the app, copy the example env file and fill in your FRED API key:

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```
FRED_API_KEY=your_fred_api_key_here
```

`.env.local` is listed in `.gitignore` and should never be committed.

---

## Running the app

### With Docker (recommended)

```bash
docker compose up --build
```

Docker Compose loads `.env.local` automatically and passes `FRED_API_KEY` into the API container.

This starts three services:

| Service | URL |
|---|---|
| React frontend | http://localhost:4000 |
| Go API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

Source files are mounted into the containers, so changes to Go code trigger a live reload via [Air](https://github.com/air-verse/air), and changes to the UI trigger Vite's HMR. Note that on initial load, it can take a few seconds for the database to spin up. 

To reset the database or force a clean `node_modules` install:

```bash
docker compose down -v
docker compose up --build
```

### Without Docker

**API**

```bash
cd api
FRED_API_KEY=your_fred_api_key_here \
  DATABASE_URL="host=localhost port=5432 user=treasury password=treasury dbname=treasury sslmode=disable" \
  go run .
```

**UI**

```bash
cd ui
pnpm install
VITE_API_URL=http://localhost:8080 pnpm dev
```

---

## Running tests

### UI

```bash
cd ui
pnpm test          # watch mode
pnpm test:run      # single run
pnpm test:coverage # coverage report
```

Tests use [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/). All API hooks are mocked with `vi.spyOn` so tests run fully in-process with no network calls.

### API

```bash
cd api
go test ./...
```

Handler tests spin up a mock FRED HTTP server using `net/http/httptest` and exercise the full request/response cycle.

Be sure to set FRED_API_KEY in terminal environment so tests run correctly.

---

## API documentation

The API uses [Huma](https://huma.dev/), which auto-generates OpenAPI 3.1 documentation.

With the API running, open:

| Format | URL |
|---|---|
| Interactive (Swagger UI) | http://localhost:8080/docs |
| Raw OpenAPI JSON | http://localhost:8080/openapi.json |

### Endpoints summary

| Method | Path | Description |
|---|---|---|
| `GET` | `/yields` | Current yield for all 11 treasury terms |
| `GET` | `/yields/history` | Historical observations for a FRED series (`?series=DGS10&start=2024-01-01&end=2024-12-31`) |
| `GET` | `/orders` | All placed orders, newest first |
| `POST` | `/orders` | Place a new order (`{ "term": "10Y", "amount": 50000 }`) |

---

## Future improvements

- **Cloud deployment** — containerize for a managed platform (e.g. Cloud Run, ECS, Fly.io) with a managed Postgres instance. Inject API tokens in deployment script.
- **Authentication and authorization** — add user identity (OAuth / JWT), associate orders with users, and enforce row-level security (RLS) on the database so users only see their own orders
- **Caching layer** — introduce Redis or an in-memory cache in front of the FRED API calls to reduce latency and external API usage under high load
- **API Testing** - improve API test suite to mock database
- **Analytics** — track order activity and yield views to understand usage patterns
- **Richer order UX** — order confirmation screen, order cancellation, profit/loss estimates; exact features would depend on client requirements
- **Pagination on orders** — add `limit`/`offset` (or cursor-based) pagination to `GET /orders` and consume it in the frontend order history table
- **Dynamic table component** — replace the static order history table with a feature-rich component supporting sorting, filtering, and column configuration
