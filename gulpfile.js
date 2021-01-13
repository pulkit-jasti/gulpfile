const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

gulp.task('copy', cb => {
	gulp.src('src/*.js').pipe(gulp.dest('dist'));
	cb();
});

gulp.task('image-min', cb => {
	gulp.src('src/images/**')
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 50, progressive: true }),
				imagemin.optipng({ optimizationLevel: 100 }),
			])
		)
		.pipe(gulp.dest('dist/images'));
	cb();
});

gulp.task('htmlmin',cb=>{
	gulp.src('src/*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.stream({match: 'dist/*.html'}));
	
	cb()
})

gulp.task('sass', cb => {
	gulp.src('src/scss/*.scss')
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(autoprefixer({cascade: false}))
		.pipe(rename({
			suffix: '.min',
			extname: ".css"
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream({match: '**/*.css'}));

	cb();
});

gulp.task('js', cb => {
	gulp.src('src/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));

	cb();
});

gulp.task('task1',cb=>{
	console.log('task 1');
	cb();
})

gulp.task('task2',cb=>{
	console.log('task 2');
	cb();
})

gulp.task('watch',gulp.series('htmlmin','sass', cb=>{
	browserSync.init({
		injectChanges: true,
		server: './dist'
	})

	//gulp.series('htmlmin','task1')
	gulp.watch('src/*.html').on('change',gulp.series('htmlmin',browserSync.reload))
	gulp.watch('src/scss/*.scss',gulp.series('sass','task2'))
	cb();
}))