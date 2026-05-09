import { FC, useState } from 'react';
import { cn } from '@/lib/utils';
import { Home, Layers2, Landmark, BarChart3, Settings, CodeXml, Puzzle, ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';

export interface NavSubItem {
	title: string;
	url: string;
}

export interface NavItem {
	title: string;
	url: string;
	icon: LucideIcon;
	items?: NavSubItem[];
}

interface SidebarNavProps {
	/** Navigation items */
	items?: NavItem[];
	/** Currently active route */
	activeRoute?: string;
	/** Whether the sidebar is collapsed to icon-only mode */
	collapsed?: boolean;
}

const DEFAULT_NAV: NavItem[] = [
	{ title: 'Home', url: '/dashboard', icon: Home },
	{
		title: 'Product Catalog',
		url: '/product-catalog',
		icon: Layers2,
		items: [
			{ title: 'Features', url: '/product-catalog/features' },
			{ title: 'Plans', url: '/product-catalog/plans' },
			{ title: 'Coupons', url: '/product-catalog/coupons' },
			{ title: 'Addons', url: '/product-catalog/addons' },
		],
	},
	{
		title: 'Billing',
		url: '/billing',
		icon: Landmark,
		items: [
			{ title: 'Customers', url: '/billing/customers' },
			{ title: 'Subscriptions', url: '/billing/subscriptions' },
			{ title: 'Invoices', url: '/billing/invoices' },
			{ title: 'Credit Notes', url: '/billing/credit-notes' },
		],
	},
	{ title: 'Revenue', url: '/revenue', icon: BarChart3 },
	{
		title: 'Developers',
		url: '/developers',
		icon: CodeXml,
		items: [
			{ title: 'Events Debugger', url: '/developers/events' },
			{ title: 'API Keys', url: '/developers/api-keys' },
			{ title: 'Webhooks', url: '/developers/webhooks' },
		],
	},
	{
		title: 'Tools',
		url: '/tools',
		icon: Settings,
		items: [
			{ title: 'Imports', url: '/tools/imports' },
			{ title: 'Exports', url: '/tools/exports' },
		],
	},
	{ title: 'Integrations', url: '/integrations', icon: Puzzle },
];

/**
 * `SidebarNav` is the main navigation component for the FlexPrice admin panel.
 * Supports collapsible accordion sections, active-route highlighting, and icon-only collapsed mode.
 */
const SidebarNav: FC<SidebarNavProps> = ({ items = DEFAULT_NAV, activeRoute = '/dashboard', collapsed = false }) => {
	const [openSections, setOpenSections] = useState<Set<string>>(() => {
		const open = new Set<string>();
		items.forEach((item) => {
			if (item.items?.some((sub) => activeRoute.startsWith(sub.url))) {
				open.add(item.title);
			}
		});
		return open;
	});

	const toggleSection = (title: string) => {
		setOpenSections((prev) => {
			const next = new Set(prev);
			if (next.has(title)) next.delete(title);
			else next.add(title);
			return next;
		});
	};

	return (
		<nav className={cn('flex flex-col gap-1 py-2', collapsed ? 'w-14 items-center' : 'w-56')} aria-label='Main navigation'>
			{items.map((item) => {
				const Icon = item.icon;
				const isActive = activeRoute === item.url || item.items?.some((sub) => activeRoute.startsWith(sub.url));
				const isOpen = openSections.has(item.title);
				const hasChildren = !!item.items?.length;

				return (
					<div key={item.title}>
						<button
							onClick={() => hasChildren && toggleSection(item.title)}
							className={cn(
								'flex items-center gap-2.5 w-full px-2 py-1.5 rounded-[6px] text-sm transition-colors',
								isActive ? 'bg-[#092E44] text-white font-medium' : 'text-[#57646E] hover:bg-gray-100 hover:text-foreground',
								collapsed && 'justify-center px-0',
							)}
							aria-current={isActive ? 'page' : undefined}
							title={collapsed ? item.title : undefined}>
							<Icon size={16} className='shrink-0' />
							{!collapsed && (
								<>
									<span className='flex-1 text-left'>{item.title}</span>
									{hasChildren && (
										<span className='text-current opacity-60'>{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
									)}
								</>
							)}
						</button>

						{/* Sub-items */}
						{hasChildren && isOpen && !collapsed && (
							<div className='ml-6 mt-0.5 flex flex-col gap-0.5 border-l border-gray-200 pl-3'>
								{item.items!.map((sub) => {
									const isSubActive = activeRoute.startsWith(sub.url);
									return (
										<a
											key={sub.url}
											href={sub.url}
											onClick={(e) => e.preventDefault()}
											className={cn(
												'block px-2 py-1 rounded-[6px] text-sm transition-colors',
												isSubActive ? 'text-[#092E44] font-medium bg-blue-50' : 'text-[#57646E] hover:text-foreground hover:bg-gray-50',
											)}
											aria-current={isSubActive ? 'page' : undefined}>
											{sub.title}
										</a>
									);
								})}
							</div>
						)}
					</div>
				);
			})}
		</nav>
	);
};

export default SidebarNav;
