import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { useFilterStore, useRouteFilters, computeFilterFingerprint } from './useFilterStore';
import SearchBar from '@/components/molecules/SearchBar/SearchBar';
import FlexPriceSelect from '@/components/atoms/Select/Select';
import FlexpriceTable from '@/components/molecules/Table/Table';
import type { ColumnData } from '@/components/molecules/Table/Table';
import InvoiceStatusBadge from '@/components/molecules/InvoiceStatusBadge/InvoiceStatusBadge';
import Button from '@/components/atoms/Button/Button';

/**
 * ## Challenge A — Filter Persistence (without URL bloat)
 *
 * `useFilterStore` is a Zustand-based hook that:
 * - Persists filter state per page in `sessionStorage` keyed by route
 * - Exposes `setFilter(key, value)`, `resetFilters()`, `getFilters()`
 * - Syncs only a shallow fingerprint (`_f` param) to the URL
 *
 * This story demonstrates the `DataTable` wired up to `useFilterStore`.
 */
const meta: Meta = {
	title: 'Advanced/FilterStore',
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface Invoice {
	id: string;
	customer: string;
	amount: string;
	status: string;
	date: string;
}

const ALL_INVOICES: Invoice[] = [
	{ id: 'INV-001', customer: 'Acme Corp', amount: '$2,400.00', status: 'paid', date: 'Jan 12, 2025' },
	{ id: 'INV-002', customer: 'Globex Inc', amount: '$850.00', status: 'draft', date: 'Feb 3, 2025' },
	{ id: 'INV-003', customer: 'Initech', amount: '$12,000.00', status: 'overdue', date: 'Nov 5, 2024' },
	{ id: 'INV-004', customer: 'Umbrella Ltd', amount: '$320.00', status: 'void', date: 'Mar 20, 2025' },
	{ id: 'INV-005', customer: 'Stark Industries', amount: '$48,000.00', status: 'paid', date: 'Dec 1, 2024' },
	{ id: 'INV-006', customer: 'Wayne Enterprises', amount: '$5,200.00', status: 'pending', date: 'Apr 5, 2025' },
	{ id: 'INV-007', customer: 'Oscorp', amount: '$1,100.00', status: 'draft', date: 'Apr 10, 2025' },
];

const invoiceColumns: ColumnData<Invoice>[] = [
	{ title: 'Invoice #', fieldVariant: 'title', render: (r) => <span className='font-medium'>{r.id}</span> },
	{ title: 'Customer', render: (r) => <span>{r.customer}</span> },
	{ title: 'Amount', align: 'right', render: (r) => <span className='font-medium'>{r.amount}</span> },
	{ title: 'Status', render: (r) => <InvoiceStatusBadge status={r.status} /> },
	{ title: 'Date', render: (r) => <span className='text-muted-foreground'>{r.date}</span> },
];

// ─── Demo Component ───────────────────────────────────────────────────────────

const FilterStoreDemo = () => {
	const { filters, setFilter, resetFilters } = useRouteFilters('invoices');

	// Apply filters
	const filtered = ALL_INVOICES.filter((inv) => {
		const search = (filters.search as string) ?? '';
		const status = (filters.status as string) ?? '';
		const matchesSearch =
			!search || inv.customer.toLowerCase().includes(search.toLowerCase()) || inv.id.toLowerCase().includes(search.toLowerCase());
		const matchesStatus = !status || inv.status === status;
		return matchesSearch && matchesStatus;
	});

	const fingerprint = computeFilterFingerprint(filters);

	return (
		<div className='space-y-4 p-4'>
			<div className='bg-blue-50 border border-blue-200 rounded-[6px] p-3 text-sm'>
				<p className='font-medium text-blue-800 mb-1'>Challenge A: Filter Persistence</p>
				<p className='text-blue-700 text-xs'>
					Filters are stored in <code className='bg-blue-100 px-1 rounded'>sessionStorage</code> under{' '}
					<code className='bg-blue-100 px-1 rounded'>filters:invoices</code>. Only a fingerprint is synced to the URL:{' '}
					<code className='bg-blue-100 px-1 rounded'>{fingerprint ? `?_f=${fingerprint}` : '(none)'}</code>
				</p>
			</div>

			{/* Filter Controls */}
			<div className='flex items-center gap-3 flex-wrap'>
				<SearchBar
					placeholder='Search invoices...'
					onSearch={(v) => setFilter('search', v)}
					defaultValue={(filters.search as string) ?? ''}
					className='w-56'
					debounceMs={0}
				/>
				<FlexPriceSelect
					options={[
						{ value: '', label: 'All statuses' },
						{ value: 'paid', label: 'Paid' },
						{ value: 'draft', label: 'Draft' },
						{ value: 'overdue', label: 'Overdue' },
						{ value: 'void', label: 'Void' },
						{ value: 'pending', label: 'Pending' },
					]}
					value={(filters.status as string) ?? ''}
					onChange={(v) => setFilter('status', v)}
					placeholder='Filter by status'
					className='w-44'
				/>
				<Button variant='outline' size='sm' onClick={resetFilters}>
					Reset Filters
				</Button>
			</div>

			{/* Active Filters Display */}
			{Object.keys(filters).some((k) => filters[k]) && (
				<div className='flex items-center gap-2 text-xs text-muted-foreground'>
					<span>Active filters:</span>
					{Object.entries(filters)
						.filter(([, v]) => v)
						.map(([k, v]) => (
							<span key={k} className='bg-gray-100 px-2 py-0.5 rounded-full'>
								{k}: {String(v)}
							</span>
						))}
				</div>
			)}

			{/* Table */}
			<FlexpriceTable columns={invoiceColumns} data={filtered} showEmptyRow />

			{/* State Inspector */}
			<details className='text-xs'>
				<summary className='cursor-pointer text-muted-foreground hover:text-foreground'>Inspect filter state (sessionStorage)</summary>
				<pre className='mt-2 bg-gray-50 border border-gray-200 rounded p-3 overflow-auto'>
					{JSON.stringify({ route: 'invoices', filters, fingerprint }, null, 2)}
				</pre>
			</details>
		</div>
	);
};

export const FilterPersistenceDemo: Story = {
	render: () => <FilterStoreDemo />,
};

// ─── Multi-route demo ─────────────────────────────────────────────────────────

const MultiRouteDemo = () => {
	const store = useFilterStore();

	useEffect(() => {
		// Pre-populate some filters for demo
		store.setRoute('customers');
		store.setFilter('search', 'acme');
		store.setRoute('invoices');
		store.setFilter('status', 'paid');
	}, []);

	return (
		<div className='space-y-4 p-4'>
			<p className='text-sm text-muted-foreground'>Each route maintains independent filter state in sessionStorage.</p>
			<div className='grid grid-cols-2 gap-4'>
				{['invoices', 'customers', 'subscriptions'].map((route) => {
					const routeFilters = store.getFiltersForRoute(route);
					return (
						<div key={route} className='bg-white border border-[#E5E7EB] rounded-[6px] p-3'>
							<p className='text-xs font-medium text-foreground mb-2'>
								<code>filters:{route}</code>
							</p>
							<pre className='text-xs text-muted-foreground bg-gray-50 p-2 rounded'>{JSON.stringify(routeFilters, null, 2) || '{}'}</pre>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export const MultiRouteFilterState: Story = {
	render: () => <MultiRouteDemo />,
};
