const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const debug = process.env.DEBUG;

module.exports = {
   module: {
      rules: [
         {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: [
               {
                  loader: 'babel-loader',
                  options: {
                     presets: [
                        'babel-preset-env'
                     ]
                  }
               },
               'eslint-loader',
               {
                  loader: 'ts-loader',
                  options: {
                     // Transpilation happens in ForkTsCheckerWebpackPlugin.
                     transpileOnly: true
                  }
               }
            ]
         },
         {
            test: /\.html$/,
            use: 'raw-loader'
         },
         {
            test: /\.less$/,
            use: [
               { loader: 'style-loader'},
               { loader: 'css-loader'},
               { loader: 'less-loader'}
            ]
         }
      ]
   },
   resolve: {
      modules: ['public/js', 'views/current', 'node_modules'],
      extensions: [".js", ".json", ".ts"]
   },
   plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
      }),
      new ForkTsCheckerWebpackPlugin()
   ],
   entry: [
     './public/js/main.ts',
     './views/standard/less/main.less'
   ],
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
   },
   mode: debug ? 'development' : 'production'
};
