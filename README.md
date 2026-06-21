# Wedding Capture — Admin Panel

Next.js admin frontend for the Wedding Capture platform. Manages clients, events, QR codes, media galleries, and AI reel generation.

## Stack

- **Next.js 15** (App Router, React Server Components)
- **shadcn/ui** + Tailwind CSS v4
- **Nhost** (Hasura GraphQL via headless Functions auth API)
- **Apollo Client** for real-time GraphQL subscriptions
- **TanStack Table** for data tables
- **Zod** + react-hook-form for validation

## Getting started

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Dev mode (no Nhost required)

Set `NEXT_PUBLIC_DEV_MODE=true` in `.env.local` (enabled by default in `.env.example`).

- **Login:** any email + password (8+ chars). Defaults: `admin@example.com` / `devpassword`
- **Data:** seeded clients & events, persisted to `.data/dev-store.json`
- **Dashboard:** use **Edit dashboard** to change the title, description, and metric values
- **Clients / Events:** create and edit forms save to the local dev store

Turn off dev mode (`NEXT_PUBLIC_DEV_MODE=false`) and configure Nhost credentials when connecting to cam-app-nhost.

## Project structure

```
app/
  admin/              # Protected admin routes (/admin/*)
    dashboard/
    clients/
    events/
    settings/
  login/              # Public login page
  api/                # Route handlers (QR, token validation, reels)
components/
  ui/                 # shadcn/ui primitives
  shared/             # PageHeader, DataTable, StatusBadge, QrDisplay
lib/
  data/               # Server-only data-access layer
  graphql/            # GraphQL documents
  schemas/            # Zod validation schemas
  types/              # Shared TypeScript types
hooks/                # Client-side subscription hooks
```

## Architecture

See [documentation/admin-architecture.md](../documentation/admin-architecture.md) for the full frontend architecture guide.

Key principles:
- Pages fetch data via `lib/data/*` (server-only)
- GraphQL is isolated in `lib/graphql/*`
- Client components only where interactivity or subscriptions are needed
- Route-local components live in `_components/` beside their route

## GraphQL codegen

Once Nhost is configured, generate typed operations:

```bash
npm run codegen
```

## Related repos

| Folder | Purpose |
|---|---|
| `cam-app-admin` | This admin panel (CRM) |
| `cam-app-nhost` | Nhost backend (Hasura schema, auth, storage) |
| `cam-app-client` | Guest PWA (camera app) |
