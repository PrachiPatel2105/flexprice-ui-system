import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import { useUser } from '@/hooks/UserContext';
import { PageLoader } from '@/components/atoms';
import useUserhook from '@/hooks/useUser';
import supabase from '@/core/services/supbase/config';

interface AuthMiddlewareProps {
	children: ReactNode;
	requiredRole: string[];
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
	const userContext = useUser();
	const { user, loading, error } = useUserhook();
	const noBackend = !import.meta.env.VITE_API_URL;

	// When no backend: check Supabase session directly
	const [sessionChecked, setSessionChecked] = useState(false);
	const [hasSession, setHasSession] = useState(false);

	useEffect(() => {
		if (!noBackend) return;
		supabase.auth.getSession().then((result: { data: { session: unknown } }) => {
			setHasSession(!!result.data?.session);
			setSessionChecked(true);
		});
	}, [noBackend]);

	useEffect(() => {
		if (user) {
			userContext.setUser(user);
		}
	}, [user, userContext]);

	// No backend mode — use Supabase session as auth source
	if (noBackend) {
		if (!sessionChecked) return <PageLoader />;
		if (!hasSession) return <Navigate to='/auth' />;
		return <>{children}</>;
	}

	// Backend mode — use API user
	if (loading) return <PageLoader />;
	if (error || !user) return <Navigate to='/auth' />;
	return <>{children}</>;
};

export default AuthMiddleware;
