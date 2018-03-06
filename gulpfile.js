const gulp       = require('gulp'),
    browserSync  = require('browser-sync').create(),
    sass         = require('gulp-sass'),
    rename       = require('gulp-rename'),
    uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat'),
    rimraf       = require('rimraf'),
    sourcemaps   = require('gulp-sourcemaps'),
    postcss      = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache');

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            port: 3000,
            baseDir: "dist"
        },
        notify: false
    });

    gulp.watch('dist/**/*').on('change', browserSync.reload);
});

gulp.task('styles', function () {
    return gulp.src('./src/styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/jquery-parallax.js/parallax.js',
        'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
        'node_modules/mixitup/dist/mixitup.js',
        'src/js/common.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('clean', function del(cb) {
    return rimraf('dist', cb);
});

gulp.task('fonts', function() {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('html', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('autoprefixer', function () {
    return gulp.src('./dist/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([ autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('/dist/css'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*.*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('watch', function() {
    gulp.watch('src/styles/**/*.scss', gulp.series('styles'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));
    gulp.watch('src/*.html', gulp.series('html'));
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('styles', 'js', 'images', 'fonts', 'html'),
    gulp.parallel('watch', 'browser-sync')
    )
);