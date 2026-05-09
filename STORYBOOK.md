# FlexPrice Component Library — Storybook

A hosted Storybook component library extracted from the [FlexPrice](https://flexprice.io) frontend.
Built as part of the FlexPrice Frontend Intern Take-Home Assignment.

---

## Live Storybook

> Deploy URL will be added after Vercel deployment.

---

## Running Locally

```bash
npm install
npm run storybook        # dev server at http://localhost:6006
npm run build-storybook  # production build → storybook-static/
npm run test             # vitest unit + component tests
```

---

## What's Inside

### Atoms

| Component | Stories | Description |
|-----------|---------|-------------|
| `Button` | Default, Variants, Sizes, Loading, Disabled, Icons, Interaction | Primary CTA element — navy/destructive/outline/ghost/link |
| `Chip` | All variants, Plan/Invoice/Subscription status sets | Status labels with colour-coded variants |
| `Input` | Text, Number, Formatted, Currency prefix, Error, Disabled | Controlled input with formatting support |
| `Select` | Default, Radio style, With descriptions, Error | Single-value dropdown built on Radix |
| `Tooltip` | Positions, Delay, Rich content, On-icon | Informational overlay with configurable delay |
| `Spinner` | All sizes, Inline, Loading state | Animated loading indicator |

### Molecules

| Component | Stories | Description |
|-----------|---------|-------------|
| `MetricCard` | Revenue, Trending up/down, Dashboard grid | KPI card with trend indicator |
| `DataTable` | Default, Row click, Empty, Loading, Virtualised (10k rows) | Sortable table with skeleton and virtual scroll |
| `InvoiceStatusBadge` | All 6 statuses, In-table demo | Maps status strings to coloured chips with icons |
| `UsageBar` | Low/Medium/High/Critical/Over-limit | Labelled progress bar for feature usage |
| `DateRangePicker` | Default, With title, Preselected, Disabled | Timezone-aware two-month calendar |
| `SearchBar` | Default, Disabled, In filter bar, Interaction test | Debounced search with clear button |

### Organisms

| Component | Stories | Description |
|-----------|---------|-------------|
| `SidebarNav` | Default, Active routes, Collapsed, Live demo | Collapsible nav with active-route highlighting |
| `PricingTierTable` | Tiered, Volume, Graduated, Multi-currency | Displays pricing tiers in a readable table |
| `EmptyState` | No customers/invoices/plans/events, Interaction test | Full-page empty state with icon + CTA |

---

## Advanced Challenges

### Challenge A — Filter Persistence (`useFilterStore`)

**File:** `src/store/useFilterStore.ts`

Zustand store that persists multi-dimensional filter state per page in `sessionStorage`, keyed by route (e.g. `filters:invoices`). Syncs only a shallow fingerprint to the URL (`?_f=f2_search-status`) so pages are bookmarkable without bloating the query string.

```ts
// Usage
const { filters, setFilter, resetFilters } = useRouteFilters('invoices');

setFilter('status', 'paid');
setFilter('search', 'acme');
resetFilters();
```

**Story:** `Advanced/FilterStore` — live demo with DataTable wired to the store.

---

### Challenge B — Virtualised List

**File:** `src/components/molecules/Table/DataTable.stories.tsx` → `VirtualisedDataTable`

Extends `DataTable` with `@tanstack/react-virtual` to render only viewport rows + overscan buffer. Demonstrated with **10,000 mock rows** that scroll smoothly.

---

### Challenge C — Configurable TanStack Query Caching

**File:** `src/lib/queryConfig.ts`

```ts
// Presets
QUERY_PRESETS.REALTIME  // staleTime: 0,        gcTime: 0
QUERY_PRESETS.DEFAULT   // staleTime: 5 min,    gcTime: 10 min
QUERY_PRESETS.STATIC    // staleTime: 30 min,   gcTime: 60 min

// Usage
useQuery(createQueryConfig({ queryKey: ['invoices'], queryFn: fetchInvoices }))
useQuery(realtimeQuery({ queryKey: ['events'], queryFn: fetchEvents }))
useQuery(staticQuery({ queryKey: ['plans'], queryFn: fetchPlans }))

// Per-call override
useQuery(createQueryConfig(
  { queryKey: ['customers'], queryFn: fetchCustomers },
  QUERY_PRESETS.DEFAULT,
  { staleTime: 0 }
))
```

**Story:** `Advanced/QueryConfig` — preset documentation table + live caching demo.

---

## Tests

```bash
npm run test
# 82 tests passing across 6 test files
```

**Unit tests** (`src/tests/utils/formatters.test.ts`):
- Number/currency formatting
- Invoice status label mapping
- Tiered price calculation
- Filter fingerprint computation
- `createQueryConfig` preset behaviour

**Component render tests** (`src/tests/components/Button.test.tsx`):
- `Button` — render, disabled, loading, click handler
- `Chip` — render, click, disabled, icon
- `InvoiceStatusBadge` — all statuses, unknown status, icon toggle
- `UsageBar` — label, usage text, over-limit, aria attributes

---

## Deploying to Vercel

1. Push this repo to GitHub
2. Create a new Vercel project → import the repo
3. Set **Framework Preset** to `Other`
4. Set **Build Command** to `npm run build-storybook`
5. Set **Output Directory** to `storybook-static`
6. Deploy

---

## Design Tokens

The component library uses the FlexPrice design system:

- **Primary colour:** `#092E44` (dark navy)
- **Border radius:** `6px` (uniform)
- **Font:** Geist / Inter
- **Colour system:** CSS variables via shadcn/ui (`--primary`, `--muted`, `--border`, etc.)
- **Status colours:** success `#ECFBE4`/`#377E6A`, warning `#FFF7ED`/`#C2410C`, failed `#FEE2E2`/`#DC2626`, info `#EFF8FF`/`#2F6FE2`

See `tailwind.config.js` and `src/index.css` for the full token set.
