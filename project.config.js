module.exports = {
    paths: {
        base: 'app',
        build: '.tmp/',
        dist: {
            css: 'dist/styles',
            js: 'dist/js',
            images: 'dist/images',
            fonts: 'dist/fonts',
            html: 'dist'
        },
        html: {
            main: 'app/*.tpl.html',
            built: '.tmp/*.html',
            all: 'app/**/*.html',
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
}
