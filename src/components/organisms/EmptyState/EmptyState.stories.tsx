import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { FileText, Users, CreditCard, BarChart3, Zap } from 'lucide-react';
import EmptyState from './EmptyState';

/**
 * `EmptyState` is a full-page empty state component shown when a list has no data.
 */
const meta: Meta<typeof EmptyState> = {
	title: 'Organisms/EmptyState',
	component: EmptyState,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Full-page empty state shown when a list has no data. Used on Customers, Invoices, Plans, Events, and other list pages. Accepts an optional icon, headline, supporting subtext, and up to two CTA buttons.',
			},
		},
	},
	argTypes: {
		headline: { control: 'text' },
		subtext: { control: 'text' },
		ctaLabel: { control: 'text' },
		secondaryCtaLabel: { control: 'text' },
	},
	args: {
		headline: 'No invoices yet',
		subtext: 'Invoices are generated automatically when a subscription billing period ends.',
		ctaLabel: 'Create Invoice',
	},
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
	args: {
		icon: <FileText size={48} strokeWidth={1} />,
		headline: 'No invoices yet',
		subtext: 'Invoices are generated automatically when a subscription billing period ends.',
		ctaLabel: 'Create Invoice',
		onCtaClick: () => alert('Create Invoice clicked'),
	},
};

export const NoCustomers: Story = {
	args: {
		icon: <Users size={48} strokeWidth={1} />,
		headline: 'No customers yet',
		subtext: 'Add your first customer to start managing subscriptions and billing.',
		ctaLabel: 'Add Customer',
		onCtaClick: () => {},
	},
};

export const NoPlans: Story = {
	args: {
		icon: <CreditCard size={48} strokeWidth={1} />,
		headline: 'No plans created',
		subtext: 'Create a pricing plan to start offering subscriptions to your customers.',
		ctaLabel: 'Create Plan',
		secondaryCtaLabel: 'View Docs',
		onCtaClick: () => {},
		onSecondaryCtaClick: () => {},
	},
};

export const NoUsageData: Story = {
	args: {
		icon: <BarChart3 size={48} strokeWidth={1} />,
		headline: 'No usage data',
		subtext: 'Start sending events to FlexPrice to see usage analytics here.',
		ctaLabel: 'View Integration Guide',
		onCtaClick: () => {},
	},
};

export const NoEvents: Story = {
	args: {
		icon: <Zap size={48} strokeWidth={1} />,
		headline: 'No events received',
		subtext: 'Events are the foundation of usage-based billing. Send your first event to get started.',
		ctaLabel: 'Open Debugger',
		secondaryCtaLabel: 'Read Docs',
		onCtaClick: () => {},
		onSecondaryCtaClick: () => {},
	},
};

export const WithoutIcon: Story = {
	args: {
		headline: 'Nothing here yet',
		subtext: 'Get started by creating your first item.',
		ctaLabel: 'Get Started',
		onCtaClick: () => {},
	},
};

export const WithoutCTA: Story = {
	args: {
		icon: <FileText size={48} strokeWidth={1} />,
		headline: 'No data available',
		subtext: 'There is no data to display for the selected time period.',
	},
};

export const InteractionTest: Story = {
	args: {
		icon: <Users size={48} strokeWidth={1} />,
		headline: 'No customers yet',
		subtext: 'Add your first customer to get started.',
		ctaLabel: 'Add Customer',
		onCtaClick: () => {},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const cta = canvas.getByRole('button', { name: /add customer/i });
		await expect(cta).toBeInTheDocument();
		await userEvent.click(cta);
	},
};
