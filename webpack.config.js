const path = require('path');

module.exports = {
  mode: 'production',
  entry: './content/content.js',
  output: {
    filename: 'content.js',
    path: path.resolve(__dirname, 'dist/chrome'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  target: 'web',
};
