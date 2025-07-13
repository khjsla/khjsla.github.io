var gulp = require('gulp');
var plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const wait = require('gulp-wait');
const babel = require('gulp-babel');;
const rename = require('gulp-rename');

// for localhost:3000
var browserSync = require('browser-sync').create();

// for secu
const replace = require('gulp-replace');
const dotenv = require('dotenv');
const fileInclude = require('gulp-file-include');

// .env 값 읽기
dotenv.config();

gulp.task('scripts', function () {
    return gulp.src('./js/scripts.js')
        .pipe(plumber(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        })))
        .pipe(babel({
            presets: [['@babel/env', { modules: false }]]
        }))
        .pipe(uglify({
            output: {
                comments: '/^!/'
            }
        }))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest('./js'));
});

gulp.task('styles', function () {
    return gulp.src('./scss/styles.scss')
        .pipe(wait(250))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: './'  // index.html 위치
        },
        port: 3000       // 원하는 포트 설정
    });

    gulp.watch('./js/scripts.js', gulp.series('scripts'));
    gulp.watch('./scss/styles.scss', gulp.series('styles'));    
    gulp.watch('./index.html', gulp.series('html')).on('change', browserSync.reload);
});

gulp.task('html', function () {
    return gulp
        .src('./index.html') // 원본 HTML
        .pipe(replace('%%MY_EMAIL%%', process.env.MY_EMAIL)) // 토큰 치환
        .pipe(gulp.dest('dist')); // 결과 파일 저장
});

gulp.task('default', gulp.series('html', 'styles', 'scripts', 'watch'));
