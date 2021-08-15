const path = require('path'),
	  fs = require('fs'),
	  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
	  CopyWebpackPlugin = require('copy-webpack-plugin'),
	  HtmlWebpackPlugin = require('html-webpack-plugin'),
	  FaviconsWebpackPlugin = require('favicons-webpack-plugin'),
	  webpack = require('webpack');

const PAGE_LIVE = 'index.html';
// Main const
const PATHS = {
	src: path.join(__dirname, '../src'),
	dist: path.join(__dirname, '../dist'),
	assets: 'assets/',
	pageTest: path.join(__dirname, `../dist/${PAGE_LIVE}`)
};

/* const PAGES_DIR = `${PATHS.src}/pug/pages/`,
	  PAGES = fs.readdirSync(`${PAGES_DIR}`); */

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
		path: PATHS.dist,
		publicPath: "/"
	},
	target: (process.env.NODE_ENV === "development") ? "web" : "browserslist",
	module: {
		rules: [
/* 			{
				//Pug
			test: /\.pug$/,
			loader: "pug-loader"
			}, */
			{
				//JavaScript
				test: /\.js$/,
				loader: "babel-loader",
				exclude: [
					/node_modules/,
				]
			},
				// fonts and images
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
					filename: 'assets/img/[name].[ext]'
				}
			},
			{
				// Css
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
				// Sass
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
				//typescript loader
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: `${PATHS.assets}css/[name].css`
		}),
/* 		new FaviconsWebpackPlugin({
			logo: './src/assets/icons/logo.svg',
			outputPath: './assets/favicon/',
			prefix: 'assets/favicon/',
		}), */
/* 		...PAGES.map(filename => new HtmlWebpackPlugin({
			template: `${PAGES_DIR}/${filename}/${filename}.pug`,
			filename: `${filename}.html`
		})), */
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new webpack.ProvidePlugin({
			$: `jquery`,
			jQuery: `jquery`,
			'window.jQuery': 'jquery'
		})
	],
	performance: {
		maxEntrypointSize: 2048000,
		maxAssetSize: 2048000
	}
};