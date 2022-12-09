/// <reference types="vitest" />

import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    build: {
        commonjsOptions: {
            // This fixed 'exports is not defined' errors caused by some
            // third-party dependencies (class-transformer-validator, in this case)
            transformMixedEsModules: true,
        },
    },
    plugins: [
        // Point tsConfigPaths to the root of the project
        tsconfigPaths({
            loose: true,
            root: '../../../',
        }),

        // Although vite itself has no problem with decorators in TypeScript, they cause
        // qwik to throw an error. But they are used extensively in the domain objects
        // library, so we have to transpile them away before they reach qwik
        babel({
            filter: /\.(ts|js)?$/,
            babelConfig: {
                // Ignore the .babelrc files in library folders
                babelrc: false,

                plugins: [
                    ['@babel/plugin-transform-typescript'],

                    // legacy: true fixes errors about using 'export' between a decorator
                    // and a class
                    ['@babel/plugin-proposal-decorators', { legacy: true }],

                    // Not sure if loose: true is necessary...
                    ['@babel/plugin-proposal-class-properties', { loose: true }],
                ],
            },
        }),

        qwikCity(),
        qwikVite(),
    ],
    preview: {
        headers: {
            'Cache-Control': 'public, max-age=600',
        },
    },
    server: {
        open: true,
    },
    test: {
        globals: true,
        cache: {
            dir: '../../../node_modules/.vitest',
        },
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        coverage: {
            reportsDirectory: '../../../coverage/apps/frontend/admin',
        },
    },
});
