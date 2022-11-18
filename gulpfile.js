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
const dist = './miniprogram_dist'
  
const clear = async () => await deleteAsync(dist);

const js = () => gulp
	.src(globalPaths.js)
	.pipe(terser())
	.pipe(gulp.dest(dist))

const wxss = () => gulp
	.src(globalPaths.wxss)
	.pipe(prettyData({
		type: 'minify',
		extensions: {
			wxss: 'css',
		},
	}))
	.pipe(gulp.dest(dist))

const wxml = () => gulp
	.src(globalPaths.wxml)
	.pipe(prettyData({
		type: 'minify',
		extensions: {
			wxml: 'xml',
		},
	}))
	.pipe(gulp.dest(dist))

const json = () => gulp
	.src(globalPaths.json)
	.pipe(prettyData({
		type: 'minify',
		preserveComments: true,
	}))
	.pipe(gulp.dest(dist))

export const build = gulp.series(clear, gulp.parallel(js, wxss, wxml, json))

