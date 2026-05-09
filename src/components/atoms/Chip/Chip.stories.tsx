import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { CheckCircle, XCircle, AlertCircle, Info as InfoIcon } from 'lucide-react';
import Chip from './Chip';

/**
 * `Chip` / `StatusChip` is used throughout FlexPrice to display status labels
 * for plans, invoices, subscriptions, and other entities.
 *
 * ## Props
 * - `variant` — `default` | `success` | `warning` | `failed` | `info`
 * - `label` — text content of the chip
 * - `icon` — optional leading icon
 * - `onClick` — makes the chip interactive
 * - `disabled` — disables click interaction
 */
const meta: Meta<typeof Chip> = {
	title: 'Atoms/Chip',
	component: Chip,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'`Chip` / `StatusChip` displays status labels for plans (active, archived, draft), invoices (paid, draft, void, overdue), and subscriptions (active, cancelled, paused, trialing). Supports optional icons and click interaction.',
			},
		},
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'success', 'warning', 'failed', 'info'],
			description: 'Color scheme variant',
		},
		label: { control: 'text', description: 'Chip label text' },
		disabled: { control: 'boolean' },
	},
	args: {
		label: 'Active',
		variant: 'success',
	},
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
	args: { label: 'Default', variant: 'default' },
};

export const Success: Story = {
	args: { label: 'Active', variant: 'success' },
};

export const Warning: Story = {
	args: { label: 'Pending', variant: 'warning' },
};

export const Failed: Story = {
	args: { label: 'Failed', variant: 'failed' },
};

export const InfoVariant: Story = {
	args: { label: 'Upcoming', variant: 'info' },
};

export const Disabled: Story = {
	args: { label: 'Disabled', variant: 'default', disabled: true },
};

export const WithIcon: Story = {
	args: {
		label: 'Active',
		variant: 'success',
		icon: <CheckCircle size={12} />,
	},
};

export const PlanStatuses: Story = {
	render: () => (
		<div className='flex flex-wrap gap-2 p-4'>
			<Chip label='Active' variant='success' />
			<Chip label='Archived' variant='default' />
			<Chip label='Draft' variant='info' />
		</div>
	),
};

export const InvoiceStatuses: Story = {
	render: () => (
		<div className='flex flex-wrap gap-2 p-4'>
			<Chip label='Paid' variant='success' icon={<CheckCircle size={12} />} />
			<Chip label='Draft' variant='default' />
			<Chip label='Void' variant='failed' icon={<XCircle size={12} />} />
			<Chip label='Overdue' variant='warning' icon={<AlertCircle size={12} />} />
			<Chip label='Pending' variant='info' icon={<InfoIcon size={12} />} />
		</div>
	),
};

export const SubscriptionStatuses: Story = {
	render: () => (
		<div className='flex flex-wrap gap-2 p-4'>
			<Chip label='Active' variant='success' />
			<Chip label='Cancelled' variant='failed' />
			<Chip label='Paused' variant='warning' />
			<Chip label='Trialing' variant='info' />
			<Chip label='Expired' variant='default' />
		</div>
	),
};

export const Clickable: Story = {
	args: {
		label: 'Click me',
		variant: 'info',
		onClick: () => alert('Chip clicked!'),
	},
};

export const InteractionTest: Story = {
	args: { label: 'Clickable Chip', variant: 'success' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const chip = canvas.getByText('Clickable Chip');
		await expect(chip).toBeInTheDocument();
		await userEvent.click(chip);
	},
};
