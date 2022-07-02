import { defineConfig } from 'vite';
const viteVuePlugin = require('vite-plugin-vue2');


export default defineConfig({
    root: './src',
    plugins: [ viteVuePlugin.createVuePlugin({
        jsx: true,
        jsxOptions: {
            "presets": ["@vue/babel-preset-jsx"]
        }
    })],
    resolve: {
        alias: {
            '@': require('path').resolve('./src')
        },
        extensions: ['.vue', '.js', '.jsx', '.tsx']
    }
})
