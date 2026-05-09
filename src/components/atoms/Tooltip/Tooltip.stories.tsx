import type { Meta, StoryObj } from '@storybook/react';
import { Info, HelpCircle } from 'lucide-react';
import Tooltip from './Tooltip';
import Button from '../Button/Button';

/**
 * `Tooltip` wraps any element and shows informational content on hover.
 *
 * ## Props
 * - `content` — the tooltip body (string or ReactNode)
 * - `delayDuration` — ms before tooltip appears (default: 0)
 * - `side` — `top` | `right` | `bottom` | `left`
 * - `align` — `start` | `center` | `end`
 * - `sideOffset` — pixel offset from the trigger
 */
const meta: Meta<typeof Tooltip> = {
	title: 'Atoms/Tooltip',
	component: Tooltip,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Informational overlay that appears on hover. Built on Radix `TooltipProvider`. Used throughout FlexPrice to explain pricing tiers, feature limits, status meanings, and form field hints. Supports configurable delay, position, and rich ReactNode content.',
			},
		},
	},
	argTypes: {
		content: { control: 'text' },
		delayDuration: { control: 'number' },
		side: { control: 'select', options: ['top', 'right', 'bottom', 'left'] },
		align: { control: 'select', options: ['start', 'center', 'end'] },
		sideOffset: { control: 'number' },
	},
	args: {
		content: 'This is a helpful tooltip',
		delayDuration: 300,
		side: 'top',
		align: 'center',
		sideOffset: 4,
	},
	decorators: [
		(Story) => (
			<div className='flex items-center justify-center p-16'>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline'>Hover me</Button>
		</Tooltip>
	),
};

export const WithDelay: Story = {
	args: { delayDuration: 800, content: 'Appears after 800ms delay' },
	render: (args) => (
		<Tooltip {...args}>
			<Button variant='outline'>Hover (delayed)</Button>
		</Tooltip>
	),
};

export const OnIcon: Story = {
	args: { content: 'Usage is calculated in real-time based on events sent to FlexPrice.' },
	render: (args) => (
		<Tooltip {...args}>
			<Info size={16} className='text-muted-foreground cursor-help' />
		</Tooltip>
	),
};

export const RichContent: Story = {
	render: () => (
		<Tooltip
			content={
				<div className='space-y-1'>
					<p className='font-medium'>Tiered Pricing</p>
					<p className='text-xs text-muted-foreground'>First 1000 units: $0.01/unit</p>
					<p className='text-xs text-muted-foreground'>Next 9000 units: $0.008/unit</p>
					<p className='text-xs text-muted-foreground'>Above 10000: $0.005/unit</p>
				</div>
			}
			className='bg-white border border-gray-200 shadow-lg text-sm text-gray-900 px-4 py-3 rounded-[6px] max-w-[280px]'>
			<HelpCircle size={16} className='text-muted-foreground cursor-help' />
		</Tooltip>
	),
};

export const Positions: Story = {
	render: () => (
		<div className='grid grid-cols-2 gap-8 p-8'>
			{(['top', 'right', 'bottom', 'left'] as const).map((side) => (
				<Tooltip key={side} content={`Tooltip on ${side}`} side={side}>
					<Button variant='outline' size='sm'>
						{side}
					</Button>
				</Tooltip>
			))}
		</div>
	),
};
