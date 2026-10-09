# AGENTS.md — 02-weather

Bun + TypeScript console app (Weather CLI). Implemented: `src/index.ts` entry (`runMenu`) + layered modules — `actions/`, `presentation/`, `storage/`, `types/`, `api/`, `utils/` (see `references/file-system.md`); persistence in local `./weather-data.json` (gitignored, single file shared by `citiesStorage` + `settingsStorage`).

## Commands (Bun only — no npm/node/jest/vite)

- Run: `bun src/index.ts` (`bun run start`) / watch: `bun run dev`
- Install: `bun install` (lockfile: `bun.lock`)
- Test: `bun test` (`bun:test` style) — no tests exist yet; add `*.test.ts` colocated
- Typecheck: `bunx tsc --noEmit` (strict; `noUncheckedIndexedAccess`, `moduleResolution: bundler`, `allowImportingTsExtensions` — imports keep `.ts` extension)
- Build binary (README goal): `bun run build` (`bun build ./src/index.ts --compile --outfile ./weather`)
- Bun auto-loads `.env` — do not add dotenv

## Architecture (intended, per README)

- Entry: `src/index.ts` (package `module: src/index.ts`, `type: module`)
- Target UX: numbered console menu (default city, all cities, add/remove/set default, °C/°F toggle, exit) — see `README.md` example
- Data flow: Open-Meteo Geocoding (`geocoding-api.open-meteo.com/v1/search?name=<city>&count=1&language=es&format=json`) → Forecast (`api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current=temperature_2m`); no API key needed
- No framework, DB, or server: plain Bun CLI using `fetch`, `Bun.file` for city persistence, `Bun.$` if shelling out

## Conventions

- Prefer Bun APIs over Node: `Bun.file` vs `node:fs`, built-in `fetch`/`WebSocket`, `bun:sqlite` if persistence outgrows JSON
- `tsconfig.json` is `bun init` default (`verbatimModuleSyntax`, `allowImportingTsExtensions`); keep `module: Preserve`
- Do not introduce express/pg/ws/dotenv or bundlers; keep zero runtime deps
- Puedes usar `@bun-instructions.md` para obtener instrucciones de Bun.
