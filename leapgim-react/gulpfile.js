var coffee = require('gulp-coffee')
, gulp = require('gulp')
, gutil = require('gulp-util')
, sourcemaps = require('gulp-sourcemaps');

gulp.task('compile-coffee', function () {
    gulp.src('./app/src/*.coffee')
    .pipe(sourcemaps.init())
    .pipe(coffee({ bare: true })).on('error', gutil.log)
    .pipe(sourcemaps.write("./app/maps"))
    .pipe(gulp.dest('./app/lib'));
});

gulp.task('watch', function () {
    gulp.watch(['./app/src/*.coffee'], ['compile-coffee']);
});
