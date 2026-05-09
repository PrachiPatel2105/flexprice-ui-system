/**
 * useFilterStore — Challenge A: Filter Persistence without URL bloat
 *
 * Persists multi-dimensional filter state per page in sessionStorage,
 * keyed by route (e.g. `filters:invoices`). Syncs only a shallow fingerprint
 * (hash of filter count + keys) to the URL so pages remain bookmarkable
 * without bloating the query string.
 *
 * ## API
 * - `setFilter(key, value)` — set a single filter value
 * - `resetFilters()` — clear all filters for the current page
 * - `getFilters()` — get all current filter values
 * - `filters` — reactive filter state object
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type FilterValue = string | number | boolean | string[] | null | undefined;
export type FilterState = Record<string, FilterValue>;

interface FilterStoreState {
	/** Filter state keyed by route (e.g. "filters:invoices") */
	filtersByRoute: Record<string, FilterState>;
	/** Current active route key */
	currentRoute: string;
	/** Set the active route */
	setRoute: (route: string) => void;
	/** Set a single filter value for the current route */
	setFilter: (key: string, value: FilterValue) => void;
	/** Reset all filters for the current route */
	resetFilters: () => void;
	/** Get all filters for the current route */
	getFilters: () => FilterState;
	/** Get filters for a specific route */
	getFiltersForRoute: (route: string) => FilterState;
}

/** Compute a shallow fingerprint of the filter state for URL sync */
export const computeFilterFingerprint = (filters: FilterState): string => {
	const activeKeys = Object.entries(filters)
		.filter(([, v]) => v !== null && v !== undefined && v !== '')
		.map(([k]) => k)
		.sort();
	return activeKeys.length > 0 ? `f${activeKeys.length}_${activeKeys.join('-')}` : '';
};

/** Sync fingerprint to URL without full serialisation */
export const syncFingerprintToUrl = (fingerprint: string): void => {
	if (typeof window === 'undefined') return;
	const url = new URL(window.location.href);
	if (fingerprint) {
		url.searchParams.set('_f', fingerprint);
	} else {
		url.searchParams.delete('_f');
	}
	window.history.replaceState({}, '', url.toString());
};

export const useFilterStore = create<FilterStoreState>()(
	persist(
		(set, get) => ({
			filtersByRoute: {},
			currentRoute: 'default',

			setRoute: (route: string) => {
				set({ currentRoute: route });
			},

			setFilter: (key: string, value: FilterValue) => {
				const { currentRoute, filtersByRoute } = get();
				const routeKey = `filters:${currentRoute}`;
				const current = filtersByRoute[routeKey] ?? {};
				const updated = { ...current, [key]: value };

				set({
					filtersByRoute: {
						...filtersByRoute,
						[routeKey]: updated,
					},
				});

				// Sync fingerprint to URL
				syncFingerprintToUrl(computeFilterFingerprint(updated));
			},

			resetFilters: () => {
				const { currentRoute, filtersByRoute } = get();
				const routeKey = `filters:${currentRoute}`;
				set({
					filtersByRoute: {
						...filtersByRoute,
						[routeKey]: {},
					},
				});
				syncFingerprintToUrl('');
			},

			getFilters: () => {
				const { currentRoute, filtersByRoute } = get();
				return filtersByRoute[`filters:${currentRoute}`] ?? {};
			},

			getFiltersForRoute: (route: string) => {
				const { filtersByRoute } = get();
				return filtersByRoute[`filters:${route}`] ?? {};
			},
		}),
		{
			name: 'flexprice-filters',
			storage: createJSONStorage(() => sessionStorage),
			partialize: (state) => ({ filtersByRoute: state.filtersByRoute }),
		},
	),
);

/**
 * Convenience hook for a specific route's filters.
 * Automatically sets the current route on mount.
 */
export const useRouteFilters = (route: string) => {
	const store = useFilterStore();

	const filters = store.getFiltersForRoute(route);

	const setFilter = (key: string, value: FilterValue) => {
		store.setRoute(route);
		store.setFilter(key, value);
	};

	const resetFilters = () => {
		store.setRoute(route);
		store.resetFilters();
	};

	return { filters, setFilter, resetFilters };
};
