import { Outlet, useNavigate } from 'react-router';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/molecules/Sidebar';
import { BreadCrumbs, DebugMenu, RestrictedEnvBanner } from '@/components/molecules';
import { CommandPalette } from '@/components/organisms';
import AppPrefetcher from '@/components/organisms/AppPrefetcher';
import useUser from '@/hooks/useUser';
import { useEffect } from 'react';

const isProd = import.meta.env.VITE_APP_ENVIRONMENT === 'prod';

const MainLayout: React.FC = () => {
	const { user } = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user || !isProd) return;
		try {
			// PostHog identify
			const ph = (window as any).posthog;
			if (ph?.identify) {
				ph.identify(user.email, {
					id: user.id,
					email: user.email,
					name: user.tenant?.name,
					tenant_id: user.tenant?.id,
					tenant_name: user.tenant?.name,
				});
			}
		} catch { /* ignore */ }

		try {
			// Sentry user context
			const Sentry = (window as any).__Sentry__;
			if (Sentry?.setUser) {
				Sentry.setUser({ id: user.id, email: user.email });
			}
		} catch { /* ignore */ }

		try {
			// Reo identify
			if ((window as any).Reo?.identify) {
				(window as any).Reo.identify({
					username: user.email,
					type: 'email',
					firstname: user.name || '',
					company: user.tenant?.name || '',
				});
			}
		} catch { /* ignore */ }
	}, [user, navigate]);

	useEffect(() => {
		if (!user && isProd) {
			try {
				const ph = (window as any).posthog;
				if (ph?.reset) ph.reset();
			} catch { /* ignore */ }
		}
	}, [user]);

	return (
		<SidebarProvider className='flex h-screen bg-gray-100 relative font-open-sans'>
			<AppPrefetcher />
			<CommandPalette />
			<Sidebar />
			<SidebarInset className='flex flex-col flex-1 bg-white h-screen relative'>
				<BreadCrumbs />
				<RestrictedEnvBanner />
				<main className='flex-1 px-4 relative overflow-y-auto'>
					<Outlet />
					<DebugMenu />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default MainLayout;
