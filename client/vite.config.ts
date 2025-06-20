import {defineConfig} from 'vite';
import tsconfigPaths from "vite-tsconfig-paths";
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': '',
        }
    },
    plugins: [
        vue(),
        tsconfigPaths()
    ],
})
