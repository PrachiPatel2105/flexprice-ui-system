import { FC } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, FileText, Ban } from 'lucide-react';
import Chip from '@/components/atoms/Chip/Chip';

/**
 * Invoice status values used in FlexPrice.
 */
export type InvoiceStatus = 'paid' | 'draft' | 'void' | 'overdue' | 'pending' | 'finalized';

interface InvoiceStatusBadgeProps {
	/** The invoice status string */
	status: InvoiceStatus | string;
	/** Show icon alongside the label */
	showIcon?: boolean;
}

const STATUS_CONFIG: Record<
	InvoiceStatus,
	{
		label: string;
		variant: 'success' | 'default' | 'failed' | 'warning' | 'info';
		icon: React.ReactNode;
	}
> = {
	paid: { label: 'Paid', variant: 'success', icon: <CheckCircle size={12} /> },
	draft: { label: 'Draft', variant: 'default', icon: <FileText size={12} /> },
	void: { label: 'Void', variant: 'failed', icon: <Ban size={12} /> },
	overdue: { label: 'Overdue', variant: 'warning', icon: <AlertCircle size={12} /> },
	pending: { label: 'Pending', variant: 'info', icon: <Clock size={12} /> },
	finalized: { label: 'Finalized', variant: 'info', icon: <XCircle size={12} /> },
};

/**
 * `InvoiceStatusBadge` maps invoice status strings to coloured chips with icons.
 * Used in the Invoices table and invoice detail pages.
 */
const InvoiceStatusBadge: FC<InvoiceStatusBadgeProps> = ({ status, showIcon = true }) => {
	const config = STATUS_CONFIG[status as InvoiceStatus] ?? {
		label: status,
		variant: 'default' as const,
		icon: null,
	};

	return <Chip label={config.label} variant={config.variant} icon={showIcon ? config.icon : undefined} />;
};

export default InvoiceStatusBadge;
