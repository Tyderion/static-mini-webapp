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
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');

var Paths = {
    base: 'app',
    dist: {
        css: 'dist/styles',
        js: 'dist/js',
        images: 'dist/images',
        fonts: 'dist/fonts',
        html: 'dist'
    },
    html: {
        main: 'app/*.html',
        all: 'app/**/*.html'
    },
    images: {
        base: 'images',
        all: 'images/**/*'
    },
    fonts: {
      base: 'fonts',
      all: 'fonts/**/*.{eot,svg,ttf,woff}'
    },
    js: {
        dest: '.tmp/js',
        libs: {
            src: 'app/lib/**/*.js',
            file: '.tmp/js/libs.js',
            dist: 'dist/js/libs.js',
            name: 'libs.js'
        },
        app: {
            src: 'app/scripts/**/*.js',
            file: '.tmp/js/main.js',
            dist: 'dist/js/main.js',
            name: 'main.js'
        }
    },
    css: {
        dest: '.tmp/styles',
        libs: {
            src: 'app/lib/**/*.css',
            file: '.tmp/styles/libs.css',
            dist: 'dist/styles/libs.css',
            name: 'libs.css'
        },
        app: {
            src: 'app/styles/**/*.css',
            file: '.tmp/styles/main.css',
            dist: 'dist/styles/main.css',
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

gulp.task('inject',['js', 'css'], function() {
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
    return gulp.src('.tmp', {
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
    gulp.watch([Paths.images.base], reload);
});

gulp.task('jshint:app', function() {
    return gulp.src(Paths.js.app.src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});
gulp.task('jshint:libs', function() {
    return gulp.src(Paths.js.libs.src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('uglify:js:app', ['js:app'], function() {
    return gulp.src([Paths.js.app.file])
        .pipe(uglify())
        .pipe(gulp.dest(Paths.dist.js));
});
gulp.task('uglify:css:app', ['css:app'], function() {
    return gulp.src([Paths.css.app.file])
        .pipe(csso())
        .pipe(gulp.dest(Paths.dist.css));
});

gulp.task('uglify:app', ['uglify:css:app', 'uglify:js:app']);

gulp.task('uglify:js:libs', ['js:libs'], function() {
    return gulp.src([Paths.js.libs.file])
        .pipe(uglify())
        .pipe(gulp.dest(Paths.dist.js));
});
gulp.task('uglify:css:libs', ['css:libs'], function() {
    return gulp.src([Paths.css.libs.file])
        .pipe(csso())
        .pipe(gulp.dest(Paths.dist.css));
});

gulp.task('uglify:libs', ['uglify:css:libs', 'uglify:js:libs']);

gulp.task('uglify', ['uglify:app', 'uglify:libs']);

gulp.task('html:dist-copy',['inject'], function() {
    return gulp.src(Paths.html.main)
        // .pipe($.minifyHtml({
        //     conditionals: true,
        //     loose: true
        // }))
        .pipe(gulp.dest(Paths.dist.html))
});

gulp.task('build:dist', ['clean', 'html:dist-copy', 'uglify', 'fonts:dist', 'images:dist']);

gulp.task('images:dist', function() {
    return gulp.src(Path.images.all)
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(Paths.dist.images));
});

gulp.task('fonts:dist', function() {
    return gulp.src(Path.fonts.all)
        .pipe(gulp.dest(Paths.dist.fonts));
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

gulp.task('build:dev', ['js', 'css', 'inject']);

gulp.task('build', [ /*'jshint', */ 'html', 'images' /*, 'fonts'*/ ], function() {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'build',
        gzip: true
    }));
});

gulp.task('default', ['clean', 'build']);
