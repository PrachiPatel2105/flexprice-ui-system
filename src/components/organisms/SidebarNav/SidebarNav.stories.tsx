import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import SidebarNav from './SidebarNav';

/**
 * `SidebarNav` is the main navigation component for the FlexPrice admin panel.
 * Supports collapsible accordion sections, active-route highlighting, and icon-only collapsed mode.
 */
const meta: Meta<typeof SidebarNav> = {
	title: 'Organisms/SidebarNav',
	component: SidebarNav,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Main navigation component for the FlexPrice admin panel. Supports collapsible accordion sections, active-route highlighting with visual indicator, and icon-only collapsed mode for compact layouts.',
			},
		},
	},
	argTypes: {
		activeRoute: { control: 'text' },
		collapsed: { control: 'boolean' },
	},
	args: {
		activeRoute: '/dashboard',
		collapsed: false,
	},
	decorators: [
		(Story) => (
			<div className='bg-[#f9f9f9] border border-gray-200 rounded-[6px] p-2 inline-block min-h-[500px]'>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof SidebarNav>;

export const Default: Story = {
	args: { activeRoute: '/dashboard' },
};

export const BillingActive: Story = {
	args: { activeRoute: '/billing/invoices' },
};

export const ProductCatalogActive: Story = {
	args: { activeRoute: '/product-catalog/plans' },
};

export const DevelopersActive: Story = {
	args: { activeRoute: '/developers/api-keys' },
};

export const Collapsed: Story = {
	args: { collapsed: true },
	decorators: [
		(Story) => (
			<div className='bg-[#f9f9f9] border border-gray-200 rounded-[6px] p-2 inline-block min-h-[500px]'>
				<Story />
			</div>
		),
	],
};

export const CollapsibleDemo: Story = {
	render: () => {
		const [collapsed, setCollapsed] = useState(false);
		const [activeRoute, setActiveRoute] = useState('/dashboard');
		return (
			<div className='flex gap-4'>
				<div className='bg-[#f9f9f9] border border-gray-200 rounded-[6px] p-2 min-h-[500px]'>
					<SidebarNav collapsed={collapsed} activeRoute={activeRoute} />
				</div>
				<div className='flex flex-col gap-2'>
					<button
						onClick={() => setCollapsed((c) => !c)}
						className='px-3 py-1.5 text-sm border border-gray-200 rounded-[6px] hover:bg-gray-50'>
						{collapsed ? 'Expand' : 'Collapse'} Sidebar
					</button>
					<p className='text-xs text-muted-foreground'>Active: {activeRoute}</p>
					{['/dashboard', '/billing/invoices', '/product-catalog/plans', '/developers/api-keys'].map((route) => (
						<button
							key={route}
							onClick={() => setActiveRoute(route)}
							className='px-3 py-1 text-xs border border-gray-200 rounded-[6px] hover:bg-gray-50 text-left'>
							{route}
						</button>
					))}
				</div>
			</div>
		);
	},
};

export const InteractionTest: Story = {
	args: { activeRoute: '/dashboard', collapsed: false },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Verify the nav renders
		const nav = canvas.getByRole('navigation', { name: /main navigation/i });
		await expect(nav).toBeInTheDocument();
		// Find and click the "Billing" section to expand it
		const billingBtn = canvas.getByRole('button', { name: /billing/i });
		await expect(billingBtn).toBeInTheDocument();
		await userEvent.click(billingBtn);
		// After clicking, sub-items should appear
		const invoicesLink = await canvas.findByText('Invoices');
		await expect(invoicesLink).toBeInTheDocument();
		// Click again to collapse
		await userEvent.click(billingBtn);
	},
};
