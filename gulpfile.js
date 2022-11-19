import gulp from 'gulp';
import { deleteAsync } from 'del';
import terser from 'gulp-terser';
import prettyData from 'gulp-pretty-data';

const src = './src'

const globalPaths = {
	js: [`${src}/**/*.js`],
	wxml: [`${src}/**/*.wxml`],
	wxss: [`${src}/**/*.wxss`],
	json: [`${src}/**/*.json`],
}

const BUILD_PATH = {
	dist: './miniprogram_dist',
	example: './example/wx-drag-img'
}

// 编译输出路径
let buildPath = BUILD_PATH.dist

/**
 * 切换编译输出路径
 * @param {*} path 
 */
const toggleBuildPath = async () => {
	buildPath = BUILD_PATH.example
}

const clear = async () => await deleteAsync(buildPath);

const js = () => gulp
	.src(globalPaths.js)
	.pipe(terser())
	.pipe(gulp.dest(buildPath))

const wxss = () => gulp
	.src(globalPaths.wxss)
	.pipe(prettyData({
		type: 'minify',
		extensions: {
			wxss: 'css',
		},
	}))
	.pipe(gulp.dest(buildPath))

const wxml = () => gulp
	.src(globalPaths.wxml)
	.pipe(prettyData({
		type: 'minify',
		extensions: {
			wxml: 'xml',
		},
	}))
	.pipe(gulp.dest(buildPath))

const json = () => gulp
	.src(globalPaths.json)
	.pipe(prettyData({
		type: 'minify',
		preserveComments: true,
	}))
	.pipe(gulp.dest(buildPath))

export const example = gulp.series(toggleBuildPath, clear, gulp.parallel(js, wxss, wxml, json))
export const build = gulp.series(clear, gulp.parallel(js, wxss, wxml, json))

