/* jshint node:true */
'use strict';
// generated on 2015-11-20 using generator-simpler-gulp-webapp 1.0.2
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var inject = require('gulp-inject');
var rm = require('gulp-rimraf');
var jshint = require('gulp-jshint');
var plumber = require('gulp-plumber');

var Paths = {
    base: 'app',
    html: {
        main: 'app/*.html',
        all: 'app/**/*.html'
    },
    img: {
        base: 'images'
    },
    js: {
        dest: '.tmp/js',
        libs: {
            src: 'app/lib/**/*.js',
            file: '.tmp/js/libs.js',
            name: 'libs.js'
        },
        app: {
            src: 'app/scripts/**/*.js',
            file: '.tmp/js/main.js',
            name: 'main.js'
        }
    },
    css: {
        dest: '.tmp/styles',
        libs: {
            src: 'app/lib/**/*.css',
            file: '.tmp/styles/libs.css',
            name: 'libs.css'
        },
        app: {
            src: 'app/styles/**/*.css',
            file: '.tmp/styles/main.css',
            name: 'main.css'
        }
    }
}

gulp.task('css:app', function() {
    return gulp.src(Paths.css.app.src)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe($.autoprefixer({
            browsers: ['last 1 version']
        }))
        .pipe(concat(Paths.css.app.name))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(Paths.css.dest));
});
gulp.task('css:libs', function() {
    return gulp.src(Paths.css.libs.src)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(concat(Paths.css.libs.name))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(Paths.css.dest));
});

gulp.task('css', ['css:app', 'css:libs']);

gulp.task('js:libs', function() {
    return gulp.src(Paths.js.libs.src)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(concat(Paths.js.libs.name))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(Paths.js.dest));
});
gulp.task('js:app', function() {
    return gulp.src(Paths.js.app.src)
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(concat(Paths.js.app.name))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(Paths.js.dest));
});

gulp.task('js', ['js:app', 'js:libs']);

gulp.task('inject', function() {
    return gulp.src(Paths.html.main)
        .pipe(inject(gulp.src([Paths.js.libs.file, Paths.css.libs.file], {
            read: false
        }), {
            relative: true,
            ignorePath: '../.tmp',
            starttag: '<!-- inject:lib:{{ext}} -->'
        }))
        .pipe(inject(gulp.src([Paths.js.app.file, Paths.css.app.file], {
            read: false
        }), {
            relative: true,
            ignorePath: '../.tmp',
            starttag: '<!-- inject:app:{{ext}} -->'
        }))
        .pipe(gulp.dest(Paths.base));
});

gulp.task('clean:tmp', function() {
    return gulp.src('.tmp/**/*', {
            read: false
        })
        .pipe(rm())
});
gulp.task('clean:dist', function() {
    return gulp.src('dist', {
            read: false
        })
        .pipe(rm())
})

gulp.task('clean', ['clean:tmp', 'clean:dist']);

// Watch Files For Changes & Reload
gulp.task('serve', ['inject', 'js', 'css'], function() {
    browserSync({
        notify: false,
        port: 9000,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['.tmp', 'app']
    });

    gulp.watch([Paths.html.all], reload);
    gulp.watch([Paths.css.app.src], ['inject', reload]);
    gulp.watch([Paths.js.app.src], ['jshint', 'inject', reload]);
    gulp.watch([Paths.img.base], reload);
});

gulp.task('jshint', function() {
    return gulp.src(Paths.js.app.src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});


gulp.task('html', ['css', 'js'], function() {
    var assets = $.useref.assets({
        searchPath: '{.tmp,app}'
    });

    return gulp.src(Paths.html.main)
        .pipe(assets)
        .pipe($.if('*.js', $.uglify()))
        .pipe($.if('*.css', $.csso()))
        .pipe(assets.restore())
        .pipe($.useref())
        // .pipe($.if('*.html', $.minifyHtml({
        //     conditionals: true,
        //     loose: true
        // })))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
    return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
        .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        .pipe($.flatten())
        .pipe(gulp.dest('dist/fonts'));
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], function() {
    browserSync({
        notify: false,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: 'dist'
    });
});

gulp.task('watch', ['connect'], function() {
    $.livereload.listen();

    // watch for changes
    gulp.watch([
        'app/*.html',
        '.tmp/styles/**/*.css',
        'app/scripts/**/*.js',
        'app/images/**/*'
    ]).on('change', $.livereload.changed);

    gulp.watch('app/styles/**/*.scss', ['styles']);
    gulp.watch('bower.json', ['wiredep']);
});

gulp.task('build:dev', ['js', 'css', 'inject']);

gulp.task('build', [ /*'jshint', */ 'html', 'images' /*, 'fonts'*/ ], function() {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'build',
        gzip: true
    }));
});

gulp.task('default', ['clean', 'build']);
