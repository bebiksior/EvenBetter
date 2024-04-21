import styleLoader from 'bun-style-loader';

console.log('Building...');

Bun.build({
    entrypoints: ['src/index.ts'],
    outdir: 'final',
    minify: true,
    plugins: [styleLoader()],
}).then((out) => {
    console.log('Build completed!');
    console.log(out);
});