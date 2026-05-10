import React, { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router';
import { useUser } from '@/hooks/UserContext';
import { PageLoader } from '@/components/atoms';
import useUserhook from '@/hooks/useUser';

interface AuthMiddlewareProps {
	children: ReactNode;
	requiredRole: string[];
}
const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
	const userContext = useUser();
	const { user, loading, error } = useUserhook();

	useEffect(() => {
		if (user) {
			userContext.setUser(user);
		}
	}, [user, userContext]);

	if (loading) {
		return <PageLoader />;
	}

	// If no backend is configured, skip user check and render children
	if (!import.meta.env.VITE_API_URL) {
		return <div>{children}</div>;
	}

	if (error || !user) {
		return <Navigate to='/auth' />;
	}

	return <div>{children}</div>;
};

export default AuthMiddleware;
