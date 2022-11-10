const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PAGE_LIVE = 'index.html';
const PATHS = {
	src: path.join(__dirname, '../src'),
	dist: path.join(__dirname, '../dist'),
	assets: 'assets/',
	pageTest: path.join(__dirname, `../dist/${PAGE_LIVE}`)
};

module.exports = {
	externals: {
		paths: PATHS,
		page: PAGE_LIVE
	},
	entry: './src/index.ts',
	resolve: {
		extensions: ['.ts', '.tsx', '.js'],
	},
	output: {
		filename: `${PATHS.assets}app/[name].js`,
		path: PATHS.dist
	},
	target: (process.env.NODE_ENV === "development") ? "web" : "browserslist",
	module: {
		rules: [
			{
				test: /\.pug$/,
				loader: "pug-loader"
			},
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: [
					/node_modules/,
				]
			},
			{
				test: /\.(ttf|eot|woff|woff2)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/fonts/[name].[ext]'
				}
			},
			{
				test: /\.(svg|png|jpg)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/img/[name][ext]'
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader"
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								path: './postcss.config.js'
							}
						}
					}
				]
				
			},
			{
				test: /\.sass$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader"
					},
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								path: './postcss.config.js'
							}
						}
					}, 
					{
						loader: "sass-loader"
					},
				]
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			}
		]
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: `${PATHS.src}/${PATHS.assets}favicon`,
					to: `${PATHS.assets}favicon`
				}
			]
		}),
		new MiniCssExtractPlugin({
			filename: `${PATHS.assets}css/[name].css`
		}),
		new HtmlWebpackPlugin({
			template: 'src/demo/index.pug',
			scriptLoading: 'blocking'
		}),
		new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
	],
	performance: {
		maxEntrypointSize: 2048000,
		maxAssetSize: 2048000
	}
};
