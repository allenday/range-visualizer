import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

/**
 * Rollup configuration for building the library
 * Outputs both ESM and CJS formats with TypeScript support
 */
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/index.cjs.js',
      format: 'cjs'
    }
  ],
  plugins: [
    // Handle TypeScript files
    typescript({
      tsconfig: './tsconfig.json'
    }),
    // Bundle node_modules
    resolve(),
    // Convert CommonJS modules
    commonjs(),
    // Process CSS files
    postcss({
      extract: true,
      minimize: true
    })
  ]
}; 