/**
 * createQueryConfig — Challenge C: Configurable TanStack Query Caching
 *
 * Provides a `createQueryConfig` utility that:
 * - Sets global defaults: staleTime 5min, gcTime 10min
 * - Allows per-call-site overrides
 * - Exports pre-defined presets: REALTIME, DEFAULT, STATIC
 *
 * ## Usage
 * ```ts
 * // Use default caching
 * useQuery(createQueryConfig({ queryKey: ['invoices'], queryFn: fetchInvoices }))
 *
 * // Real-time (no cache)
 * useQuery(createQueryConfig({ queryKey: ['events'], queryFn: fetchEvents }, QUERY_PRESETS.REALTIME))
 *
 * // Static (30 min cache for plan definitions)
 * useQuery(createQueryConfig({ queryKey: ['plans'], queryFn: fetchPlans }, QUERY_PRESETS.STATIC))
 * ```
 */

import type { UseQueryOptions } from '@tanstack/react-query';

// ─── Global Defaults ──────────────────────────────────────────────────────────

export const GLOBAL_QUERY_DEFAULTS = {
	staleTime: 5 * 60 * 1000, // 5 minutes
	gcTime: 10 * 60 * 1000, // 10 minutes
} as const;

// ─── Presets ──────────────────────────────────────────────────────────────────

export interface QueryCachePreset {
	staleTime: number;
	gcTime: number;
	label: string;
	description: string;
}

export const QUERY_PRESETS = {
	/**
	 * REALTIME — no caching, always fetch fresh data.
	 * Use for: Events debugger, live usage metrics, payment status.
	 */
	REALTIME: {
		staleTime: 0,
		gcTime: 0,
		label: 'REALTIME',
		description: 'No caching — always fetches fresh data. Use for live metrics and events.',
	},

	/**
	 * DEFAULT — 5 minute stale time, 10 minute gc time.
	 * Use for: Customers, Invoices, Subscriptions.
	 */
	DEFAULT: {
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		label: 'DEFAULT',
		description: '5 min stale, 10 min gc. Good for most list pages.',
	},

	/**
	 * STATIC — 30 minute stale time, 60 minute gc time.
	 * Use for: Plan definitions, feature lists, price units — data that rarely changes.
	 */
	STATIC: {
		staleTime: 30 * 60 * 1000,
		gcTime: 60 * 60 * 1000,
		label: 'STATIC',
		description: '30 min stale, 60 min gc. For plan definitions and rarely-changing data.',
	},
} as const satisfies Record<string, QueryCachePreset>;

// ─── createQueryConfig ────────────────────────────────────────────────────────

type CacheOverride = Partial<Pick<QueryCachePreset, 'staleTime' | 'gcTime'>>;

/**
 * Creates a TanStack Query options object with sensible FlexPrice defaults.
 * Merges global defaults → preset → per-call overrides.
 *
 * @param options - Standard `UseQueryOptions` (queryKey, queryFn, etc.)
 * @param preset - Optional preset from `QUERY_PRESETS` (default: `QUERY_PRESETS.DEFAULT`)
 * @param overrides - Optional per-call staleTime/gcTime overrides
 */
export function createQueryConfig<TData = unknown, TError = Error>(
	options: Omit<UseQueryOptions<TData, TError>, 'staleTime' | 'gcTime'>,
	preset: CacheOverride = QUERY_PRESETS.DEFAULT,
	overrides: CacheOverride = {},
): UseQueryOptions<TData, TError> {
	return {
		staleTime: overrides.staleTime ?? preset.staleTime ?? GLOBAL_QUERY_DEFAULTS.staleTime,
		gcTime: overrides.gcTime ?? preset.gcTime ?? GLOBAL_QUERY_DEFAULTS.gcTime,
		...options,
	};
}

// ─── Convenience wrappers ─────────────────────────────────────────────────────

/** Create a real-time query config (staleTime: 0) */
export const realtimeQuery = <TData = unknown, TError = Error>(
	options: Omit<UseQueryOptions<TData, TError>, 'staleTime' | 'gcTime'>,
	overrides: CacheOverride = {},
) => createQueryConfig<TData, TError>(options, QUERY_PRESETS.REALTIME, overrides);

/** Create a static query config (staleTime: 30min) */
export const staticQuery = <TData = unknown, TError = Error>(
	options: Omit<UseQueryOptions<TData, TError>, 'staleTime' | 'gcTime'>,
	overrides: CacheOverride = {},
) => createQueryConfig<TData, TError>(options, QUERY_PRESETS.STATIC, overrides);

/** Create a default query config (staleTime: 5min) */
export const defaultQuery = <TData = unknown, TError = Error>(
	options: Omit<UseQueryOptions<TData, TError>, 'staleTime' | 'gcTime'>,
	overrides: CacheOverride = {},
) => createQueryConfig<TData, TError>(options, QUERY_PRESETS.DEFAULT, overrides);
