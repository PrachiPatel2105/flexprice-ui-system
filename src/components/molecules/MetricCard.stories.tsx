import type { Meta, StoryObj } from '@storybook/react';
import MetricCard from './MetricCard';

/**
 * `MetricCard` displays a KPI metric on the FlexPrice dashboard.
 * Shows a title, formatted value (currency or percentage), and an optional trend indicator.
 *
 * ## Props
 * - `title` — label for the metric
 * - `value` — numeric value to display
 * - `currency` — ISO currency code (e.g. `"USD"`) — formats value with symbol
 * - `isPercent` — formats value as a percentage
 * - `showChangeIndicator` — shows a trending arrow
 * - `isNegative` — controls arrow direction and color (red = down, green = up)
 */
const meta: Meta<typeof MetricCard> = {
	title: 'Molecules/MetricCard',
	component: MetricCard,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'KPI card displayed on the FlexPrice dashboard. Shows a metric title, formatted value (currency or percentage), and an optional trending arrow indicator. Used for Monthly Revenue, Active Subscriptions, Churn Rate, and similar metrics.',
			},
		},
	},
	argTypes: {
		title: { control: 'text' },
		value: { control: 'number' },
		currency: { control: 'text' },
		isPercent: { control: 'boolean' },
		showChangeIndicator: { control: 'boolean' },
		isNegative: { control: 'boolean' },
	},
	args: {
		title: 'Total Revenue',
		value: 48250.75,
		currency: 'USD',
		showChangeIndicator: false,
		isNegative: false,
	},
};

export default meta;
type Story = StoryObj<typeof MetricCard>;

export const Default: Story = {};

export const Revenue: Story = {
	args: {
		title: 'Monthly Revenue',
		value: 48250.75,
		currency: 'USD',
		showChangeIndicator: true,
		isNegative: false,
	},
};

export const TrendingDown: Story = {
	args: {
		title: 'Churn Rate',
		value: 3.2,
		isPercent: true,
		showChangeIndicator: true,
		isNegative: true,
	},
};

export const TrendingUp: Story = {
	args: {
		title: 'MRR Growth',
		value: 12.5,
		isPercent: true,
		showChangeIndicator: true,
		isNegative: false,
	},
};

export const ActiveSubscriptions: Story = {
	args: {
		title: 'Active Subscriptions',
		value: 1284,
		showChangeIndicator: true,
		isNegative: false,
	},
};

export const DashboardGrid: Story = {
	render: () => (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4'>
			<MetricCard title='Monthly Revenue' value={48250.75} currency='USD' showChangeIndicator isNegative={false} />
			<MetricCard title='Active Subscriptions' value={1284} showChangeIndicator isNegative={false} />
			<MetricCard title='Churn Rate' value={3.2} isPercent showChangeIndicator isNegative />
			<MetricCard title='Avg Revenue / User' value={37.58} currency='USD' showChangeIndicator isNegative={false} />
		</div>
	),
};

export const ZeroValue: Story = {
	args: {
		title: 'Overdue Invoices',
		value: 0,
		currency: 'USD',
	},
};