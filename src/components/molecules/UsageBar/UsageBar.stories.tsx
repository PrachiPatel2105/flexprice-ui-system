import type { Meta, StoryObj } from '@storybook/react';
import UsageBar from './UsageBar';

/**
 * `UsageBar` / `MeterProgress` shows a labelled progress bar indicating
 * used vs. entitled units for a feature or meter.
 */
const meta: Meta<typeof UsageBar> = {
	title: 'Molecules/UsageBar',
	component: UsageBar,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Labelled progress bar showing used vs. entitled units for a feature or meter. Used on subscription detail pages and the customer portal. Colour changes from navy → orange → red as usage approaches and exceeds the limit.',
			},
		},
	},
	argTypes: {
		label: { control: 'text' },
		used: { control: 'number' },
		total: { control: 'number' },
		unit: { control: 'text' },
		showUsageText: { control: 'boolean' },
	},
	args: {
		label: 'API Calls',
		used: 6500,
		total: 10000,
		unit: 'calls',
		showUsageText: true,
	},
};

export default meta;
type Story = StoryObj<typeof UsageBar>;

export const Default: Story = {};

export const LowUsage: Story = {
	args: { label: 'Storage', used: 2, total: 100, unit: 'GB' },
};

export const MediumUsage: Story = {
	args: { label: 'API Calls', used: 6500, total: 10000, unit: 'calls' },
};

export const HighUsage: Story = {
	args: { label: 'Seats', used: 9, total: 10, unit: 'seats' },
};

export const CriticalUsage: Story = {
	args: { label: 'Events', used: 9800, total: 10000, unit: 'events' },
};

export const OverLimit: Story = {
	args: { label: 'Compute Hours', used: 1200, total: 1000, unit: 'hrs' },
};

export const ZeroUsage: Story = {
	args: { label: 'SMS Messages', used: 0, total: 500, unit: 'msgs' },
};

export const LargeNumbers: Story = {
	args: { label: 'Data Processed', used: 2_500_000, total: 5_000_000, unit: 'events' },
};

export const SubscriptionUsagePanel: Story = {
	render: () => (
		<div className='bg-white border border-[#E5E7EB] rounded-[6px] p-6 space-y-5 max-w-md'>
			<h3 className='text-sm font-semibold text-foreground'>Feature Usage</h3>
			<UsageBar label='API Calls' used={6500} total={10000} unit='calls' />
			<UsageBar label='Storage' used={45} total={100} unit='GB' />
			<UsageBar label='Team Seats' used={9} total={10} unit='seats' />
			<UsageBar label='Webhooks' used={980} total={1000} unit='events' />
			<UsageBar label='Exports' used={0} total={50} unit='exports' />
		</div>
	),
};
