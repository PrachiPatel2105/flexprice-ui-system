import type { Meta, StoryObj } from '@storybook/react';
import InvoiceStatusBadge from './InvoiceStatusBadge';
import type { InvoiceStatus } from './InvoiceStatusBadge';

/**
 * `InvoiceStatusBadge` maps invoice status strings to coloured chips with icons.
 * Used in the Invoices table and invoice detail pages throughout FlexPrice.
 */
const meta: Meta<typeof InvoiceStatusBadge> = {
	title: 'Molecules/InvoiceStatusBadge',
	component: InvoiceStatusBadge,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Maps invoice status strings to colour-coded chips with icons. Covers all FlexPrice invoice states: `paid` (green), `draft` (grey), `void` (red), `overdue` (orange), `pending` (blue), `finalized` (blue). Unknown statuses render as plain grey chips.',
			},
		},
	},
	argTypes: {
		status: {
			control: 'select',
			options: ['paid', 'draft', 'void', 'overdue', 'pending', 'finalized'],
		},
		showIcon: { control: 'boolean' },
	},
	args: {
		status: 'paid',
		showIcon: true,
	},
};

export default meta;
type Story = StoryObj<typeof InvoiceStatusBadge>;

export const Paid: Story = { args: { status: 'paid' } };
export const Draft: Story = { args: { status: 'draft' } };
export const Void: Story = { args: { status: 'void' } };
export const Overdue: Story = { args: { status: 'overdue' } };
export const Pending: Story = { args: { status: 'pending' } };
export const Finalized: Story = { args: { status: 'finalized' } };

export const WithoutIcon: Story = {
	args: { status: 'paid', showIcon: false },
};

export const AllStatuses: Story = {
	render: () => (
		<div className='flex flex-wrap gap-3 p-4'>
			{(['paid', 'draft', 'void', 'overdue', 'pending', 'finalized'] as InvoiceStatus[]).map((status) => (
				<InvoiceStatusBadge key={status} status={status} />
			))}
		</div>
	),
};

export const InTable: Story = {
	render: () => (
		<div className='rounded-[6px] border border-[#E2E8F0] overflow-hidden'>
			<table className='w-full text-sm'>
				<thead className='bg-muted border-b border-[#E2E8F0]'>
					<tr>
						<th className='px-4 py-3 text-left font-medium text-[#64748B]'>Invoice #</th>
						<th className='px-4 py-3 text-left font-medium text-[#64748B]'>Customer</th>
						<th className='px-4 py-3 text-left font-medium text-[#64748B]'>Amount</th>
						<th className='px-4 py-3 text-left font-medium text-[#64748B]'>Status</th>
					</tr>
				</thead>
				<tbody>
					{[
						{ id: 'INV-001', customer: 'Acme Corp', amount: '$2,400.00', status: 'paid' },
						{ id: 'INV-002', customer: 'Globex Inc', amount: '$850.00', status: 'draft' },
						{ id: 'INV-003', customer: 'Initech', amount: '$12,000.00', status: 'overdue' },
						{ id: 'INV-004', customer: 'Umbrella Ltd', amount: '$320.00', status: 'void' },
					].map((row) => (
						<tr key={row.id} className='border-b border-[#E2E8F0] hover:bg-muted/50'>
							<td className='px-4 py-3 font-medium'>{row.id}</td>
							<td className='px-4 py-3 text-muted-foreground'>{row.customer}</td>
							<td className='px-4 py-3 font-medium'>{row.amount}</td>
							<td className='px-4 py-3'>
								<InvoiceStatusBadge status={row.status as InvoiceStatus} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	),
};
