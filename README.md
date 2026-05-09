# FlexPrice UI System — Storybook Component Library

A hosted Storybook component library built from the [FlexPrice](https://flexprice.io) frontend codebase.
Built as part of the FlexPrice Frontend Intern Take-Home Assignment.

## Live Storybook

> Deployed at: _(add Vercel URL after deployment)_

## Stack

React · TypeScript · Vite · Storybook 8 · Tailwind CSS · shadcn/ui · Radix UI · Zustand · TanStack Query v5

## Quick Start

```bash
npm install --legacy-peer-deps
npm run storybook        # dev server → http://localhost:6006
npm run build-storybook  # production build → storybook-static/
npm run test             # vitest unit + component tests (87 passing)
```

## Components

### Atoms
| Component | Stories | Highlights |
|-----------|---------|------------|
| `Button` | Default, Variants, Sizes, Loading, Disabled, Danger, Icons, Interaction | 6 variants, 5 sizes, loading spinner |
| `Chip` / `StatusChip` | All variants, Plan/Invoice/Subscription status sets | 5 colour variants, optional icons |
| `Input` | Text, Number, Formatted, Currency prefix, Error, Disabled | Formatted-number with thousand separators |
| `Select` | Default, Radio style, With descriptions, WithSearch, Error | Searchable dropdown pattern |
| `Tooltip` | Positions, Delay, Rich content, On-icon | Radix-based, configurable delay |
| `Spinner` | All sizes, Inline, Loading state | SVG spinner, configurable size/colour |

### Molecules
| Component | Stories | Highlights |
|-----------|---------|------------|
| `MetricCard` | Revenue, Trending up/down, Dashboard grid | KPI card with trend arrow |
| `DataTable` | Default, Sortable, Pagination, Empty, Loading, Virtualised (10k rows) | Full-featured table |
| `InvoiceStatusBadge` | All 6 statuses, In-table demo | Status → colour + icon mapping |
| `UsageBar` | Low/Medium/High/Critical/Over-limit | Colour shifts at 75% and 90% |
| `DateRangePicker` | Default, With title, Preselected, Disabled | Timezone-aware, two-month view |
| `SearchBar` | Default, Disabled, In filter bar, Interaction test | Debounced, clear button |

### Organisms
| Component | Stories | Highlights |
|-----------|---------|------------|
| `SidebarNav` | Default, Active routes, Collapsed, Live demo, Interaction | Collapsible accordion, icon-only mode |
| `PricingTierTable` | Tiered, Volume, Graduated, Package, Multi-currency | 4 pricing models |
| `EmptyState` | No customers/invoices/plans/events, Interaction | Icon + headline + subtext + CTA |

## Advanced Challenges

### Challenge A — Filter Persistence (`useFilterStore`)
`src/store/useFilterStore.ts` — Zustand store persisting filters in `sessionStorage` per route.
Syncs only a shallow fingerprint to the URL (`?_f=f2_search-status`).

### Challenge B — Virtualised DataTable
`DataTable → VirtualisedDataTable` story — `@tanstack/react-virtual` with 10,000 rows.

### Challenge C — Configurable TanStack Query Caching
`src/lib/queryConfig.ts` — `createQueryConfig` with `REALTIME` / `DEFAULT` / `STATIC` presets.

## Tests

```
87 tests passing across 6 test files
```

- **Unit:** number formatting, status mapping, tier price calculation, filter fingerprint, query config presets
- **Component:** Button, Chip, InvoiceStatusBadge, UsageBar

## Deploy to Vercel

1. Import this repo in Vercel
2. Set **Build Command:** `npm run build-storybook`
3. Set **Output Directory:** `storybook-static`
4. Set **Install Command:** `npm install --legacy-peer-deps`
5. Deploy
