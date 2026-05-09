import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import { DollarSign, Search } from 'lucide-react';
import Input from './Input';

/**
 * `Input` is the primary text/number input component in FlexPrice.
 *
 * ## Props
 * - `label` — optional label above the input
 * - `error` — error message shown below the input
 * - `description` — helper text below the input
 * - `variant` — `text` | `number` | `formatted-number` | `integer`
 * - `inputPrefix` — element shown before the input (e.g. currency symbol)
 * - `suffix` — element shown after the input
 * - `disabled` — disables the input
 */
const meta: Meta<typeof Input> = {
	title: 'Atoms/Input',
	component: Input,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Primary text/number input for FlexPrice. Supports variants (`text`, `number`, `formatted-number`, `integer`), optional labels, error messages, helper descriptions, and prefix/suffix elements such as currency symbols.',
			},
		},
	},
	argTypes: {
		label: { control: 'text' },
		placeholder: { control: 'text' },
		error: { control: 'text' },
		description: { control: 'text' },
		disabled: { control: 'boolean' },
		variant: {
			control: 'select',
			options: ['text', 'number', 'formatted-number', 'integer'],
		},
	},
	args: {
		placeholder: 'Enter value...',
		disabled: false,
	},
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
	args: { label: 'Customer Name', placeholder: 'e.g. Acme Corp' },
};

export const WithError: Story = {
	args: {
		label: 'Email',
		placeholder: 'user@example.com',
		error: 'Please enter a valid email address',
		value: 'invalid-email',
	},
};

export const WithDescription: Story = {
	args: {
		label: 'API Key',
		placeholder: 'sk_live_...',
		description: 'Your secret API key. Keep this safe.',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Plan ID',
		value: 'plan_01HXYZ',
		disabled: true,
	},
};

export const WithCurrencyPrefix: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<Input
				label='Amount'
				placeholder='0.00'
				variant='formatted-number'
				inputPrefix={<DollarSign size={14} className='text-muted-foreground' />}
				value={value}
				onChange={setValue}
			/>
		);
	},
};

export const NumberInput: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<Input
				label='Usage Limit'
				placeholder='1000'
				variant='integer'
				value={value}
				onChange={setValue}
				description='Maximum API calls per month'
			/>
		);
	},
};

/** Plain HTML number input — uses the `number` variant for native browser number controls. */
export const PlainNumber: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<Input label='Quantity' placeholder='0' variant='number' value={value} onChange={setValue} description='Enter a numeric quantity' />
		);
	},
};

export const WithSearchIcon: Story = {
	args: {
		placeholder: 'Search customers...',
		inputPrefix: <Search size={14} className='text-muted-foreground' />,
	},
};

export const WithSuffix: Story = {
	args: {
		label: 'Price per unit',
		placeholder: '0.00',
		suffix: 'USD',
	},
};

export const InteractionTest: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return <Input label='Test Input' placeholder='Type here...' value={value} onChange={setValue} />;
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByPlaceholderText('Type here...');
		await expect(input).toBeInTheDocument();
		await userEvent.type(input, 'Hello FlexPrice');
		await expect(input).toHaveValue('Hello FlexPrice');
	},
};
