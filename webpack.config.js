const path = require('path');
const webpack = require('webpack');

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
               'ts-loader'
            ]
         },
         {
            test: /\.html$/,
            use: 'raw-loader'
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
      new webpack.optimize.UglifyJsPlugin()
   ],
   entry: './public/js/main.ts',
   output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
   },
   devtool: debug ? 'eval-source-map' : ''
};
