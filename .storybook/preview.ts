import '../src/index.css';
import type { Preview } from '@storybook/react';

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		backgrounds: {
			default: 'light',
			values: [
				{ name: 'light', value: '#f8fafc' },
				{ name: 'white', value: '#ffffff' },
				{ name: 'dark', value: '#1a1a2e' },
			],
		},
		layout: 'padded',
	},
};

export default preview;
