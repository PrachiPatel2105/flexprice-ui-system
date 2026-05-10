import { useQuery } from '@tanstack/react-query';
import { UserApi } from '@/api/UserApi';
import AuthService from '@/core/auth/AuthService';

const useUser = () => {
	const noBackend = !import.meta.env.VITE_API_URL;
	const tokenStr = noBackend ? null : AuthService.getAcessToken();

	const {
		data: user,
		isLoading: loading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['user', 'me'],
		queryFn: async () => {
			return await UserApi.me();
		},
		enabled: !noBackend && !!tokenStr,
		retry: 1,
		retryDelay: 1000,
	});

	return { user, loading: noBackend ? false : loading, error: noBackend ? null : error, refetch };
};

export default useUser;
