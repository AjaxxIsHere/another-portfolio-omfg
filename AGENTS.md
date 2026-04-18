<!-- BEGIN:nextjs-agent-rules -->
## UI & Design Conventions (Nothing/Firecrawl Style)
- **Borders:** Use `border-[0.5px] border-white/10` for a hardware/industrial feel. Avoid thick borders.
- **Typography:** Do **not** use `GeistMono`. Use an elegant display serif (e.g., `Playfair Display`) for hero headings and `GeistSans` for supporting prose/UI text.
- **Colors:** Primary Background: `#121212`, Accent: `#FA5D19` (Firecrawl Orange).
- **Animations:** Use Framer Motion for all layout transitions. Prefer `layoutId` for shared element transitions.
- **Strict Mode:** If a component doesn't need interactivity, keep it as a **Server Component**.

## Technical Constraints (Next.js 16)
- **React Compiler:** Do NOT use `useMemo` or `useCallback` unless explicitly requested. Let the compiler handle it.
- **Async Params:** Always treat `params` and `searchParams` as Promises (Next.js 16 breaking change).
- **Caching:** Use the `use cache` directive for data fetching segments where appropriate.

## Portfolio Architecture Decisions (Session: 2026-04-18)
- **Layout Strategy:** Replace bento/hybrid structure with a split hero: left content rail and right abstract composition panel.
- **Hero Hierarchy:** Huge elegant name heading, short about subheading, tech-stack chips, then social icons.
- **Content Mode:** Keep placeholder about line and social URLs until user finalizes them.
- **Color Tokens:** Use `--background: #121212`, `--surface: #1A1A1A`, `--foreground: #EDEDED`, `--accent: #FA5D19`.
- **Borders/Surface:** Keep `border-[0.5px] border-white/10` and subtle `backdrop-blur-sm`; avoid heavy shadows.
- **Typography Split:** Use `Playfair Display` for the hero name and `GeistSans` for all supporting text/chips/UI.
- **Background Pattern:** Use a full-page dot-matrix field with mouse-reactive fluid glow layers.
- **Motion Pattern:** All hero elements should animate on initial page load; keep interactive motion isolated in client components.
- **Status Panel:** Do **not** include a live "Now/Currently Building" panel.
<!-- END:nextjs-agent-rules -->
