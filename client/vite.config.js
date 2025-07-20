import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    allowedHosts: 'all', // allows all hosts, or replace with ['localhost']
  }
});
