import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import FlexPriceSelect from './Select';

/**
 * `Select` / `Dropdown` is used for single-value selection throughout FlexPrice.
 *
 * ## Props
 * - `options` — array of `{ value, label, description?, disabled? }`
 * - `value` — controlled selected value
 * - `onChange` — callback when selection changes
 * - `placeholder` — placeholder text when nothing is selected
 * - `label` — optional label above the select
 * - `error` — error message
 * - `disabled` — disables the select
 * - `isRadio` — shows radio-style indicators
 */
const meta: Meta<typeof FlexPriceSelect> = {
	title: 'Atoms/Select',
	component: FlexPriceSelect,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'`Select` / `Dropdown` provides single-value selection throughout FlexPrice. Supports optional labels, error messages, descriptions, radio-style indicators, and a searchable variant for long option lists.',
			},
		},
	},
	argTypes: {
		placeholder: { control: 'text' },
		label: { control: 'text' },
		error: { control: 'text' },
		disabled: { control: 'boolean' },
		isRadio: { control: 'boolean' },
	},
};

export default meta;
type Story = StoryObj<typeof FlexPriceSelect>;

const billingPeriodOptions = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'quarterly', label: 'Quarterly' },
	{ value: 'annual', label: 'Annual' },
	{ value: 'weekly', label: 'Weekly' },
];

const planStatusOptions = [
	{ value: 'active', label: 'Active' },
	{ value: 'archived', label: 'Archived' },
	{ value: 'draft', label: 'Draft' },
];

const currencyOptions = [
	{ value: 'usd', label: 'USD — US Dollar' },
	{ value: 'eur', label: 'EUR — Euro' },
	{ value: 'gbp', label: 'GBP — British Pound' },
	{ value: 'inr', label: 'INR — Indian Rupee' },
];

const chargeTypeOptions = [
	{ value: 'flat', label: 'Flat Fee', description: 'Fixed price per billing period' },
	{ value: 'usage', label: 'Usage Based', description: 'Charged based on actual usage' },
	{ value: 'tiered', label: 'Tiered', description: 'Different rates for different usage tiers' },
	{ value: 'package', label: 'Package', description: 'Fixed price per package of units' },
];

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<FlexPriceSelect
				label='Billing Period'
				options={billingPeriodOptions}
				value={value}
				onChange={setValue}
				placeholder='Select billing period'
			/>
		);
	},
};

export const WithPreselectedValue: Story = {
	render: () => {
		const [value, setValue] = useState('monthly');
		return <FlexPriceSelect label='Billing Period' options={billingPeriodOptions} value={value} onChange={setValue} />;
	},
};

export const WithError: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<FlexPriceSelect label='Plan Status' options={planStatusOptions} value={value} onChange={setValue} error='Please select a status' />
		);
	},
};

export const Disabled: Story = {
	render: () => <FlexPriceSelect label='Currency' options={currencyOptions} value='usd' onChange={() => {}} disabled />,
};

export const WithDescriptions: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<FlexPriceSelect label='Charge Type' options={chargeTypeOptions} value={value} onChange={setValue} placeholder='Select charge type' />
		);
	},
};

export const RadioStyle: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<FlexPriceSelect
				label='Invoice Cadence'
				options={[
					{ value: 'advance', label: 'Advance', description: 'Billed at the start of the period' },
					{ value: 'arrear', label: 'Arrear', description: 'Billed at the end of the period' },
				]}
				value={value}
				onChange={setValue}
				isRadio
				placeholder='Select cadence'
			/>
		);
	},
};

export const CurrencySelect: Story = {
	render: () => {
		const [value, setValue] = useState('usd');
		return <FlexPriceSelect label='Currency' options={currencyOptions} value={value} onChange={setValue} />;
	},
};

/**
 * WithSearch — simulates a searchable select by filtering options based on a
 * text input above the dropdown. The underlying FlexPriceSelect receives only
 * the filtered subset, giving users a "search" experience.
 */
export const WithSearch: Story = {
	render: () => {
		const [value, setValue] = useState('');
		const [query, setQuery] = useState('');
		const allOptions = [
			{ value: 'usd', label: 'USD — US Dollar' },
			{ value: 'eur', label: 'EUR — Euro' },
			{ value: 'gbp', label: 'GBP — British Pound' },
			{ value: 'inr', label: 'INR — Indian Rupee' },
			{ value: 'jpy', label: 'JPY — Japanese Yen' },
			{ value: 'aud', label: 'AUD — Australian Dollar' },
			{ value: 'cad', label: 'CAD — Canadian Dollar' },
			{ value: 'chf', label: 'CHF — Swiss Franc' },
		];
		const filtered = allOptions.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
		return (
			<div className='space-y-2 w-72'>
				<input
					type='text'
					placeholder='Search currencies...'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className='w-full border border-gray-200 rounded-[6px] px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500'
					aria-label='Search currencies'
				/>
				<FlexPriceSelect
					label='Currency'
					options={filtered}
					value={value}
					onChange={setValue}
					placeholder='Select currency'
					noOptionsText='No currencies match your search'
				/>
			</div>
		);
	},
	parameters: {
		docs: {
			description: {
				story: 'Searchable select pattern — filters the option list in real time as the user types in the search input above the dropdown.',
			},
		},
	},
};

export const InteractionTest: Story = {
	render: () => {
		const [value, setValue] = useState('');
		return (
			<FlexPriceSelect
				label='Billing Period'
				options={billingPeriodOptions}
				value={value}
				onChange={setValue}
				placeholder='Select billing period'
			/>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Verify the trigger renders with placeholder text
		const trigger = canvas.getByRole('combobox');
		await expect(trigger).toBeInTheDocument();
		await expect(trigger).not.toBeDisabled();
		// Open the dropdown
		await userEvent.click(trigger);
	},
};
