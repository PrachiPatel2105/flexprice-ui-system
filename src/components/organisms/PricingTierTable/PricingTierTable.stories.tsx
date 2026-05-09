import type { Meta, StoryObj } from '@storybook/react';
import PricingTierTable from './PricingTierTable';
import type { PricingTier } from './PricingTierTable';

/**
 * `PricingTierTable` displays tiered or graduated pricing in a readable table.
 * Used on Plan detail pages to show how charges are calculated at different usage levels.
 */
const meta: Meta<typeof PricingTierTable> = {
	title: 'Organisms/PricingTierTable',
	component: PricingTierTable,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Displays tiered or graduated pricing in a readable table on Plan detail pages. Supports four pricing models: `tiered` (each unit priced at its tier rate), `volume` (all units at the rate of the highest tier reached), `graduated`, and `package`. Supports multi-currency and optional flat fee column.',
			},
		},
	},
	argTypes: {
		mode: {
			control: 'select',
			options: ['tiered', 'volume', 'graduated', 'package'],
		},
		currencySymbol: { control: 'text' },
		showFlatFee: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof PricingTierTable>;

const apiCallTiers: PricingTier[] = [
	{ from: 0, to: 1000, unitPrice: 0 },
	{ from: 1001, to: 10000, unitPrice: 0.001 },
	{ from: 10001, to: 100000, unitPrice: 0.0008 },
	{ from: 100001, to: null, unitPrice: 0.0005 },
];

const storageTiers: PricingTier[] = [
	{ from: 0, to: 10, unitPrice: 0 },
	{ from: 11, to: 100, unitPrice: 0.023 },
	{ from: 101, to: 1000, unitPrice: 0.018 },
	{ from: 1001, to: null, unitPrice: 0.012 },
];

const seatTiers: PricingTier[] = [
	{ from: 1, to: 5, unitPrice: 20, flatFee: 0 },
	{ from: 6, to: 20, unitPrice: 15, flatFee: 0 },
	{ from: 21, to: 100, unitPrice: 10, flatFee: 0 },
	{ from: 101, to: null, unitPrice: 8, flatFee: 0 },
];

export const Default: Story = {
	args: {
		tiers: apiCallTiers,
		mode: 'tiered',
	},
};

export const TieredPricing: Story = {
	args: {
		tiers: apiCallTiers,
		mode: 'tiered',
		currencySymbol: '$',
	},
};

export const VolumePricing: Story = {
	args: {
		tiers: storageTiers,
		mode: 'volume',
		currencySymbol: '$',
	},
};

export const GraduatedPricing: Story = {
	args: {
		tiers: apiCallTiers,
		mode: 'graduated',
	},
};

export const SeatBasedPricing: Story = {
	args: {
		tiers: seatTiers,
		mode: 'tiered',
		showFlatFee: true,
	},
};

export const EuroCurrency: Story = {
	args: {
		tiers: storageTiers,
		mode: 'volume',
		currencySymbol: '€',
	},
};

export const PlanDetailView: Story = {
	render: () => (
		<div className='space-y-6 max-w-lg p-4'>
			<div>
				<h3 className='text-sm font-semibold text-foreground mb-2'>API Calls</h3>
				<PricingTierTable tiers={apiCallTiers} mode='tiered' />
			</div>
			<div>
				<h3 className='text-sm font-semibold text-foreground mb-2'>Storage (GB)</h3>
				<PricingTierTable tiers={storageTiers} mode='volume' />
			</div>
			<div>
				<h3 className='text-sm font-semibold text-foreground mb-2'>Team Seats</h3>
				<PricingTierTable tiers={seatTiers} mode='tiered' showFlatFee />
			</div>
		</div>
	),
};
