import { FC } from 'react';
import { cn } from '@/lib/utils';

interface UsageBarProps {
	/** Label for the metric (e.g. "API Calls") */
	label: string;
	/** Current usage value */
	used: number;
	/** Total entitled units */
	total: number;
	/** Unit label (e.g. "calls", "GB", "seats") */
	unit?: string;
	/** Show numeric usage text */
	showUsageText?: boolean;
	/** Custom className */
	className?: string;
}

const getBarColor = (percent: number): string => {
	if (percent >= 90) return 'bg-red-500';
	if (percent >= 75) return 'bg-orange-400';
	return 'bg-[#092E44]';
};

/**
 * `UsageBar` / `MeterProgress` shows a labelled progress bar indicating
 * used vs. entitled units for a feature or meter.
 * Used on subscription detail pages and the customer portal.
 */
const UsageBar: FC<UsageBarProps> = ({ label, used, total, unit = '', showUsageText = true, className }) => {
	const percent = total > 0 ? Math.min((used / total) * 100, 100) : 0;
	const barColor = getBarColor(percent);
	const isOverLimit = used > total;

	const formatValue = (val: number) =>
		val >= 1_000_000 ? `${(val / 1_000_000).toFixed(1)}M` : val >= 1_000 ? `${(val / 1_000).toFixed(1)}K` : val.toString();

	return (
		<div className={cn('flex flex-col gap-1.5', className)}>
			<div className='flex items-center justify-between'>
				<span className='text-sm font-medium text-foreground'>{label}</span>
				{showUsageText && (
					<span className={cn('text-xs font-medium', isOverLimit ? 'text-red-500' : 'text-muted-foreground')}>
						{formatValue(used)} / {formatValue(total)} {unit}
					</span>
				)}
			</div>
			<div className='relative h-2 w-full overflow-hidden rounded-full bg-secondary'>
				<div
					className={cn('h-full rounded-full transition-all duration-500', barColor)}
					style={{ width: `${percent}%` }}
					role='progressbar'
					aria-valuenow={used}
					aria-valuemin={0}
					aria-valuemax={total}
					aria-label={`${label}: ${percent.toFixed(0)}% used`}
				/>
			</div>
			{isOverLimit && (
				<p className='text-xs text-red-500 font-medium'>
					Over limit by {formatValue(used - total)} {unit}
				</p>
			)}
		</div>
	);
};

export default UsageBar;
