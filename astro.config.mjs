// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: troque pelo domínio definitivo quando ele existir.
  site: 'https://mesquitajp.com.br',
  output: 'static',
  build: {
    assets: 'assets'
  },
  compressHTML: true
});
