# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SmartResume is a Next.js 16 project configured for static export and deployment on Cloudflare Pages. The project uses TypeScript, React 19, and Tailwind CSS v4 for styling.

## Development Commands

- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Build the application for production (exports to `./out` directory)
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code linting

## Architecture

### Static Export Configuration
The project is configured for static site generation:
- `next.config.ts` sets `output: 'export'` for static builds
- Images are unoptimized (`unoptimized: true`) for static compatibility
- Build outputs to `./out` directory for Cloudflare Pages deployment

### Deployment Setup
- Uses Cloudflare Pages via `wrangler.json` configuration
- Assets directory points to `./out` build output
- Compatibility date set to 2024-12-15

### Styling System
- Tailwind CSS v4 with PostCSS integration
- Custom CSS variables for theming in `src/app/globals.css`
- Dark mode support via `prefers-color-scheme`
- Geist font family integration (Sans and Mono variants)

### Project Structure
```
src/
  app/
    layout.tsx      # Root layout with font configuration
    page.tsx        # Home page component
    globals.css     # Global styles and Tailwind imports
    favicon.ico     # Site favicon
```

## Key Configuration Files

- `next.config.ts` - Next.js configuration for static export
- `wrangler.json` - Cloudflare Pages deployment configuration
- `postcss.config.mjs` - PostCSS configuration for Tailwind CSS
- `eslint.config.mjs` - ESLint configuration with Next.js rules
- `tailwind.config.ts` - Tailwind CSS configuration (inherits from Next.js)

## Development Notes

- This is a static site project - avoid dynamic server-side features
- All pages should be statically renderable
- Images must use the `unoptimized` prop due to static export
- The build process generates HTML files in the `out` directory ready for deployment


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
