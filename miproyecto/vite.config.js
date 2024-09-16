import { defineConfig } from 'vite';

export default defineConfig({
    root: 'public',
    server: {
        host: true,
        port: 3000,
        strictPort: true,
        watch: {
            usePolling: true,
        }
    }
});
