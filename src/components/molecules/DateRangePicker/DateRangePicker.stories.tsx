import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import DateRangePicker from '@/components/atoms/DateRangePicker/DateRangePicker';

/**
 * `DateRangePicker` is used for analytics filtering and report generation in FlexPrice.
 * Supports timezone-aware date selection with a two-month calendar view.
 *
 * ## Props
 * - `startDate` / `endDate` — controlled date values
 * - `onChange` — callback with `{ startDate, endDate }`
 * - `placeholder` — text when no range is selected
 * - `title` — optional label above the picker
 * - `disabled` — disables the picker
 * - `minDate` / `maxDate` — constrain selectable dates
 */
const meta: Meta = {
	title: 'Molecules/DateRangePicker',
	tags: ['autodocs'],
	parameters: {
		docs: {
			description: {
				component:
					'`DateRangePicker` is used for analytics filtering and report generation in FlexPrice. Supports timezone-aware date selection with a two-month calendar view, optional title, disabled state, and min/max date constraints.',
			},
		},
	},
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => {
		const [range, setRange] = useState<{ startDate?: Date; endDate?: Date }>({});
		return (
			<div className='p-4'>
				<DateRangePicker startDate={range.startDate} endDate={range.endDate} onChange={setRange} placeholder='Select date range' />
				{range.startDate && range.endDate && (
					<p className='mt-3 text-sm text-muted-foreground'>
						Selected: {range.startDate.toLocaleDateString()} → {range.endDate.toLocaleDateString()}
					</p>
				)}
			</div>
		);
	},
};

export const WithTitle: Story = {
	render: () => {
		const [range, setRange] = useState<{ startDate?: Date; endDate?: Date }>({});
		return (
			<div className='p-4'>
				<DateRangePicker
					title='Billing Period'
					startDate={range.startDate}
					endDate={range.endDate}
					onChange={setRange}
					placeholder='Select billing period'
				/>
			</div>
		);
	},
};

export const PreselectedRange: Story = {
	render: () => {
		const start = new Date('2025-01-01');
		const end = new Date('2025-01-31');
		const [range, setRange] = useState<{ startDate?: Date; endDate?: Date }>({ startDate: start, endDate: end });
		return (
			<div className='p-4'>
				<DateRangePicker title='Analytics Range' startDate={range.startDate} endDate={range.endDate} onChange={setRange} />
			</div>
		);
	},
};

export const Disabled: Story = {
	render: () => (
		<div className='p-4'>
			<DateRangePicker
				title='Date Range'
				startDate={new Date('2025-01-01')}
				endDate={new Date('2025-01-31')}
				onChange={() => {}}
				disabled
			/>
		</div>
	),
};

export const InFilterBar: Story = {
	render: () => {
		const [range, setRange] = useState<{ startDate?: Date; endDate?: Date }>({});
		return (
			<div className='p-4 bg-white border border-[#E5E7EB] rounded-[6px] flex items-center gap-4'>
				<span className='text-sm font-medium text-foreground'>Filter by:</span>
				<DateRangePicker startDate={range.startDate} endDate={range.endDate} onChange={setRange} placeholder='All time' />
			</div>
		);
	},
};
