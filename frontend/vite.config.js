import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'], // Ensure .go files are ignored
  }
});

