import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/photo-gallery.js',
  output: {
    file: 'dist/photo-gallery.bundle.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    resolve(),
    terser()
  ]
};
