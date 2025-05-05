import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@vitejs/plugin-tailwindcss';
import ghPages from 'vite-plugin-gh-pages';

export default defineConfig({
  plugins: [react(), tailwindcss(), ghPages()],
  base: '/tasktrackr/',
});