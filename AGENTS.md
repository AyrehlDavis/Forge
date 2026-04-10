<!-- BEGIN:nextjs-agent-rules -->

# Project Guidelines

## Build and Validate

- Use the repository scripts in [package.json](package.json): `npm run dev`, `npm run build`, `npm run start`, and `npm run lint`.
- There is no test script or test harness in this repository. Do not claim test coverage unless you add and run tests explicitly.
- The project expects Node `^24.0.0` and npm `>=11.10.0`; `.npmrc` enforces `engine-strict=true`, so installs can fail on older toolchains.

## Architecture

- This is a Next.js 16 App Router application rooted in [app](app). Prefer App Router primitives such as `page.tsx`, `layout.tsx`, and `route.ts`.
- API endpoints belong under `app/api/**/route.ts`. Use [app/api/health/route.ts](app/api/health/route.ts) as the local example.
- Shared static assets live in [public](public).
- Deployment configuration lives under [.devops](.devops) and GitHub workflow automation under [.github/workflows](.github/workflows).

## Conventions

- Treat Next.js 16 as authoritative over prior training. Before changing framework-specific behavior, read the relevant docs in [node_modules/next/dist/docs](node_modules/next/dist/docs).
- TypeScript is intentionally non-strict in [tsconfig.json](tsconfig.json) (`strict: false`). Match the existing tolerance level unless the task requires tightening types.
- ESLint uses flat config in [eslint.config.mjs](eslint.config.mjs). Do not add legacy `.eslintrc*` configuration.
- Tailwind is version 4 via [postcss.config.mjs](postcss.config.mjs) and [app/globals.css](app/globals.css). Do not assume Tailwind v3 setup patterns.

## Agent Workflow

- Enter plan mode for non-trivial work: any task with 3 or more steps, architectural decisions, or meaningful verification. Re-plan immediately if assumptions break.
- Use subagents for exploration, research, and parallel analysis when they keep the main thread focused.
- Verify before declaring completion. Use the strongest available proof for the change: lint, build, tests, logs, or live endpoint checks as appropriate.
- For bug reports and failing checks, diagnose and fix directly unless blocked by missing requirements or unsafe ambiguity.
- For non-trivial changes, prefer the most elegant maintainable solution after understanding the problem. Do not over-engineer obvious fixes.
- Review [.github/lessons.md](.github/lessons.md) when starting relevant work, and append new lessons after user corrections.
- Use the scoped guidance in [.github/instructions/code-design.instructions.md](.github/instructions/code-design.instructions.md) when creating or refactoring source files.

## Existing Docs

- Start with [README.md](README.md) for setup and script usage.
- [CLAUDE.md](CLAUDE.md) delegates to this file, so keep this document concise and current.
<!-- END:nextjs-agent-rules -->
