import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import dotenv from 'dotenv';

dotenv.config();

const isLocalOrDevStand =
  process.env.VITE_STAND === 'local' || process.env.VITE_STAND === 'dev';

export default defineConfig({
  plugins: [
    splitVendorChunkPlugin(),
    react(),
    svgrPlugin({ svgrOptions: { icon: true } }),
    tsconfigPaths(),
  ],
  root: 'application',
  logLevel: isLocalOrDevStand ? 'info' : 'error',
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    sourcemap: isLocalOrDevStand,
    outDir: path.resolve(__dirname, 'dist'),
  },
});
