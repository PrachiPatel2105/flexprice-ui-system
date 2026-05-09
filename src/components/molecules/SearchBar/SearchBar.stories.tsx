import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from '@storybook/test';
import { useState } from 'react';
import SearchBar from './SearchBar';

/**
 * `SearchBar` is a debounced search input used on list pages to filter table data.
 */
const meta: Meta<typeof SearchBar> = {
	title: 'Molecules/SearchBar',
	component: SearchBar,
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'Debounced search input used on list pages (Customers, Invoices, Plans, etc.) to filter table data without triggering an API call on every keystroke. Features a clear button that appears when text is present.',
			},
		},
	},
	argTypes: {
		placeholder: { control: 'text' },
		debounceMs: { control: 'number' },
		disabled: { control: 'boolean' },
	},
	args: {
		placeholder: 'Search customers...',
		debounceMs: 300,
		disabled: false,
	},
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {
	render: (args) => {
		const [result, setResult] = useState('');
		return (
			<div className='space-y-3 p-4 max-w-sm'>
				<SearchBar {...args} onSearch={setResult} />
				{result && <p className='text-sm text-muted-foreground'>Searching for: "{result}"</p>}
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => <SearchBar placeholder='Search...' onSearch={() => {}} disabled className='max-w-sm' />,
};

export const WithDefaultValue: Story = {
	render: () => {
		const [result, setResult] = useState('acme');
		return (
			<div className='space-y-3 p-4 max-w-sm'>
				<SearchBar placeholder='Search customers...' onSearch={setResult} defaultValue='acme' />
				<p className='text-sm text-muted-foreground'>Current: "{result}"</p>
			</div>
		);
	},
};

export const InFilterBar: Story = {
	render: () => {
		const [search, setSearch] = useState('');
		return (
			<div className='p-4 bg-white border border-[#E5E7EB] rounded-[6px] flex items-center gap-3'>
				<SearchBar placeholder='Search invoices...' onSearch={setSearch} className='w-64' />
				{search && <span className='text-xs text-muted-foreground'>Filtering by: "{search}"</span>}
			</div>
		);
	},
};

export const InteractionTest: Story = {
	render: () => {
		const [result, setResult] = useState('');
		return (
			<div className='space-y-3 p-4 max-w-sm'>
				<SearchBar placeholder='Type to search...' onSearch={setResult} debounceMs={0} />
				<p data-testid='result' className='text-sm text-muted-foreground'>
					{result ? `Searching: "${result}"` : 'No search yet'}
				</p>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: /search/i });
		await expect(input).toBeInTheDocument();
		await userEvent.type(input, 'acme');
		await expect(input).toHaveValue('acme');
		// Clear button should appear
		const clearBtn = canvas.getByRole('button', { name: /clear search/i });
		await expect(clearBtn).toBeInTheDocument();
		await userEvent.click(clearBtn);
		await expect(input).toHaveValue('');
	},
};
