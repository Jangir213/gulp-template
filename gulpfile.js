'use strict';

var gulp = require('gulp'),
prefixer = require('gulp-autoprefixer'),
gulpif = require('gulp-if'),
minify = require('gulp-minify-css'),
sass = require('gulp-sass'),
uncss = require('gulp-uncss'),
wiredep = require('wiredep').stream,
useref = require('gulp-useref'),
browserSync = require('browser-sync'),
rimraf = require('rimraf'),
reload = browserSync.reload;

//path 
var path = {
	build: { 
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/'
	},
	src: { 
		html: 'src/*.html', 
		js: 'src/js/main.js',
		style: 'src/style/main.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	watch: { 
		html: 'src/**/*.html',
		js: 'src/js/**/*.js',
		style: 'src/style/**/*.scss',
		img: 'src/img/**/*.*',
		fonts: 'src/fonts/**/*.*'
	},
	clean: './build'
};

//server config
var config = {
	server: {
		baseDir: "./build"
	},
	tunnel: true,
	host: 'localhost',
	port: 9000,
	logPrefix: "WebServer"
};


//build
gulp.task('html', function () {	
	gulp.src(path.src.html)	
	.pipe(useref())
	.pipe(gulpif('*.css', uncss({
		html : ['build/index.html']
	})))
	.pipe(gulpif('*.css', minify()))
	.pipe(gulp.dest(path.build.html))
	.pipe(reload({stream: true})); 
});

gulp.task('style', function () {
	gulp.src(path.src.style)         
	.pipe(sass()) 
	.pipe(prefixer()) 
	.pipe(minify())
	.pipe(gulp.dest(path.build.css)) 
	.pipe(reload({stream: true}));
});

gulp.task('image', function () {
	gulp.src(path.src.img)
	.pipe(gulp.dest(path.build.img))
	.pipe(reload({stream: true}));
});

gulp.task('fonts', function() {
	gulp.src(path.src.fonts)
	.pipe(gulp.dest(path.build.fonts))
});

//start all
gulp.task('build', [
	'html',
	'style',
	'fonts',
	'image'
	]);

//bower
gulp.task('bower', function () {
	gulp.src('./src/index.html')
	.pipe(wiredep({
		directory : "./bower_components"
	}))
	.pipe(gulp.dest('./src'));
});

//watch
gulp.task('watch', function(){
	gulp.watch('bower.json', ['bower']);
	gulp.watch([path.watch.html], ['html']);
	gulp.watch([path.watch.style], ['style']);
	gulp.watch([path.watch.img], ['image']);
	gulp.watch([path.watch.fonts], ['fonts']);	
});

//clean
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

//webserver
gulp.task('webserver', function () {
	browserSync(config);
});

//default
gulp.task('default', ['build', 'webserver', 'watch']);