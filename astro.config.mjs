import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import prefetch from '@astrojs/prefetch';
import path from 'path';
import remarkBlock from './plugins/remark-block.mjs';
import remarkFlow from './plugins/remark-flow.mjs';
import remarkBreaks from 'remark-breaks'
import Directive from 'remark-directive';
import robotsTxt from "astro-robots-txt";
import sitemap from "@astrojs/sitemap";
import browserslist from "browserslist";
import { resolveToEsbuildTarget } from "esbuild-plugin-browserslist";

import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax'

// https://astro.build/config
export default defineConfig({
  site: 'https://pure-wiki.netlify.app/',
  server: {
    port: 3311
  },
  markdown: {
    syntaxHighlight: 'prism',
    extendDefaultPlugins: true,
    remarkPlugins: [Directive, [remarkBlock, {}], remarkMath, remarkFlow, remarkBreaks],
    rehypePlugins: [rehypeMathjax],
  },
  integrations: [
    prefetch({
      selector: "a[href^='/post']",
      throttle: 3
    }),
    sitemap(),
    robotsTxt(),
  ],
  vite: {
    build: {
        cssTarget: resolveToEsbuildTarget(browserslist(), {
            printUnknownTargets: false
        })
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ` @import "@blog/styles/_global.scss"; `,
        },
      },
    },
    ssr: {
      external: ['svgo'],
    },
    resolve: {
      alias: {
        '@root': path.resolve('./'),
        '@blog': path.resolve('./src'),
        '#': path.resolve('./typings'),
      },
    },
    plugins: [],
  },
});
