# Repository Guidelines

## Project Structure & Module Organization
- Next.js App Router lives in `src/app` (`layout.tsx` for shell, `page.tsx` for the home route, `globals.css` for Tailwind 4 + custom tokens). Add new routes as directories under `src/app/<route>/page.tsx`.
- Static assets (logos, favicons, downloads) belong in `public/` and are addressed with absolute paths (e.g., `/images/logo.png`).
- Build and tooling configs sit at the repo root: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `wrangler.json` (keep deployment/service tweaks here).

## Build, Test, and Development Commands
- `npm install` — install dependencies (Node 18+ recommended).
- `npm run dev` — start the local dev server at `http://localhost:3000` with hot reload.
- `npm run build` — production build; fails on type or lint errors.
- `npm start` — serve the production build locally (runs `next start`).
- `npm run lint` — lint TypeScript/JS and Next.js-specific rules.

## Coding Style & Naming Conventions
- Language: TypeScript with Next.js 16 App Router defaults (React Server Components by default; opt into Client Components with `"use client"` at the top).
- Formatting: 2-space indentation; keep components small and server-friendly. Prefer `async` server components for data access.
- Naming: PascalCase for components, camelCase for functions/variables, kebab-case for file names unless Next requires `page.tsx`/`layout.tsx`.
- Styling: Tailwind 4 via `@import "tailwindcss";` in `globals.css`; favor utility classes over inline styles. Centralize shared tokens in `globals.css` variables.

## Testing Guidelines
- No automated tests are set up yet; add tests alongside features using `*.test.tsx` or `*.spec.ts` under `src/` when introducing new logic.
- Aim to cover: rendering states, basic accessibility expectations, and key data branches. Prefer React Testing Library for components and `@testing-library/jest-dom` matchers.
- Run `npm run lint` as a quick guard until a test runner is introduced.

## Commit & Pull Request Guidelines
- Commits: write imperative, scope-limited messages (e.g., `Add hero section layout`, `Fix lint errors on home page`). Keep changes focused and readable.
- Pull Requests: include a concise summary of changes, linked issue or task ID when available, manual test notes, and before/after screenshots for UI updates.
- Keep PRs small and incremental; update docs/config diffs in the same PR when behavior changes.

## Security & Configuration Tips
- Store secrets in `.env.local` (never commit). Mirror required keys in `.env.example` if you add new ones.
- Review `wrangler.json` and `next.config.ts` before changing runtime targets or domains; prefer environment-specific overrides rather than hard-coding values.



## **Cloudflare Pages Deployment**

The AI ensures all projects are deployable to Cloudflare Pages as a static site.

* **Static Export:** The AI configures `next.config.ts` with `output: 'export'` and `images: { unoptimized: true }` to generate static assets in the `out` directory.
* **Wrangler Configuration:** The AI maintains a `wrangler.json` file in the project root to instruct Cloudflare Pages to deploy the `out` directory.
  ```json
  {
    "name": "your-project-name",
    "compatibility_date": "YYYY-MM-DD",
    "assets": {
      "directory": "./out"
    }
  }
  ```
* **Deployment Workflow:** The AI understands that deployment is triggered by pushing changes to the repository, which Cloudflare Pages monitors.

## **Unified Model Call Platform (Mulerun)**

All Large Language Model (LLM) invocations must be performed through the **Mulerun** platform. Direct calls to official APIs of third-party models such as OpenAI, Anthropic, Google, or DeepSeek are strictly prohibited. The AI can use the `mulerun-docs` MCP tool to search for API usage guidelines.

### **Scope**
This specification applies to, but is not limited to, the following scenarios:
*   Text generation, rewriting, summarization, translation.
*   Code generation and code analysis.
*   Multimodal understanding (e.g., Image-to-Text, Text-to-Image).
*   Model inference steps in Agent/Tool scheduling.

### **Architectural Principles**
*   **Frontend (Client Components):** Must **NOT** call any large models directly.
*   **Backend Location:** All model calls must be located in:
    *   Server Components
    *   Server Actions
    *   Independent server-side utility functions (e.g., `/lib/ai`)
*   The project must treat Mulerun as the **sole entry point** for large model capabilities.

### **Design Goals**
*   **Unified Abstraction:** Avoid vendor lock-in by using a single platform.
*   **Management:** Facilitate usage statistics, cost control, and commercial billing.
*   **Extensibility:** Support future model replacement, A/B testing, and capability upgrades.
*   **Security:** Ensure API Keys are not exposed to the client.

### **AI Behavior Constraints**
When adding or modifying any feature involving large model capabilities, the AI must:
1.  **Prioritize** designing calls based on Mulerun.
2.  **Never** suggest or introduce implementations that "directly call official model APIs".
3.  If Mulerun does not currently support a capability, **explicitly state the limitation** instead of bypassing the platform.
