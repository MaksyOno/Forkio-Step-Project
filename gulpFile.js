const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const clean = require('gulp-clean');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');

const fontsFiles = [
    './src/fonts/**.ttf'
];

const imgFiles = [
    './src/img/**/**.png',
    './src/img/**/**.svg'
];

function scripts() {
    return gulp.src('src/js/*.js')
        .pipe(terser({
            toplevel: true
        }))
        .pipe(concat('main.js'))
        .pipe(rename(function (path) {
            path.extname = ".min.js";
        }))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());
}

function forSass() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', console.error.bind(console))
        .pipe(cleanCSS({level: 2}))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        .pipe(concat('style.css'))
        .pipe(rename(function (path) {
            path.extname = ".min.css";
        }))
        .pipe(sourcemaps.write('./../css'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
}
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./src/**/*.scss', forSass);
    gulp.watch('./src/**/*.js', scripts);
}
function fonts () {
    return gulp.src(fontsFiles)
        .pipe(gulp.dest('./dist/fonts'))
}

function cleanDev (){
    return gulp.src('./dist', {read:false})
        .pipe(clean())
}

function img (){
    return gulp.src(imgFiles)
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'))
}

gulp.task('sass', forSass);
gulp.task('watch', watch);
gulp.task('scripts', scripts);
gulp.task('fonts', fonts);
gulp.task('img', img);
gulp.task('cleanDev', cleanDev);

gulp.task('build', gulp.series('cleanDev', gulp.series(img, fonts, scripts, forSass)));
gulp.task('dev', gulp.series('build', watch));