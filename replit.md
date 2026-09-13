# Weather

An iOS weather companion for checking current conditions and upcoming forecasts in a calm, glanceable view.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/weather-ios/app/index.tsx` — main weather experience, local city search, forecast data, and location permission flow
- `artifacts/weather-ios/constants/colors.ts` — weather-specific color tokens
- `artifacts/weather-ios/assets/images/icon.png` — generated iOS app icon
- `artifacts/weather-ios/app/_layout.tsx` — Expo Router root layout

## Architecture decisions

- The first build is frontend-only and keeps the city/forecast data local so the mobile experience is usable without API credentials.
- AsyncStorage remembers the user's last selected city between launches.
- Expo Location is used for the native location permission flow; live forecast lookup is intentionally deferred to a follow-up.

## Product

- Current conditions for a selected city
- Hourly temperature strip
- Five-day forecast
- Humidity, wind, UV, visibility, sunrise, and sunset details
- Searchable city selector with remembered selection
- Native current-location permission request

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
