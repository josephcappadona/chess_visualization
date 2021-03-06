const path = require('path');

module.exports = {
    entry: {
        index: './js/index.jsx',
        visualize: './js/visualize/index.jsx',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/react'],
                    }
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/,
                use: ['url-loader'],
            },
            {
                test: /\.xml$/i,
                use: 'raw-loader',
            },
        ],
    },
    node: {
        fs: "empty"
    },
    output: {
        path: path.resolve(__dirname, 'static'),
        filename: '[name].bundle.js',
    },
};