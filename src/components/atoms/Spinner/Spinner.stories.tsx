import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';

/**
 * `Spinner` is a loading indicator used throughout FlexPrice while data is being fetched.
 *
 * ## Props
 * - `size` — pixel size of the spinner (default: 24)
 * - `className` — additional Tailwind classes (e.g. for color)
 */
const meta: Meta<typeof Spinner> = {
	title: 'Atoms/Spinner',
	component: Spinner,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Animated loading indicator used throughout FlexPrice while data is being fetched. Renders an SVG spinner with configurable size and colour via Tailwind `className`. Used inside buttons (loading state), table skeletons, and full-page loading screens.',
			},
		},
	},
	argTypes: {
		size: { control: { type: 'range', min: 12, max: 64, step: 4 } },
		className: { control: 'text' },
	},
	args: {
		size: 24,
	},
	decorators: [
		(Story) => (
			<div className='flex items-center justify-center p-8'>
				<Story />
			</div>
		),
	],
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {};

export const Small: Story = {
	args: { size: 16 },
};

export const Medium: Story = {
	args: { size: 24 },
};

export const Large: Story = {
	args: { size: 40 },
};

export const Colored: Story = {
	args: { size: 32, className: 'text-blue-500' },
};

export const LoadingState: Story = {
	render: () => (
		<div className='flex flex-col items-center gap-4 p-8'>
			<Spinner size={32} />
			<p className='text-sm text-muted-foreground'>Loading invoices...</p>
		</div>
	),
};

export const InlineWithText: Story = {
	render: () => (
		<div className='flex items-center gap-2 text-sm text-muted-foreground'>
			<Spinner size={14} />
			<span>Fetching customer data...</span>
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className='flex items-center gap-6 p-4'>
			{[12, 16, 24, 32, 48].map((size) => (
				<div key={size} className='flex flex-col items-center gap-2'>
					<Spinner size={size} />
					<span className='text-xs text-muted-foreground'>{size}px</span>
				</div>
			))}
		</div>
	),
};
