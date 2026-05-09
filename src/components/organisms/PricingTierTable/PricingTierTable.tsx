import { FC } from 'react';
import { cn } from '@/lib/utils';

export type TierMode = 'tiered' | 'volume' | 'graduated' | 'package';

export interface PricingTier {
	/** Starting unit (inclusive) */
	from: number;
	/** Ending unit (inclusive, null = unlimited) */
	to: number | null;
	/** Price per unit in this tier */
	unitPrice: number;
	/** Flat fee for this tier (optional) */
	flatFee?: number;
	/** Currency code */
	currency?: string;
}

interface PricingTierTableProps {
	/** Array of pricing tiers */
	tiers: PricingTier[];
	/** Pricing model type */
	mode?: TierMode;
	/** Currency symbol (default: $) */
	currencySymbol?: string;
	/** Show flat fee column */
	showFlatFee?: boolean;
	/** Additional className */
	className?: string;
}

const formatPrice = (price: number, symbol: string) => {
	if (price === 0) return `${symbol}0.00`;
	if (price < 0.01) return `${symbol}${price.toFixed(6)}`;
	return `${symbol}${price.toFixed(4).replace(/\.?0+$/, '')}`;
};

const formatRange = (from: number, to: number | null): string => {
	if (to === null) return `${from.toLocaleString()}+`;
	return `${from.toLocaleString()} – ${to.toLocaleString()}`;
};

const MODE_LABELS: Record<TierMode, string> = {
	tiered: 'Tiered Pricing',
	volume: 'Volume Pricing',
	graduated: 'Graduated Pricing',
	package: 'Package Pricing',
};

/**
 * `PricingTierTable` displays tiered or graduated pricing in a readable table.
 * Used on Plan detail pages to show how charges are calculated at different usage levels.
 */
const PricingTierTable: FC<PricingTierTableProps> = ({ tiers, mode = 'tiered', currencySymbol = '$', showFlatFee = false, className }) => {
	return (
		<div className={cn('rounded-[6px] border border-[#E2E8F0] overflow-hidden', className)}>
			{/* Header */}
			<div className='bg-muted border-b border-[#E2E8F0] px-4 py-2.5 flex items-center justify-between'>
				<span className='text-sm font-medium text-foreground'>{MODE_LABELS[mode]}</span>
				<span className='text-xs text-muted-foreground uppercase tracking-wide'>{mode}</span>
			</div>

			{/* Table */}
			<table className='w-full text-sm'>
				<thead>
					<tr className='border-b border-[#E2E8F0]'>
						<th className='px-4 py-2.5 text-left font-medium text-[#64748B]'>Units</th>
						<th className='px-4 py-2.5 text-right font-medium text-[#64748B]'>Unit Price</th>
						{showFlatFee && <th className='px-4 py-2.5 text-right font-medium text-[#64748B]'>Flat Fee</th>}
					</tr>
				</thead>
				<tbody>
					{tiers.map((tier, i) => {
						const isLast = i === tiers.length - 1;
						return (
							<tr key={i} className={cn('transition-colors hover:bg-muted/50', !isLast && 'border-b border-[#E2E8F0]')}>
								<td className='px-4 py-2.5 font-medium text-foreground'>{formatRange(tier.from, tier.to)}</td>
								<td className='px-4 py-2.5 text-right font-medium'>
									{tier.unitPrice === 0 ? (
										<span className='text-green-600 font-medium'>Free</span>
									) : (
										<span>{formatPrice(tier.unitPrice, currencySymbol)}</span>
									)}
								</td>
								{showFlatFee && (
									<td className='px-4 py-2.5 text-right text-muted-foreground'>
										{tier.flatFee ? formatPrice(tier.flatFee, currencySymbol) : '—'}
									</td>
								)}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default PricingTierTable;
