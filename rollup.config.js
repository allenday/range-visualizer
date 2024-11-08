import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'iife',
      name: 'RangeVisualizerLib',
      exports: 'named'
    }
  ],
  plugins: [
    postcss({
      extract: 'styles.css',
      modules: false,
      minimize: true
    }),
    typescript({
      tsconfig: 'tsconfig.json',
      declaration: true,
      declarationDir: './dist'
    }),
    resolve(),
    commonjs()
  ]
}; 