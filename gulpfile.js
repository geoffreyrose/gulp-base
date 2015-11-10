var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create(),
    del = require('del');
 

gulp.task('styles', function() {
  return sass('src/css/scss/styles.scss', { style: 'compressed', sourcemap: true }) //expanded
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
    }))
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: 'source'
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(notify({ message: 'Styles task complete' }))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write(''))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});


gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
    return del(['assets/css', 'assets/js', 'assets/img']);
});


gulp.task('default', ['clean'], function() {
    gulp.start('browser-sync', 'styles', 'scripts', 'images');
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:8888" //change to project local url
    });
});

gulp.task('watch', function() {
  browserSync.init({
    proxy: "localhost:8888" //change to project local url
  });

  gulp.watch("**/*.php").on('change', browserSync.reload);
  gulp.watch("**/*.html").on('change', browserSync.reload);

  // Watch .scss files
  gulp.watch('src/css/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']).on('change', browserSync.reload);

  // Watch image files
  gulp.watch('src/img/**/*', ['images']).on('change', browserSync.reload);

});