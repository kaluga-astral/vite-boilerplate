import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig, splitVendorChunkPlugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import dotenv from 'dotenv';

// используем dotenv, чтобы получить доступ к process.env перед началом сборки
dotenv.config();

const isProdStand =
  Boolean(process.env.VITE_STAND?.match(/production|demo|staging/));

export default defineConfig({
  plugins: [
    splitVendorChunkPlugin(),
    react(),
    svgrPlugin({ svgrOptions: { icon: true } }),
    tsconfigPaths(),
  ],
  logLevel: isProdStand ? 'error' : 'info',
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    sourcemap: !isProdStand,
    outDir: path.resolve(__dirname, 'dist'),
  },
  envPrefix: ['PUBLIC_', 'PRIVATE_']
});
