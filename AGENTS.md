# AGENTS.md

Guidance for AI agents and contributors working in this repository.

## Project Overview

- **Type**: Angular 19 + Ionic 8 + Angular Material hybrid mobile/web app (Capacitor for native).
- **Framework**: Angular 19 (standalone components, application builder), Ionic Web Components, Angular Material.
- **Language**: TypeScript (strict mode enabled).
- **Runtime**: Node.js. Package manager: npm (see `package-lock.json`).

## Commands

| Task | Command |
| --- | --- |
| Dev server | `npm start` (or `ng serve`) |
| Build | `npm run build` |
| Watch build (dev) | `npm run watch` |
| Unit tests | `npm test` (Jest, not Karma) |
| Add a component | `ng generate component <name>` |

> Note: `package.json` wires `test` to Jest (`jest-preset-angular`, jsdom). The Karma `test` architector in `angular.json` is not used. Coverage is collected to `coverage/` on every test run.

## Project Structure

- `src/app/` — application code (standalone components, pages, config).
- `src/app/app.config.ts` / `app.routes.ts` — root providers and routing.
- `src/app/pages/` — routed page components.
- `src/app/component-test/` — example component.
- `public/` — static assets.
- `android/` — Capacitor Android project.
- Test files use the `.spec.ts` suffix and co-locate with the component under test.

## Conventions

- TypeScript is strict — honor `strictTemplates` in templates and return types.
- SCSS is the default style language for components and global styles.
- Use Ionic components (`ion-*`) and Angular Material prebuilt theme (`cyan-orange.css`) via Angular CDK; keep dependency usage consistent with existing imports.
- Run unit tests before finishing changes; existing specs cover `app.component`, `home.page`, and `component-test`.
- Do not commit build artifacts (`dist/`, `coverage/`) or secrets.
