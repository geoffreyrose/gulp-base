var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    mainBowerFiles = require('gulp-main-bower-files'),
    babel = require('gulp-babel'),
    gulpFilter = require('gulp-filter'),
    util = require('gulp-util'),
    plumber = require('gulp-plumber');

var sassPaths = [
  'bower_components/foundation-sites/scss' //remove if not using foundation with bower
];

var util = require('gulp-util');
var plumber = require('gulp-plumber');
// our custom error handler
var errorHandler = function(){
    // default appearance
    return plumber(function(error){
        // add indentation
        var msg = error.codeFrame.replace(/\n/g, '\n    ');
        // output styling
        util.log('|- ' + util.colors.bgRed.bold('Build Error in ' + error.plugin));
        util.log('|- ' + util.colors.bgRed.bold(error.message));
        util.log('|- ' + util.colors.bgRed('>>>'));
        util.log('|\n    ' + msg + '\n           |');
        util.log('|- ' + util.colors.bgRed('<<<'));
    });
};


gulp.task('styles', function() {
  return sass('src/css/scss/styles.scss', { style: 'compressed', sourcemap: true, loadPath: sassPaths  }) // expanded compressed
    .pipe(errorHandler())
    .pipe(autoprefixer({
        browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: 'source'
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(notify({ message: 'Styles task complete' }))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('iestyles', function() {
  return sass('src/css/scss/iestyles.scss', { style: 'compressed', sourcemap: true, loadPath: sassPaths  }) // expanded compressed
    .pipe(errorHandler())
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: 'source'
    }))
    .pipe(gulp.dest('assets/css'))
    .pipe(notify({ message: 'Styles task complete' }))
});

gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(errorHandler())
    .pipe(babel())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(sourcemaps.init())
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write(''))
    .pipe(gulp.dest('assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});


gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(errorHandler())
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
    return del(['assets/css', 'assets/js', 'assets/img']);
});


gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'bower-files' );
});

gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "http://localhost:8888/" //change to project's local url
    });
});
 
gulp.task('pre-bower-files', function(){
    var filterJS = gulpFilter('**/*.js', { restore: true });
    var filterIMG = gulpFilter('**/*.png', '**/*.jpg', '**/*.gif', { restore: true });

    return gulp.src('bower.json')
        .pipe(errorHandler())
        .pipe(mainBowerFiles())
        .pipe(gulp.dest('assets/lib/delete')) //temporary folder, needed to trick it into loading in my .babelrc file, the files created are useless because if they are written with ES20015 and they won't really work unless they are ran through babel.
        .pipe(filterJS)
        .pipe(babel())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('assets/lib'))
        .pipe(filterJS.restore)
        .pipe(filterIMG)
        .pipe(gulp.dest('assets/img'));
});

gulp.task('bower-files', ['pre-bower-files'],  function() {
    return del(['assets/lib/delete']); //delete temporary folder
});

gulp.task('watch', function() {
  browserSync.init({
    proxy: "http://localhost:8888/" //change to project's local url
  });

  gulp.watch("**/*.php").on('change', browserSync.reload);
  gulp.watch("**/*.html").on('change', browserSync.reload);

  // Watch .scss files
  gulp.watch('src/css/**/*.scss', ['styles']);
  gulp.watch('src/css/**/*.scss', ['iestyles']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']).on('change', browserSync.reload);

  // Watch image files
  gulp.watch('src/img/**/*', ['images']).on('change', browserSync.reload);

});