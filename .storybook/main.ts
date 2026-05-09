import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
	stories: [
		'../src/components/atoms/**/*.stories.@(js|jsx|ts|tsx)',
		'../src/components/molecules/**/*.stories.@(js|jsx|ts|tsx)',
		'../src/components/organisms/**/*.stories.@(js|jsx|ts|tsx)',
		'../src/store/**/*.stories.@(js|jsx|ts|tsx)',
		'../src/lib/**/*.stories.@(js|jsx|ts|tsx)',
	],
	addons: [
		'@storybook/addon-essentials',
		'@chromatic-com/storybook',
		'@storybook/addon-interactions',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	typescript: {
		reactDocgen: false,
	},
	viteFinal: async (config) => {
		config.resolve = config.resolve ?? {};
		config.resolve.alias = {
			...(config.resolve.alias ?? {}),
			'@': path.resolve(__dirname, '../src'),
			// Provide a comprehensive mock for react-router
			'react-router': path.resolve(__dirname, './mocks/react-router.ts'),
		};

		// Suppress rollup warnings/errors from transitive app deps
		config.build = config.build ?? {};
		config.build.rollupOptions = config.build.rollupOptions ?? {};

		// Allow missing named exports from mocked modules (treat as undefined)
		config.build.rollupOptions.output = {
			...(config.build.rollupOptions.output as object ?? {}),
			interop: 'auto',
		};

		config.build.rollupOptions.onwarn = (warning, warn) => {
			// Suppress missing export warnings from our mock
			if (warning.code === 'MISSING_EXPORT') return;
			if (warning.code === 'UNRESOLVED_IMPORT') return;
			if (warning.code === 'CIRCULAR_DEPENDENCY') return;
			warn(warning);
		};

		return config;
	},
};

export default config;
