/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-env node */

const path = require('path');
const Dotenv = require('dotenv-webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge: webpackMerge } = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');

const root = path.resolve(__dirname, '.'); // root at project/server
const common = () => ({
   target: 'node',
   context: path.resolve(root, '.'),
   entry: ['./server'],
   output: {
      path: path.resolve(root, '.'),
      filename: 'server.cjs',
   },
   plugins: [
      new ForkTsCheckerWebpackPlugin({
         typescript: {
            configFile: path.resolve(root, 'tsconfig.json'),
            configOverwrite: {
               compilerOptions: {
                  skipLibCheck: true,
                  sourceMap: false,
                  inlineSourceMap: false,
                  declarationMap: false,
               },
               exclude: ['**/*.test.js', '**/*.test.ts'],
            },
         },
      }),
      new Dotenv({ path: '.env' }),
   ],
   resolve: {
      alias: {
         '@': path.resolve(
            root,
            process.env.NEXT_PUBLIC_DEDICATED_SOCKET_SERVER === 'true'
               ? './src'
               : '../src'
         ),
      },
      extensions: ['.js', '.ts', '.json'],
   },
   module: {
      rules: [
         {
            test: /\.(j|t)s(x?)$/,
            exclude: /node_modules/,
            use: ['ts-loader'],
         },
      ],
   },
   stats: 'errors-warnings',
   externals: [nodeExternals()],
});

const dev = () => ({
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
      static: 'dist',
      hot: true,
   },
   plugins: [new NodemonPlugin()],
});

const prod = () => ({
   mode: 'production',
   devtool: 'source-map',
   optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
   },
});

module.exports = function () {
   const isProduction = process.env.NODE_ENV === 'production';
   if (isProduction) return webpackMerge(common(), prod());
   return webpackMerge(common(), dev());
};
