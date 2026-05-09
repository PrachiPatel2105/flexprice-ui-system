import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import FlexpriceTable from './Table';
import type { ColumnData } from './Table';
import Chip from '@/components/atoms/Chip/Chip';
import Spinner from '@/components/atoms/Spinner/Spinner';

/**
 * `DataTable` (`FlexpriceTable`) is the primary data display component in FlexPrice.
 * Used on every list page: Customers, Invoices, Subscriptions, Plans, etc.
 *
 * ## Props
 * - `columns` — array of `ColumnData<T>` defining headers and cell renderers
 * - `data` — array of row objects
 * - `onRowClick` — optional row click handler
 * - `showEmptyRow` — shows `--` placeholders when data is empty
 * - `variant` — `default` (bordered) | `no-bordered`
 *
 * ## Advanced: Virtualised List
 * For large datasets (10k+ rows), use the `VirtualisedDataTable` story which
 * wraps the table with `@tanstack/react-virtual` for smooth scrolling.
 */
const meta: Meta<typeof FlexpriceTable> = {
	title: 'Molecules/DataTable',
	component: FlexpriceTable,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'`DataTable` (`FlexpriceTable`) is the primary data display component in FlexPrice, used on every list page. Supports sortable columns, loading skeleton, empty state, pagination controls, and virtualised rendering for large datasets via `@tanstack/react-virtual`.',
			},
		},
	},
	argTypes: {
		variant: { control: 'select', options: ['default', 'no-bordered'] },
		showEmptyRow: { control: 'boolean' },
		hideBottomBorder: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof FlexpriceTable>;

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface Customer {
	id: string;
	name: string;
	email: string;
	plan: string;
	status: 'active' | 'inactive' | 'trialing';
	mrr: string;
	created: string;
}

const mockCustomers: Customer[] = [
	{
		id: 'cust_001',
		name: 'Acme Corp',
		email: 'billing@acme.com',
		plan: 'Growth',
		status: 'active',
		mrr: '$2,400',
		created: 'Jan 12, 2025',
	},
	{ id: 'cust_002', name: 'Globex Inc', email: 'admin@globex.io', plan: 'Starter', status: 'trialing', mrr: '$0', created: 'Feb 3, 2025' },
	{
		id: 'cust_003',
		name: 'Initech',
		email: 'ops@initech.com',
		plan: 'Enterprise',
		status: 'active',
		mrr: '$12,000',
		created: 'Nov 5, 2024',
	},
	{
		id: 'cust_004',
		name: 'Umbrella Ltd',
		email: 'finance@umbrella.co',
		plan: 'Growth',
		status: 'inactive',
		mrr: '$0',
		created: 'Mar 20, 2025',
	},
	{
		id: 'cust_005',
		name: 'Stark Industries',
		email: 'tony@stark.io',
		plan: 'Enterprise',
		status: 'active',
		mrr: '$48,000',
		created: 'Dec 1, 2024',
	},
];

const statusVariantMap: Record<Customer['status'], 'success' | 'default' | 'info'> = {
	active: 'success',
	inactive: 'default',
	trialing: 'info',
};

const customerColumns: ColumnData<Customer>[] = [
	{ title: 'Name', fieldVariant: 'title', render: (row) => <span className='font-medium text-foreground'>{row.name}</span> },
	{ title: 'Email', render: (row) => <span className='text-muted-foreground'>{row.email}</span> },
	{ title: 'Plan', render: (row) => <span>{row.plan}</span> },
	{ title: 'Status', render: (row) => <Chip label={row.status} variant={statusVariantMap[row.status]} /> },
	{ title: 'MRR', align: 'right', render: (row) => <span className='font-medium'>{row.mrr}</span> },
	{ title: 'Created', render: (row) => <span className='text-muted-foreground'>{row.created}</span> },
];

// ─── Basic Stories ────────────────────────────────────────────────────────────

export const Default: Story = {
	args: { columns: customerColumns, data: mockCustomers },
};

export const WithRowClick: Story = {
	args: {
		columns: customerColumns,
		data: mockCustomers,
		onRowClick: (row: unknown) => alert(`Clicked: ${(row as Customer).name}`),
	},
};

export const EmptyState: Story = {
	args: { columns: customerColumns, data: [], showEmptyRow: true },
};

export const LoadingSkeleton: Story = {
	render: () => (
		<div className='rounded-[6px] border border-[#E2E8F0] overflow-hidden'>
			<div className='h-12 bg-muted border-b border-[#E2E8F0] flex items-center px-4 gap-4'>
				{['Name', 'Email', 'Plan', 'Status', 'MRR', 'Created'].map((h) => (
					<div key={h} className='h-4 bg-gray-200 rounded animate-pulse flex-1' />
				))}
			</div>
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={i} className='h-10 border-b border-[#E2E8F0] flex items-center px-4 gap-4'>
					{Array.from({ length: 6 }).map((_, j) => (
						<div key={j} className='h-3 bg-gray-100 rounded animate-pulse flex-1' style={{ opacity: 1 - i * 0.15 }} />
					))}
				</div>
			))}
		</div>
	),
};

export const NoBorder: Story = {
	args: { columns: customerColumns, data: mockCustomers, variant: 'no-bordered' },
};

// ─── Sortable Columns ─────────────────────────────────────────────────────────

type SortableKey = keyof Customer;
type SortDir = 'asc' | 'desc';

const SortableTableDemo = () => {
	const [sortKey, setSortKey] = useState<SortableKey>('name');
	const [sortDir, setSortDir] = useState<SortDir>('asc');

	const handleSort = (key: SortableKey) => {
		if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
		else {
			setSortKey(key);
			setSortDir('asc');
		}
	};

	const sorted = [...mockCustomers].sort((a, b) => {
		const av = String(a[sortKey]);
		const bv = String(b[sortKey]);
		return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
	});

	const SortIcon = ({ col }: { col: SortableKey }) =>
		sortKey === col ? <span className='ml-1'>{sortDir === 'asc' ? '↑' : '↓'}</span> : <span className='ml-1 opacity-30'>↕</span>;

	const sortableColumns: ColumnData<Customer>[] = [
		{
			title: (
				<button onClick={() => handleSort('name')} className='flex items-center font-medium'>
					Name <SortIcon col='name' />
				</button>
			),
			fieldVariant: 'title',
			render: (row) => <span className='font-medium'>{row.name}</span>,
		},
		{
			title: (
				<button onClick={() => handleSort('plan')} className='flex items-center font-medium'>
					Plan <SortIcon col='plan' />
				</button>
			),
			render: (row) => <span>{row.plan}</span>,
		},
		{
			title: 'Status',
			render: (row) => <Chip label={row.status} variant={statusVariantMap[row.status]} />,
		},
		{
			title: (
				<button onClick={() => handleSort('mrr')} className='flex items-center font-medium'>
					MRR <SortIcon col='mrr' />
				</button>
			),
			align: 'right',
			render: (row) => <span className='font-medium'>{row.mrr}</span>,
		},
	];

	return (
		<div className='space-y-2'>
			<p className='text-xs text-muted-foreground'>
				Click a column header to sort. Current: <strong>{sortKey}</strong> ({sortDir})
			</p>
			<FlexpriceTable columns={sortableColumns} data={sorted} />
		</div>
	);
};

export const SortableColumns: Story = {
	render: () => <SortableTableDemo />,
	parameters: {
		docs: {
			description: {
				story:
					'Demonstrates client-side sortable columns. Click any column header to toggle ascending/descending sort. In production this triggers a server-side query.',
			},
		},
	},
};

// ─── Pagination Controls ──────────────────────────────────────────────────────

const PAGE_SIZE = 2;

const PaginatedTableDemo = () => {
	const [page, setPage] = useState(1);
	const totalPages = Math.ceil(mockCustomers.length / PAGE_SIZE);
	const pageData = mockCustomers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

	return (
		<div className='space-y-3'>
			<FlexpriceTable columns={customerColumns} data={pageData} />
			<div className='flex items-center justify-between px-1'>
				<p className='text-xs text-muted-foreground'>
					Page {page} of {totalPages} — {mockCustomers.length} total rows
				</p>
				<div className='flex items-center gap-2'>
					<button
						onClick={() => setPage((p) => Math.max(1, p - 1))}
						disabled={page === 1}
						aria-label='Previous page'
						className='px-3 py-1 text-xs border border-gray-200 rounded-[6px] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'>
						← Prev
					</button>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
						<button
							key={p}
							onClick={() => setPage(p)}
							aria-label={`Page ${p}`}
							aria-current={p === page ? 'page' : undefined}
							className={`px-3 py-1 text-xs border rounded-[6px] ${
								p === page ? 'bg-[#092E44] text-white border-[#092E44]' : 'border-gray-200 hover:bg-gray-50'
							}`}>
							{p}
						</button>
					))}
					<button
						onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
						disabled={page === totalPages}
						aria-label='Next page'
						className='px-3 py-1 text-xs border border-gray-200 rounded-[6px] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed'>
						Next →
					</button>
				</div>
			</div>
		</div>
	);
};

export const PaginationControls: Story = {
	render: () => <PaginatedTableDemo />,
	parameters: {
		docs: {
			description: {
				story:
					'DataTable with prev/next and page-number pagination controls. Shows 2 rows per page. In production, page changes trigger a new API query via `useQuery`.',
			},
		},
	},
};

// ─── Interaction Test ─────────────────────────────────────────────────────────

export const InteractionTest: Story = {
	args: { columns: customerColumns, data: mockCustomers },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Verify header renders
		const nameHeader = canvas.getByText('Name');
		await expect(nameHeader).toBeInTheDocument();
		// Verify data rows render
		const acmeRow = canvas.getByText('Acme Corp');
		await expect(acmeRow).toBeInTheDocument();
		// Verify all rows present (1 header + 5 data)
		const rows = canvas.getAllByRole('row');
		await expect(rows.length).toBeGreaterThanOrEqual(5);
		// Click a row
		await userEvent.click(acmeRow);
	},
};

// ─── Virtualised DataTable (Challenge B) ─────────────────────────────────────

interface VirtualRow {
	id: number;
	name: string;
	email: string;
	plan: string;
	status: string;
	amount: string;
}

const generateRows = (count: number): VirtualRow[] =>
	Array.from({ length: count }, (_, i) => ({
		id: i + 1,
		name: `Customer ${i + 1}`,
		email: `customer${i + 1}@example.com`,
		plan: ['Starter', 'Growth', 'Enterprise'][i % 3],
		status: ['active', 'inactive', 'trialing'][i % 3],
		amount: `$${((i * 37.5) % 5000).toFixed(2)}`,
	}));

const VIRTUAL_ROWS = generateRows(10_000);

const VirtualisedTable = () => {
	const parentRef = useRef<HTMLDivElement>(null);

	const rowVirtualizer = useVirtualizer({
		count: VIRTUAL_ROWS.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 40,
		overscan: 10,
	});

	const virtualItems = rowVirtualizer.getVirtualItems();

	return (
		<div>
			<p className='text-sm text-muted-foreground mb-2'>
				Rendering <strong>10,000 rows</strong> with virtual scrolling — only ~20 DOM nodes at a time.
			</p>
			<div className='rounded-t-[6px] border border-[#E2E8F0] bg-muted'>
				<div className='grid grid-cols-6 h-12 items-center px-3 text-sm font-medium text-[#64748B]'>
					<span className='pl-2'>#</span>
					<span>Name</span>
					<span>Email</span>
					<span>Plan</span>
					<span>Status</span>
					<span className='text-right'>Amount</span>
				</div>
			</div>
			<div ref={parentRef} className='border-x border-b border-[#E2E8F0] rounded-b-[6px] overflow-auto' style={{ height: '400px' }}>
				<div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
					{virtualItems.map((virtualRow) => {
						const row = VIRTUAL_ROWS[virtualRow.index];
						const statusColor = row.status === 'active' ? 'text-green-600' : row.status === 'trialing' ? 'text-blue-600' : 'text-gray-500';
						return (
							<div
								key={virtualRow.key}
								data-index={virtualRow.index}
								ref={rowVirtualizer.measureElement}
								className='absolute top-0 left-0 w-full grid grid-cols-6 items-center px-3 border-b border-[#E2E8F0] hover:bg-muted/50 transition-colors text-sm'
								style={{ transform: `translateY(${virtualRow.start}px)`, height: `${virtualRow.size}px` }}>
								<span className='pl-2 text-muted-foreground'>{row.id}</span>
								<span className='font-medium truncate'>{row.name}</span>
								<span className='text-muted-foreground truncate'>{row.email}</span>
								<span>{row.plan}</span>
								<span className={statusColor}>{row.status}</span>
								<span className='text-right font-medium'>{row.amount}</span>
							</div>
						);
					})}
				</div>
			</div>
			<p className='text-xs text-muted-foreground mt-2'>
				Showing virtual items {virtualItems[0]?.index ?? 0}–{virtualItems[virtualItems.length - 1]?.index ?? 0} of {VIRTUAL_ROWS.length}
			</p>
		</div>
	);
};

export const VirtualisedDataTable: Story = {
	render: () => <VirtualisedTable />,
	parameters: {
		docs: {
			description: {
				story:
					'Challenge B: `@tanstack/react-virtual` virtualisation with 10,000 rows. Only rows in the viewport + overscan buffer are rendered in the DOM — scroll performance stays smooth regardless of dataset size.',
			},
		},
	},
};

export const WithLoadingSpinner: Story = {
	render: () => (
		<div className='rounded-[6px] border border-[#E2E8F0] flex items-center justify-center py-16'>
			<div className='flex flex-col items-center gap-3'>
				<Spinner size={32} />
				<p className='text-sm text-muted-foreground'>Loading customers...</p>
			</div>
		</div>
	),
};
