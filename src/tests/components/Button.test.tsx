/**
 * Component render tests for Button and Chip atoms.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/atoms/Button/Button';
import Chip from '@/components/atoms/Chip/Chip';
import InvoiceStatusBadge from '@/components/molecules/InvoiceStatusBadge/InvoiceStatusBadge';
import UsageBar from '@/components/molecules/UsageBar/UsageBar';

// ─── Button ───────────────────────────────────────────────────────────────────

describe('Button', () => {
	it('renders with children', () => {
		render(<Button>Create Plan</Button>);
		expect(screen.getByRole('button', { name: /create plan/i })).toBeInTheDocument();
	});

	it('is disabled when disabled prop is true', () => {
		render(<Button disabled>Disabled</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('is disabled when isLoading is true', () => {
		render(<Button isLoading>Loading</Button>);
		expect(screen.getByRole('button')).toBeDisabled();
	});

	it('shows spinner when isLoading', () => {
		render(<Button isLoading>Loading</Button>);
		// The button should not show children text when loading
		expect(screen.queryByText('Loading')).not.toBeInTheDocument();
	});

	it('calls onClick when clicked', () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Click Me</Button>);
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', () => {
		const onClick = vi.fn();
		render(
			<Button disabled onClick={onClick}>
				Disabled
			</Button>,
		);
		fireEvent.click(screen.getByRole('button'));
		expect(onClick).not.toHaveBeenCalled();
	});

	it('applies variant class for destructive', () => {
		render(<Button variant='destructive'>Delete</Button>);
		const btn = screen.getByRole('button');
		expect(btn.className).toContain('destructive');
	});
});

// ─── Chip ─────────────────────────────────────────────────────────────────────

describe('Chip', () => {
	it('renders label text', () => {
		render(<Chip label='Active' />);
		expect(screen.getByText('Active')).toBeInTheDocument();
	});

	it('renders with success variant styling', () => {
		render(<Chip label='Paid' variant='success' />);
		const chip = screen.getByText('Paid').closest('span');
		expect(chip).toBeInTheDocument();
	});

	it('calls onClick when clicked', () => {
		const onClick = vi.fn();
		render(<Chip label='Clickable' onClick={onClick} />);
		fireEvent.click(screen.getByText('Clickable').closest('span')!);
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it('does not call onClick when disabled', () => {
		const onClick = vi.fn();
		render(<Chip label='Disabled' onClick={onClick} disabled />);
		fireEvent.click(screen.getByText('Disabled').closest('span')!);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('renders icon when provided', () => {
		render(<Chip label='With Icon' icon={<span data-testid='icon'>★</span>} />);
		expect(screen.getByTestId('icon')).toBeInTheDocument();
	});
});

// ─── InvoiceStatusBadge ───────────────────────────────────────────────────────

describe('InvoiceStatusBadge', () => {
	it('renders "Paid" for paid status', () => {
		render(<InvoiceStatusBadge status='paid' />);
		expect(screen.getByText('Paid')).toBeInTheDocument();
	});

	it('renders "Draft" for draft status', () => {
		render(<InvoiceStatusBadge status='draft' />);
		expect(screen.getByText('Draft')).toBeInTheDocument();
	});

	it('renders "Void" for void status', () => {
		render(<InvoiceStatusBadge status='void' />);
		expect(screen.getByText('Void')).toBeInTheDocument();
	});

	it('renders "Overdue" for overdue status', () => {
		render(<InvoiceStatusBadge status='overdue' />);
		expect(screen.getByText('Overdue')).toBeInTheDocument();
	});

	it('renders raw status for unknown values', () => {
		render(<InvoiceStatusBadge status='custom_status' />);
		expect(screen.getByText('custom_status')).toBeInTheDocument();
	});

	it('hides icon when showIcon is false', () => {
		const { container } = render(<InvoiceStatusBadge status='paid' showIcon={false} />);
		// No SVG icons should be rendered
		expect(container.querySelectorAll('svg')).toHaveLength(0);
	});
});

// ─── UsageBar ─────────────────────────────────────────────────────────────────

describe('UsageBar', () => {
	it('renders label', () => {
		render(<UsageBar label='API Calls' used={500} total={1000} />);
		expect(screen.getByText('API Calls')).toBeInTheDocument();
	});

	it('renders usage text', () => {
		render(<UsageBar label='Storage' used={50} total={100} unit='GB' />);
		expect(screen.getByText(/50 \/ 100 GB/)).toBeInTheDocument();
	});

	it('shows over-limit message when used > total', () => {
		render(<UsageBar label='Seats' used={12} total={10} unit='seats' />);
		expect(screen.getByText(/over limit/i)).toBeInTheDocument();
	});

	it('renders progressbar with correct aria attributes', () => {
		render(<UsageBar label='Events' used={750} total={1000} />);
		const bar = screen.getByRole('progressbar');
		expect(bar).toHaveAttribute('aria-valuenow', '750');
		expect(bar).toHaveAttribute('aria-valuemax', '1000');
	});

	it('hides usage text when showUsageText is false', () => {
		render(<UsageBar label='API Calls' used={500} total={1000} unit='calls' showUsageText={false} />);
		expect(screen.queryByText(/500/)).not.toBeInTheDocument();
	});
});
