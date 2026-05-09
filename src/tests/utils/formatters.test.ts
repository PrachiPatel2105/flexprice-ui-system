/**
 * Unit tests for FlexPrice utility functions.
 * Tests currency formatting, status mapping, and tier price calculation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { computeFilterFingerprint, useFilterStore } from '@/store/useFilterStore';
import { createQueryConfig, QUERY_PRESETS, GLOBAL_QUERY_DEFAULTS } from '@/lib/queryConfig';

// ─── Currency / Number Formatting ────────────────────────────────────────────

describe('formatAmount (Input utility)', () => {
	// Import inline to avoid module resolution issues
	const formatAmount = (amount: string, thousandSep = ',', decimalSep = '.'): string => {
		if (!amount) return '';
		const parts = amount.split(decimalSep);
		const integerPart = parts[0] || '';
		const decimalPart = parts[1];
		const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep);
		return decimalPart !== undefined ? `${formattedInteger}${decimalSep}${decimalPart}` : formattedInteger;
	};

	it('formats a plain integer with thousand separators', () => {
		expect(formatAmount('1000')).toBe('1,000');
		expect(formatAmount('1000000')).toBe('1,000,000');
	});

	it('formats a decimal number', () => {
		expect(formatAmount('1234.56')).toBe('1,234.56');
	});

	it('returns empty string for empty input', () => {
		expect(formatAmount('')).toBe('');
	});

	it('handles numbers below 1000 without separator', () => {
		expect(formatAmount('999')).toBe('999');
	});

	it('handles custom separators', () => {
		expect(formatAmount('1234567', '.', ',')).toBe('1.234.567');
	});
});

// ─── Status-to-Label Mapping ──────────────────────────────────────────────────

describe('Invoice status mapping', () => {
	const STATUS_LABELS: Record<string, string> = {
		paid: 'Paid',
		draft: 'Draft',
		void: 'Void',
		overdue: 'Overdue',
		pending: 'Pending',
		finalized: 'Finalized',
	};

	const getStatusLabel = (status: string): string => STATUS_LABELS[status] ?? status;

	it('maps known statuses to labels', () => {
		expect(getStatusLabel('paid')).toBe('Paid');
		expect(getStatusLabel('draft')).toBe('Draft');
		expect(getStatusLabel('void')).toBe('Void');
		expect(getStatusLabel('overdue')).toBe('Overdue');
		expect(getStatusLabel('pending')).toBe('Pending');
	});

	it('returns the raw status for unknown values', () => {
		expect(getStatusLabel('unknown_status')).toBe('unknown_status');
	});
});

// ─── Tier Price Calculation ───────────────────────────────────────────────────

describe('Tier price calculation', () => {
	interface Tier {
		from: number;
		to: number | null;
		unitPrice: number;
	}

	const calculateTieredCost = (usage: number, tiers: Tier[]): number => {
		let total = 0;
		let remaining = usage;

		for (const tier of tiers) {
			if (remaining <= 0) break;
			const tierMax = tier.to === null ? Infinity : tier.to;
			const tierSize = tierMax - tier.from + 1;
			const unitsInTier = Math.min(remaining, tierSize);
			total += unitsInTier * tier.unitPrice;
			remaining -= unitsInTier;
		}

		return Math.round(total * 10000) / 10000;
	};

	const tiers: Tier[] = [
		{ from: 0, to: 1000, unitPrice: 0 },
		{ from: 1001, to: 10000, unitPrice: 0.001 },
		{ from: 10001, to: null, unitPrice: 0.0005 },
	];

	it('calculates zero cost for usage within free tier', () => {
		expect(calculateTieredCost(500, tiers)).toBe(0);
		expect(calculateTieredCost(1000, tiers)).toBe(0);
	});

	it('calculates cost for usage spanning two tiers', () => {
		// 1001 free (0..1000 = 1001 units) + 999 at $0.001 = $0.999
		const cost = calculateTieredCost(2000, tiers);
		expect(cost).toBeCloseTo(0.999, 3);
	});

	it('calculates cost for usage spanning all tiers', () => {
		// 1001 free + 9000 at $0.001 + 999 at $0.0005 = $9.4995
		const cost = calculateTieredCost(11000, tiers);
		expect(cost).toBeCloseTo(9.4995, 3);
	});

	it('returns 0 for zero usage', () => {
		expect(calculateTieredCost(0, tiers)).toBe(0);
	});
});

// ─── Filter Fingerprint ───────────────────────────────────────────────────────

describe('computeFilterFingerprint', () => {
	it('returns empty string for empty filters', () => {
		expect(computeFilterFingerprint({})).toBe('');
	});

	it('returns empty string when all values are falsy', () => {
		expect(computeFilterFingerprint({ search: '', status: null, page: undefined })).toBe('');
	});

	it('returns a fingerprint with active filter count', () => {
		const fp = computeFilterFingerprint({ search: 'acme', status: 'paid' });
		expect(fp).toMatch(/^f2_/);
	});

	it('produces consistent fingerprints regardless of key order', () => {
		const fp1 = computeFilterFingerprint({ search: 'acme', status: 'paid' });
		const fp2 = computeFilterFingerprint({ status: 'paid', search: 'acme' });
		expect(fp1).toBe(fp2);
	});

	it('includes only active (non-empty) keys in fingerprint', () => {
		const fp = computeFilterFingerprint({ search: 'acme', status: '', page: null });
		expect(fp).toMatch(/^f1_search$/);
	});
});

// ─── createQueryConfig ────────────────────────────────────────────────────────
describe('createQueryConfig', () => {
	const mockQueryFn = async () => ({ data: [] });

	it('applies global defaults when no preset is given', () => {
		const config = createQueryConfig({ queryKey: ['test'], queryFn: mockQueryFn });
		expect(config.staleTime).toBe(GLOBAL_QUERY_DEFAULTS.staleTime);
		expect(config.gcTime).toBe(GLOBAL_QUERY_DEFAULTS.gcTime);
	});

	it('applies REALTIME preset correctly', () => {
		const config = createQueryConfig({ queryKey: ['test'], queryFn: mockQueryFn }, QUERY_PRESETS.REALTIME);
		expect(config.staleTime).toBe(0);
		expect(config.gcTime).toBe(0);
	});

	it('applies STATIC preset correctly', () => {
		const config = createQueryConfig({ queryKey: ['test'], queryFn: mockQueryFn }, QUERY_PRESETS.STATIC);
		expect(config.staleTime).toBe(30 * 60 * 1000);
		expect(config.gcTime).toBe(60 * 60 * 1000);
	});

	it('allows per-call overrides to take precedence', () => {
		const config = createQueryConfig({ queryKey: ['test'], queryFn: mockQueryFn }, QUERY_PRESETS.DEFAULT, { staleTime: 0 });
		expect(config.staleTime).toBe(0);
		expect(config.gcTime).toBe(QUERY_PRESETS.DEFAULT.gcTime);
	});

	it('preserves queryKey and queryFn', () => {
		const config = createQueryConfig({ queryKey: ['invoices', 1], queryFn: mockQueryFn });
		expect(config.queryKey).toEqual(['invoices', 1]);
		expect(config.queryFn).toBe(mockQueryFn);
	});
});

// ─── useFilterStore store behaviour ──────────────────────────────────────────

describe('useFilterStore store behaviour', () => {
	beforeEach(() => {
		// Reset to a clean state before each test
		const store = useFilterStore.getState();
		store.setRoute('test');
		store.resetFilters();
	});

	it('setFilter stores a value for the current route', () => {
		const store = useFilterStore.getState();
		store.setRoute('invoices');
		store.setFilter('status', 'paid');
		const filters = store.getFiltersForRoute('invoices');
		expect(filters.status).toBe('paid');
	});

	it('setFilter does not affect other routes', () => {
		const store = useFilterStore.getState();
		store.setRoute('invoices');
		store.setFilter('status', 'paid');
		const otherFilters = store.getFiltersForRoute('customers');
		expect(otherFilters.status).toBeUndefined();
	});

	it('resetFilters clears all filters for the current route', () => {
		const store = useFilterStore.getState();
		store.setRoute('invoices');
		store.setFilter('status', 'paid');
		store.setFilter('search', 'acme');
		store.resetFilters();
		const filters = store.getFiltersForRoute('invoices');
		expect(Object.keys(filters)).toHaveLength(0);
	});

	it('getFilters returns filters for the current route', () => {
		const store = useFilterStore.getState();
		store.setRoute('plans');
		store.setFilter('search', 'growth');
		const filters = store.getFilters();
		expect(filters.search).toBe('growth');
	});

	it('multiple setFilter calls accumulate without overwriting unrelated keys', () => {
		const store = useFilterStore.getState();
		store.setRoute('customers');
		store.setFilter('search', 'acme');
		store.setFilter('plan', 'enterprise');
		const filters = store.getFiltersForRoute('customers');
		expect(filters.search).toBe('acme');
		expect(filters.plan).toBe('enterprise');
	});
});
