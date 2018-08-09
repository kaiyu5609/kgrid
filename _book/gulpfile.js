'use strict';

const gulp = require('gulp');
const minifyCss = require('gulp-minify-css');
const less = require('gulp-less');
const uglify = require('gulp-uglify');
const jshint = require('gulp-jshint');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');

const browserify = require('browserify');
const shim = require('browserify-shim');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

const port = process.env.port || 5000;

gulp.task('jshint', () => {
	return gulp.src('./src/**/*.js')
	.pipe(jshint())
	.pipe(jshint.reporter());
});

gulp.task('less', ['theme-default', 'theme-black'], () => {

});

gulp.task('theme-default', () => {
    return gulp.src('./src/theme/default.less')
	.pipe(less())
    .pipe(minifyCss())
    .pipe(sourcemaps.init({
		loadMaps: true
	}))
    .pipe(clean())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./release/'));
});

gulp.task('theme-black', () => {
    return gulp.src('./src/theme/black.less')
	.pipe(less())
    .pipe(minifyCss())
    .pipe(sourcemaps.init({
		loadMaps: true
	}))
    .pipe(clean())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./release/'));
});

gulp.task('browserify', () => {
	return browserify({
		entries: ['./src/index.js'],
		standalone: 'Kgrid',
		debug: true
	})
	.transform('babelify', {
		presets: ['es2015']
	})
	// .external(['jquery'])
	.bundle()
	.pipe(source('kgrid.js'))
	.pipe(buffer())
	.pipe(sourcemaps.init({
		loadMaps: true
	}))
	.pipe(gulp.dest('./release/'))
	.pipe(uglify())
	.pipe(rename('kgrid.min.js'))
	.pipe(sourcemaps.write('./'))
	.pipe(gulp.dest('./release/'));
});

gulp.task('b', () => {
	return browserify({

	})
	.require('jquery')
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(buffer())
	.pipe(gulp.dest('./app/lib'));
})

gulp.task('connect', () => {
	connect.server({
		root: './',
		port: port,
		livereload: true
	});
});

gulp.task('css', () => {
	gulp.src('./release/**/*.css')
	.pipe(connect.reload());
});

gulp.task('js', () => {
	gulp.src('./release/**/*.js')
	.pipe(connect.reload());
});

gulp.task('watch', () => {
    gulp.watch('./release/**/*.css', ['css']);
    gulp.watch('./release/**/*.js', ['js']);
	
    gulp.watch('./src/**/*.less', ['less']);
	gulp.watch('./src/**/*.js', ['browserify']);
});

gulp.task('default', ['less', 'browserify']);
gulp.task('serve', ['browserify', 'connect', 'watch']);