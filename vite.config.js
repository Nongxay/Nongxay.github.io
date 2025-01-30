import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
    plugins: [sveltekit()],
    resolve: {
        alias: {
          $lib: path.resolve(__dirname, 'src/lib'),
        },
      },
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },
    server: {
        host: '10.0.19.248', // your IP address // alternatively, use '0.0.0.0' to listen on all available network interfaces
        port: 8080, // default Vite port, you can change it if needed
        strictPort: true, // optional: ensures the specified port is used
        https: false,    // Keep the default port or change it as needed
      },
});
