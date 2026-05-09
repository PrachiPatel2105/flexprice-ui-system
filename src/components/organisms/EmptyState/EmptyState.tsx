import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Button from '@/components/atoms/Button/Button';

interface EmptyStateProps {
	/** Icon element to display */
	icon?: ReactNode;
	/** Main headline */
	headline: string;
	/** Supporting description text */
	subtext?: string;
	/** CTA button label */
	ctaLabel?: string;
	/** CTA button click handler */
	onCtaClick?: () => void;
	/** Secondary CTA label */
	secondaryCtaLabel?: string;
	/** Secondary CTA click handler */
	onSecondaryCtaClick?: () => void;
	/** Additional className */
	className?: string;
}

/**
 * `EmptyState` is a full-page empty state component shown when a list has no data.
 * Used on Customers, Invoices, Plans, and other list pages in FlexPrice.
 *
 * ## Props
 * - `icon` — optional icon/illustration
 * - `headline` — main message (e.g. "No invoices yet")
 * - `subtext` — supporting description
 * - `ctaLabel` / `onCtaClick` — primary action button
 * - `secondaryCtaLabel` / `onSecondaryCtaClick` — optional secondary action
 */
const EmptyState: FC<EmptyStateProps> = ({
	icon,
	headline,
	subtext,
	ctaLabel,
	onCtaClick,
	secondaryCtaLabel,
	onSecondaryCtaClick,
	className,
}) => {
	return (
		<div
			className={cn(
				'bg-[#fafafa] border border-[#E9E9E9] rounded-[6px] w-full flex flex-col items-center justify-center py-16 px-8 text-center',
				className,
			)}>
			{icon && <div className='mb-6 text-muted-foreground'>{icon}</div>}
			<h3 className='font-medium text-[20px] leading-normal text-gray-700 mb-3'>{headline}</h3>
			{subtext && <p className='font-normal text-[15px] leading-relaxed text-gray-400 mb-8 max-w-[380px]'>{subtext}</p>}
			<div className='flex items-center gap-3'>
				{ctaLabel && onCtaClick && (
					<Button onClick={onCtaClick} variant='default'>
						{ctaLabel}
					</Button>
				)}
				{secondaryCtaLabel && onSecondaryCtaClick && (
					<Button onClick={onSecondaryCtaClick} variant='outline'>
						{secondaryCtaLabel}
					</Button>
				)}
			</div>
		</div>
	);
};

export default EmptyState;
