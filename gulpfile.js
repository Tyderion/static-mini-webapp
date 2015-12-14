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
var runSequence = require('run-sequence');
var injectfile = require('gulp-inject-file');
var ext_replace = require('gulp-ext-replace');

var Paths = require('./project.config.js').paths;
var Config = require('./project.config.js').config;

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

gulp.task('inject', ['inject:html', 'js', 'css'], function() {
    return gulp.src(Paths.html.built)
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
    .pipe(gulp.dest(Paths.build));
});

gulp.task('inject:html', function() {
    return gulp.src(Paths.html.main)
    .pipe(injectfile({
                    // can use custom regex pattern here
                    // <filename> token will be replaces by filename regex pattern.
                    pattern: '<!--\\sinjectf:<filename>\\s?-->'
                }))
    .pipe(ext_replace('.html', '.tpl.html'))
    .pipe(gulp.dest(Paths.build))
})

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

gulp.task('html:dist-copy', ['inject'], function() {
    return gulp.src(Paths.html.main)
    .pipe($.minifyHtml({
        conditionals: true,
        loose: true
    }))
    .pipe(gulp.dest(Paths.dist.html))
});

gulp.task('dist:size', function() {
    return gulp.src('dist/**/*').pipe($.size({
        title: 'build',
        gzip: true
    }));
})

gulp.task('build:dist', function(cb) {
    runSequence('clean',
      ['html:dist-copy', 'uglify', 'fonts:dist', 'images:dist'],
      'dist:size',
      cb);

});

gulp.task('build:dev', ['inject']);

gulp.task('images:dist', function() {
    return gulp.src(Paths.images.all)
    .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true
    })))
    .pipe(gulp.dest(Paths.dist.images));
});

gulp.task('fonts:dist', function() {
    return gulp.src(Paths.fonts.all)
    .pipe(gulp.dest(Paths.dist.fonts));
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['build:dist'], function() {
    browserSync({
        notify: false,
        port: 9001,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: 'dist'
    });
});

// Watch Files For Changes & Reload
gulp.task('serve', ['build:dev'], function() {
    browserSync({
        notify: false,
        port: Config.port,
        // Run as an https by uncommenting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        // https: true,
        server: ['.tmp', 'app']
    });

    gulp.watch([Paths.html.all],  ['inject', reload]);
    gulp.watch([Paths.css.app.src], ['inject', reload]);
    gulp.watch([Paths.js.app.src], ['jshint', 'inject', reload]);
    gulp.watch([Paths.images.base], reload);
});

gulp.task('default', function(cb) {
  runSequence('clean', 'serve', cb);
});
