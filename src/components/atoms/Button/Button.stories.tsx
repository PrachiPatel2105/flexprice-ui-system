import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { Plus, Trash2, Download } from 'lucide-react';
import Button from './Button';

/**
 * `Button` is the primary interactive element in FlexPrice.
 *
 * ## Props
 * - `variant` — visual style: `default` (dark navy), `destructive`, `outline`, `secondary`, `ghost`, `link`
 * - `size` — `xs`, `sm`, `default`, `lg`, `icon`
 * - `isLoading` — shows a spinner and disables the button
 * - `disabled` — disables the button
 * - `prefixIcon` / `suffixIcon` — optional icons flanking the label
 */
const meta: Meta<typeof Button> = {
	title: 'Atoms/Button',
	component: Button,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Primary interactive element used throughout FlexPrice. Supports 6 visual variants, 5 sizes, loading state, and prefix/suffix icons. Built on top of `class-variance-authority` and Radix `Slot`.',
			},
		},
	},
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
			description: 'Visual style variant',
		},
		size: {
			control: 'select',
			options: ['xs', 'sm', 'default', 'lg', 'icon'],
			description: 'Button size',
		},
		isLoading: { control: 'boolean', description: 'Shows spinner and disables interaction' },
		disabled: { control: 'boolean', description: 'Disables the button' },
		children: { control: 'text', description: 'Button label' },
	},
	args: {
		children: 'Button',
		variant: 'default',
		size: 'default',
		isLoading: false,
		disabled: false,
	},
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
	args: { children: 'Create Plan' },
};

export const Primary: Story = {
	args: { variant: 'default', children: 'Add Customer' },
};

export const Destructive: Story = {
	args: { variant: 'destructive', children: 'Delete Invoice' },
};

export const Outline: Story = {
	args: { variant: 'outline', children: 'Cancel' },
};

export const Secondary: Story = {
	args: { variant: 'secondary', children: 'Export' },
};

export const Ghost: Story = {
	args: { variant: 'ghost', children: 'View Details' },
};

export const Loading: Story = {
	args: { isLoading: true, children: 'Saving...' },
};

export const Disabled: Story = {
	args: { disabled: true, children: 'Unavailable' },
};

export const Small: Story = {
	args: { size: 'sm', children: 'Small' },
};

export const Large: Story = {
	args: { size: 'lg', children: 'Large' },
};

export const WithPrefixIcon: Story = {
	args: { prefixIcon: <Plus size={14} />, children: 'Add Charge' },
};

export const WithSuffixIcon: Story = {
	args: { suffixIcon: <Download size={14} />, children: 'Download CSV' },
};

export const Danger: Story = {
	args: { variant: 'destructive', children: 'Delete Plan' },
};

export const DangerWithIcon: Story = {
	args: { variant: 'destructive', prefixIcon: <Trash2 size={14} />, children: 'Delete' },
};

export const AllVariants: Story = {
	render: () => (
		<div className='flex flex-wrap gap-3 p-4'>
			<Button variant='default'>Default</Button>
			<Button variant='destructive'>Destructive</Button>
			<Button variant='outline'>Outline</Button>
			<Button variant='secondary'>Secondary</Button>
			<Button variant='ghost'>Ghost</Button>
			<Button variant='link'>Link</Button>
		</div>
	),
};

export const AllSizes: Story = {
	render: () => (
		<div className='flex flex-wrap items-center gap-3 p-4'>
			<Button size='xs'>Extra Small</Button>
			<Button size='sm'>Small</Button>
			<Button size='default'>Default</Button>
			<Button size='lg'>Large</Button>
		</div>
	),
};

export const InteractionTest: Story = {
	args: { children: 'Click Me' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: /click me/i });
		await expect(button).toBeInTheDocument();
		await expect(button).not.toBeDisabled();
		await userEvent.click(button);
	},
};

export const DisabledInteractionTest: Story = {
	args: { disabled: true, children: 'Disabled' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button', { name: /disabled/i });
		await expect(button).toBeDisabled();
	},
};
