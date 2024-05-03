const path = require("path");
const { defineConfig } = require("vite");
const Koa = require('koa');
const cors = require('@koa/cors');
const Banner = require("vite-plugin-banner");
const pkg = require("./package.json");
const friendlyTypeImports = require("rollup-plugin-friendly-type-imports");

const app = new Koa();

app.use(cors()); // Adicionando o middleware CORS ao app Koa

module.exports = defineConfig({
    base: "./",
    server: {
        middlewareMode: true,
        async start() {
            // Use a middleware to handle requests in Vite
            app.use(async (ctx, next) => {
                await next();
                ctx.body = "Hello Vite!";
            });

            // Start the server
            const server = app.listen(3000);
            return () => {
                server.close();
            };
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "Kalidokit",
            fileName: (format) => `kalidokit.${format}.js`,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            exports: "named",
            external: [],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {},
            },
        },
    },
    plugins: [
        Banner(
            `/**\n * @${pkg.name} v${pkg.version}\n * ${pkg.description}\n * \n * @license\n * Copyright (c) ${pkg.year} ${pkg.author}\n * SPDX-License-Identifier: ${pkg.license} \n * ${pkg.homepage}\n */`
        ),
        friendlyTypeImports(),
    ],
});
