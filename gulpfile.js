var gulp = require('gulp');
var sass = require('gulp-sass');
var server = require('gulp-server-livereload');
var wait = require('gulp-wait');
var gulpif = require('gulp-if');
var useref = require('gulp-useref');
var csso = require('gulp-csso');
var prefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var rigger = require('gulp-rigger');
var rimraf = require('rimraf');
var image = require('gulp-image');

//server
gulp.task('server', function () {
	gulp
		.src('src')
		.pipe(server({
			livereload: true,
			open: true,
			port: 8088
		}));
});

//styles
gulp.task('style', function () {
	gulp
		.src('src/sass/**/*.sass')
		.pipe(wait(1500))
		.pipe(sass().on('error', sass.logError))
		.pipe(prefixer())
		.pipe(gulp.dest('src/css'));
});

//scripts
gulp.task('script', function () {
	gulp
		.src('src/scripts/*.js')
		.pipe(rigger())
		.pipe(babel({ presets: ['es2015'] }))
		.pipe(gulp.dest('src/js'));
});


// build
gulp.task('clean', function (c) {
	rimraf('./build', c);
});

gulp.task('html-build', function () {
	gulp
		.src('src/*.html')
		.pipe(useref())
		.pipe(gulpif('*.css', csso()))
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulp.dest('./build'));
});

gulp.task('img-build', function () {
	gulp
		.src('src/images/**/*.*')
		.pipe(image())
		.pipe(gulp.dest('./build/images'));
});

gulp.task('fonts-build', function () {
	gulp
		.src('src/fonts/*.*')
		.pipe(gulp.dest('./build/fonts'));
});

gulp.task('favicon-build', function () {
	gulp
		.src('src/favicon.ico')
		.pipe(gulp.dest('./build'));
});


gulp.task('build', [	
	'html-build',
	'img-build',
	'fonts-build',
	'favicon-build'
]);


// watch
gulp.task('watch', function () {
	gulp.watch('src/sass/**/*.sass', ['style']);
	gulp.watch('src/scripts/**/*.js', ['script']);
});

gulp.task('default', ['server', 'watch']);

