const path = require('path')
const fs = require('fs')

module.exports = {
    entry: {
        settings: './src/resources/settings.js',
        field: './src/resources/field.js'
    },
    // entry: './foo.js',
    mode: 'development',
    // output: {
    //     path: path.resolve(__dirname),
    //     filename: 'foo.min.js'
    // },
    output: {
        path: path.resolve(__dirname, 'src/resources'),
        filename: '[name].min.js'
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: JSON.parse(fs.readFileSync('./.babelrc'))
                },
            },
            {
                test: /\.svg$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'react-svg-loader'
                },
            }
        ]
    }
}