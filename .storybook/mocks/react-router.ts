// Mock react-router for Storybook — provides all commonly used exports
import React from 'react';

export const useLocation = () => ({ pathname: '/dashboard', search: '', hash: '', state: null, key: 'default' });
export const useNavigate = () => (_to: any, _opts?: any) => {};
export const useParams = () => ({} as Record<string, string>);
export const useSearchParams = () => {
	const params = new URLSearchParams();
	const setParams = (_next: any) => {};
	return [params, setParams] as const;
};
export const useMatch = (_pattern: any) => null;
export const useMatches = () => [];
export const useOutlet = () => null;
export const useOutletContext = () => ({});
export const useResolvedPath = (to: string) => ({ pathname: to, search: '', hash: '' });
export const useHref = (to: string) => to;
export const useInRouterContext = () => true;
export const useRouteError = () => null;
export const useRouteId = () => '';
export const useBlocker = () => ({ state: 'unblocked', proceed: () => {}, reset: () => {} });

export const Link = ({ children, to, ...props }: any) =>
	React.createElement('a', { href: typeof to === 'string' ? to : '#', ...props }, children);
export const NavLink = Link;
export const Outlet = () => null;
export const Routes = ({ children }: any) => children;
export const Route = ({ element }: any) => element ?? null;
export const BrowserRouter = ({ children }: any) => children;
export const MemoryRouter = ({ children }: any) => children;
export const HashRouter = ({ children }: any) => children;
export const Router = ({ children }: any) => children;
export const Navigate = ({ to }: any) => null;
export const Await = ({ children }: any) => children;

export const createBrowserRouter = () => ({});
export const createMemoryRouter = () => ({});
export const createHashRouter = () => ({});
export const RouterProvider = ({ children }: any) => children;

export const redirect = (url: string) => ({ url });
export const json = (data: any) => data;
export const defer = (data: any) => data;
export const data = (value: any, init?: any) => value;

export const generatePath = (path: string, params?: Record<string, string>) => path;
export const matchPath = (_pattern: any, _pathname: string) => null;
export const matchRoutes = (_routes: any, _location: any) => null;
export const resolvePath = (to: string) => ({ pathname: to, search: '', hash: '' });
