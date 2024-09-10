const gulp = require('gulp');
const fs = require('fs');

const lintHTML = require('gulp-htmllint');
const lintCSS = require('gulp-stylelint');
const lintJS = require('gulp-eslint');
const deleteFiles = require('gulp-rimraf');
const minifyHTML = require('gulp-minify-html');
const minifyCSS = require('gulp-clean-css');
const minifyJS = require('gulp-terser');
//const minifyJS = require('gulp-babel-minify');
//const terser = require('terser');
const concat = require('gulp-concat');
const replaceHTML = require('gulp-html-replace');
const imagemin = require('gulp-imagemin');
const zip = require('gulp-zip');
const checkFileSize = require('gulp-check-filesize');

const roadroller = require('roadroller');
//const babel = require("gulp-babel");
//const plumber = require("gulp-plumber");

const paths = {
    src: {
        html: 'src/**.html',
        css: 'src/**.css',
        js: [
            'src/basic_stuff.js',
            'src/inputgamepad.js',
            'src/inputkeyboard.js',
            'src/spritebuffer.js',
            'src/camera.js',
            'src/point.js',
            'src/pointchain.js',
            'src/player.js',
            'src/particle.js',
            'src/snake.js',
            'src/squid.js',
            'src/enemy.js',
            'src/musicplayer.js',
            'src/music.js',
            'src/song_airwolf.js',
            'src/sfx_laser.js',
            'src/sfx_explosion.js',
            'src/sfx_hit.js',
            'src/sfx_engine.js',
            'src/triskaideka.js',
            'src/hud.js',
            'src/menu.js',
            'src/levels.js',
            'src/game.js',
            'src/game_start.js',
        ]
    },
    dist: {
        dir: 'dist',
        css: 'style.min.css',
        jsTemp: 'fear13.temp.js',
        js: 'fear13.min.js'
    }
};

gulp.task('lintHTML', () => {
    return gulp.src('src/**.html')
        .pipe(lintHTML());
});

gulp.task('lintCSS', () => {
    return gulp.src(paths.src.css)
        .pipe(lintCSS({
            reporters: [{ formatter: 'string', console: true }]
        }));
});

gulp.task('lintJS', () => {
    return gulp.src(paths.src.js)
        .pipe(lintJS())
        .pipe(lintJS.failAfterError());
});

gulp.task('cleanDist', () => {
    return gulp.src('dist/**/*', { read: false })
        .pipe(deleteFiles());
});

gulp.task('buildHTML', () => {
    return gulp.src(paths.src.html)
        .pipe(replaceHTML({
            css: paths.dist.css,
            js: paths.dist.js
        }))
        .pipe(minifyHTML())
        .pipe(gulp.dest(paths.dist.dir));
});

gulp.task('buildCSS', () => {
    return gulp.src(paths.src.css)
        .pipe(concat(paths.dist.css))
        .pipe(minifyCSS({level: 2}))
        .pipe(gulp.dest(paths.dist.dir));
});

async function roadRollJs() {
    let jsString = fs.readFileSync(paths.dist.dir + '/' + paths.dist.jsTemp, 'utf8');
    
    const packer = new roadroller.Packer([
        {
            data: fs.readFileSync(paths.dist.dir + '/' + paths.dist.jsTemp, 'utf8'),
            type: 'js',
            action: 'eval'
        }
    ]);
    await packer.optimize(1);
    const { firstLine, secondLine } = packer.makeDecoder();
    jsString = firstLine + secondLine;
    
    fs.writeFileSync(paths.dist.dir + '/' + paths.dist.js, jsString, 'utf8');
    fs.unlink(paths.dist.dir + '/' + paths.dist.jsTemp, (err)=>{});
}

gulp.task('buildJS', () => {
    return gulp.src(paths.src.js)
        .pipe(concat(paths.dist.jsTemp))
        .pipe(minifyJS({
            "toplevel": true
        }))
        .pipe(gulp.dest(paths.dist.dir));
    
    //roadRollJs()
    //    .pipe(roadRollJs());
});

gulp.task('optimizeImages', () => {
    return gulp.src(paths.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dist.images));
});

gulp.task('zip', () => {
    const thirteenKb = 13 * 1024;

    gulp.src('zip/*')
        .pipe(deleteFiles());

    return gulp.src(`${paths.dist.dir}/**`)
        .pipe(zip('fear13.zip'))
        .pipe(gulp.dest('zip'))
        .pipe(checkFileSize({ fileSizeLimit: thirteenKb }));
});

gulp.task('test', gulp.parallel(
    'lintHTML',
    'lintCSS',
    'lintJS'
));

gulp.task('build', gulp.series(
    'cleanDist',
    gulp.parallel('buildHTML', 'buildCSS', 'buildJS' ), //'optimizeImages'
    roadRollJs,
    'zip'
));

gulp.task('watch', () => {
    gulp.watch(paths.src.html, gulp.series('build'));
    gulp.watch(paths.src.css, gulp.series('build'));
    gulp.watch(paths.src.js, gulp.series('build'));
    //gulp.watch(paths.src.images, gulp.series('optimizeImages', 'zip'));
});

gulp.task('default', gulp.series(
    'build',
    'watch'
));