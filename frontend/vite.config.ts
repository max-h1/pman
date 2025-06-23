import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { Buffer } from 'buffer';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 3000,
		host: '0.0.0.0',
	},
	resolve: {
		alias: {
			buffer: 'buffer',
		},
	},
	define: {
		'global.Buffer': Buffer,
	},
	build: {
		sourcemap: true,
	},
});
