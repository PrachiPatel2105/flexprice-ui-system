import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { QUERY_PRESETS, GLOBAL_QUERY_DEFAULTS, realtimeQuery, staticQuery, defaultQuery } from './queryConfig';
import Spinner from '@/components/atoms/Spinner/Spinner';
import Chip from '@/components/atoms/Chip/Chip';

/**
 * ## Challenge C — Configurable TanStack Query Caching
 *
 * `createQueryConfig` provides a consistent caching strategy across FlexPrice.
 *
 * ### Presets
 * | Preset | staleTime | gcTime | Use case |
 * |--------|-----------|--------|----------|
 * | REALTIME | 0 | 0 | Events debugger, live metrics |
 * | DEFAULT | 5 min | 10 min | Customers, Invoices, Subscriptions |
 * | STATIC | 30 min | 60 min | Plan definitions, feature lists |
 */
const meta: Meta = {
	title: 'Advanced/QueryConfig',
	tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// ─── Preset Documentation ─────────────────────────────────────────────────────

export const PresetDocumentation: Story = {
	render: () => (
		<div className='space-y-4 p-4 max-w-2xl'>
			<div className='bg-blue-50 border border-blue-200 rounded-[6px] p-4'>
				<h3 className='font-semibold text-blue-900 mb-2'>Challenge C: Configurable TanStack Query Caching</h3>
				<p className='text-sm text-blue-800'>
					<code className='bg-blue-100 px-1 rounded'>createQueryConfig</code> wraps TanStack Query options with FlexPrice-specific caching
					defaults. Global defaults: staleTime <strong>{GLOBAL_QUERY_DEFAULTS.staleTime / 1000 / 60}min</strong>, gcTime{' '}
					<strong>{GLOBAL_QUERY_DEFAULTS.gcTime / 1000 / 60}min</strong>.
				</p>
			</div>

			<div className='rounded-[6px] border border-[#E2E8F0] overflow-hidden'>
				<table className='w-full text-sm'>
					<thead className='bg-muted border-b border-[#E2E8F0]'>
						<tr>
							<th className='px-4 py-3 text-left font-medium text-[#64748B]'>Preset</th>
							<th className='px-4 py-3 text-left font-medium text-[#64748B]'>staleTime</th>
							<th className='px-4 py-3 text-left font-medium text-[#64748B]'>gcTime</th>
							<th className='px-4 py-3 text-left font-medium text-[#64748B]'>Use Case</th>
						</tr>
					</thead>
					<tbody>
						{Object.values(QUERY_PRESETS).map((preset) => (
							<tr key={preset.label} className='border-b border-[#E2E8F0] hover:bg-muted/50'>
								<td className='px-4 py-3'>
									<Chip
										label={preset.label}
										variant={preset.label === 'REALTIME' ? 'failed' : preset.label === 'STATIC' ? 'success' : 'info'}
									/>
								</td>
								<td className='px-4 py-3 font-mono text-xs'>
									{preset.staleTime === 0 ? '0 (always fresh)' : `${preset.staleTime / 1000 / 60} min`}
								</td>
								<td className='px-4 py-3 font-mono text-xs'>{preset.gcTime === 0 ? '0 (no cache)' : `${preset.gcTime / 1000 / 60} min`}</td>
								<td className='px-4 py-3 text-muted-foreground text-xs'>{preset.description}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className='space-y-3'>
				<h4 className='text-sm font-semibold'>Usage Examples</h4>
				<pre className='bg-gray-50 border border-gray-200 rounded-[6px] p-4 text-xs overflow-auto'>
					{`// Default caching (5 min stale)
useQuery(createQueryConfig({
  queryKey: ['invoices'],
  queryFn: fetchInvoices,
}))

// Real-time (no cache) — for events debugger
useQuery(realtimeQuery({
  queryKey: ['events'],
  queryFn: fetchEvents,
}))

// Static (30 min) — for plan definitions
useQuery(staticQuery({
  queryKey: ['plans'],
  queryFn: fetchPlans,
}))

// Per-call override
useQuery(createQueryConfig(
  { queryKey: ['customers'], queryFn: fetchCustomers },
  QUERY_PRESETS.DEFAULT,
  { staleTime: 0 }  // override to real-time for this call
))`}
				</pre>
			</div>
		</div>
	),
};

// ─── Live Demo ────────────────────────────────────────────────────────────────

const mockFetch = async (delay: number, label: string) => {
	await new Promise((r) => setTimeout(r, delay));
	return { data: `${label} data`, fetchedAt: new Date().toLocaleTimeString() };
};

const createClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				...GLOBAL_QUERY_DEFAULTS,
			},
		},
	});

const QueryDemo = ({ preset }: { preset: 'REALTIME' | 'DEFAULT' | 'STATIC' }) => {
	const [refetchCount, setRefetchCount] = useState(0);

	const config =
		preset === 'REALTIME'
			? realtimeQuery({ queryKey: ['demo', preset, refetchCount], queryFn: () => mockFetch(500, preset) })
			: preset === 'STATIC'
				? staticQuery({ queryKey: ['demo', preset], queryFn: () => mockFetch(500, preset) })
				: defaultQuery({ queryKey: ['demo', preset], queryFn: () => mockFetch(500, preset) });

	const { data, isFetching, dataUpdatedAt } = useQuery(config);

	const presetConfig = QUERY_PRESETS[preset];

	return (
		<div className='bg-white border border-[#E5E7EB] rounded-[6px] p-4 space-y-3'>
			<div className='flex items-center justify-between'>
				<Chip label={preset} variant={preset === 'REALTIME' ? 'failed' : preset === 'STATIC' ? 'success' : 'info'} />
				{isFetching && <Spinner size={14} />}
			</div>
			<div className='text-xs space-y-1 text-muted-foreground'>
				<p>staleTime: {presetConfig.staleTime === 0 ? '0ms (always stale)' : `${presetConfig.staleTime / 1000}s`}</p>
				<p>gcTime: {presetConfig.gcTime === 0 ? '0ms (no cache)' : `${presetConfig.gcTime / 1000}s`}</p>
			</div>
			{data && (
				<div className='text-xs bg-gray-50 rounded p-2'>
					<p className='font-medium'>{data.data}</p>
					<p className='text-muted-foreground'>Fetched at: {data.fetchedAt}</p>
					{dataUpdatedAt > 0 && <p className='text-muted-foreground'>Last updated: {new Date(dataUpdatedAt).toLocaleTimeString()}</p>}
				</div>
			)}
			<button
				onClick={() => setRefetchCount((c) => c + 1)}
				className='text-xs px-3 py-1.5 border border-gray-200 rounded-[6px] hover:bg-gray-50 w-full'>
				Trigger Refetch
			</button>
		</div>
	);
};

const queryClient = createClient();

export const LiveCachingDemo: Story = {
	render: () => (
		<QueryClientProvider client={queryClient}>
			<div className='space-y-4 p-4'>
				<p className='text-sm text-muted-foreground'>
					Each card uses a different caching preset. Click "Trigger Refetch" to see how each preset behaves.
				</p>
				<div className='grid grid-cols-3 gap-4'>
					<QueryDemo preset='REALTIME' />
					<QueryDemo preset='DEFAULT' />
					<QueryDemo preset='STATIC' />
				</div>
			</div>
		</QueryClientProvider>
	),
};
