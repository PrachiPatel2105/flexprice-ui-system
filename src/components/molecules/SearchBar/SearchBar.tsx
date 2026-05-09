import { FC, useCallback, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '@/lib/utils';

interface SearchBarProps {
	/** Placeholder text */
	placeholder?: string;
	/** Debounce delay in ms (default: 300) */
	debounceMs?: number;
	/** Callback fired after debounce with the search value */
	onSearch: (value: string) => void;
	/** Initial value */
	defaultValue?: string;
	/** Disabled state */
	disabled?: boolean;
	/** Additional className */
	className?: string;
}

/**
 * `SearchBar` is a debounced search input used on list pages (Customers, Invoices, etc.)
 * to filter table data without hammering the API on every keystroke.
 *
 * ## Props
 * - `onSearch` — called after `debounceMs` with the current search string
 * - `debounceMs` — delay before `onSearch` fires (default: 300ms)
 * - `placeholder` — input placeholder text
 * - `disabled` — disables the input
 */
const SearchBar: FC<SearchBarProps> = ({
	placeholder = 'Search...',
	debounceMs = 300,
	onSearch,
	defaultValue = '',
	disabled = false,
	className,
}) => {
	const [value, setValue] = useState(defaultValue);

	const debouncedSearch = useDebouncedCallback((val: string) => {
		onSearch(val);
	}, debounceMs);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newVal = e.target.value;
			setValue(newVal);
			debouncedSearch(newVal);
		},
		[debouncedSearch],
	);

	const handleClear = useCallback(() => {
		setValue('');
		onSearch('');
		debouncedSearch.cancel();
	}, [onSearch, debouncedSearch]);

	return (
		<div
			className={cn(
				'flex items-center gap-2 h-9 px-3 rounded-[6px] border border-input bg-background',
				'focus-within:border-black transition-colors',
				disabled && 'opacity-50 cursor-not-allowed',
				className,
			)}>
			<Search size={14} className='text-muted-foreground shrink-0' />
			<input
				type='text'
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				disabled={disabled}
				className='flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0'
				aria-label='Search'
			/>
			{value && !disabled && (
				<button onClick={handleClear} className='text-muted-foreground hover:text-foreground transition-colors' aria-label='Clear search'>
					<X size={14} />
				</button>
			)}
		</div>
	);
};

export default SearchBar;
