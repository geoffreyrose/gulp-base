var autoprefixer = require('gulp-autoprefixer'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync').create(),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    gulpFilter = require('gulp-filter'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    mainBowerFiles = require('gulp-main-bower-files'),
    minifycss = require('gulp-cssnano'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    stylish = require('jshint-stylish'),
    uglify = require('gulp-uglify'),
    util = require('gulp-util');

var sassPaths = [
  'bower_components/foundation-sites/scss' //update as needed, remove if not using
];

// error handler to prevent watch task from crashing // https://andidittrich.de/2016/03/prevent-errors-from-breaking-gulp-watch.html
var errorHandler = function(){
    return plumber(function(error){
        // add indentation
        //var msg = error.codeFrame.replace(/\n/g, '\n    '); // causing issues ... need to look into
        var msg = '';
        // output styling
        util.log('|- ' + util.colors.bgRed.bold('Build Error in ' + error.plugin));
        util.log('|- ' + util.colors.bgRed.bold(error.message));
        util.log('|- ' + util.colors.bgRed('>>>'));
        util.log('|\n    ' + msg + '\n           |');
        util.log('|- ' + util.colors.bgRed('<<<'));
    });
};

gulp.task('pre-clean-styles', function() {
    return del('assets/css');
});

gulp.task('styles', ['pre-clean-styles'], function() {
    return [
        sass('src/css/scss/styles.scss', {
                style: 'compressed', // expanded compressed
                sourcemap: true,
                loadPath: sassPaths
            })
            .pipe(errorHandler())
            .pipe(autoprefixer({
                browsers: ['last 2 versions', 'ie >= 9']
            }))
            .pipe(sourcemaps.write('maps', {
                includeContent: false,
                sourceRoot: 'source'
            }))
            .pipe(gulp.dest('assets/css'))
            .pipe(notify({
                message: 'Styles task complete',
                onLast: true
            }))
           .pipe(browserSync.stream({match: '**/*.css'})),
        //sass('src/css/scss/iestyles.scss', {
        //        style: 'compressed', // expanded compressed
        //        sourcemap: true,
        //        loadPath: sassPaths
        //    })
        //    .pipe(errorHandler())
        //    .pipe(sourcemaps.write('maps', {
        //        includeContent: false,
        //        sourceRoot: 'source'
        //    }))
        //    .pipe(gulp.dest('assets/css'))
        //    .pipe(notify({
        //        message: 'IE Styles task complete',
        //        onLast: true
        //    }))
    ]
});


gulp.task('pre-clean-scripts', function() {
    return del('assets/scripts');
});

gulp.task('scripts', ['pre-clean-scripts'], function() {
    return gulp.src('src/js/**/*.js')
        .pipe(errorHandler())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(babel())
        .pipe(sourcemaps.init())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('assets/js'))
        .pipe(notify({
            message: 'Scripts task complete',
            onLast: true
        }));
});


gulp.task('pre-clean-images', function() {
    return del('assets/img');
});

gulp.task('images', ['pre-clean-images'], function() {
    return gulp.src('src/img/**/*')
        .pipe(errorHandler())
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            verbose: true
        }))
        .pipe(gulp.dest('assets/img'))
        .pipe(notify({
            message: 'Images task complete',
            onLast: true
        }));
});


gulp.task('pre-clean-bower-files', function() {
   return del(['assets/lib']);
});

gulp.task('bower-files', ['pre-clean-bower-files'], function(){
    var filterJS = gulpFilter('**/*.js', { restore: true });
    var filterIMG = gulpFilter('**/*.png', '**/*.jpg', '**/*.gif', { restore: true });

    return gulp.src('bower.json')
        .pipe(errorHandler())
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(mainBowerFiles())
        .pipe(filterJS)
        .pipe(babel())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(notify({
            message: 'bower-files [js files] task complete',
            onLast: true
        }))
        .pipe(gulp.dest('assets/lib'))
        .pipe(filterJS.restore)
        .pipe(filterIMG)
        .pipe(gulp.dest('assets/img'))
        .pipe(notify({
            message: 'bower-files [img files] task complete',
            onLast: true
        }));
});


gulp.task('watch', function() {
    browserSync.init({
        proxy: "http://localhost:8000/" //change to project's local url
    });

    //files/folders to watch
    gulp.watch('**/*.php').on('change', browserSync.reload);
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('src/css/**/*.scss', ['styles']);
    gulp.watch('src/js/**/*.js', ['scripts']).on('change', browserSync.reload);
    gulp.watch('src/img/**/*', ['images']).on('change', browserSync.reload);
});


gulp.task('clean', function() {
    return del(['assets/css', 'assets/js', 'assets/img']);
});

gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'bower-files', 'watch' );
});
