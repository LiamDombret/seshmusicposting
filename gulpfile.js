// dependencies
const { parallel, dest, src, watch, series } = require('gulp');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const flatten = require('gulp-flatten');

sass.compiler = require('node-sass');

// individual tasks
function styles(cb) {
	return src('src/scss/*.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(postcss([
            autoprefixer(),
            // cssnano()
        ]))
        .pipe(flatten())
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

function markup() {
    return src('src/*.html')
        .pipe(dest('dist'));
}

 function php() {
    return src('src/*.php')
	 .pipe(dest('dist'));
 }

function scripts() {
    return src('src/js/*.js')
        .pipe(concat('scripts.js'))
        .pipe(dest('dist/js'));
}

function watchAll() {
    // browser sync
    browserSync.init({
        // You can tell browserSync to use this directory and serve it as a mini-server
        //server: {
          //  baseDir: "./dist/"
        // }
        proxy: "localhost/sesh/dist/"
    });

    styles();
    markup();
    php();
    scripts();

    watch('src/scss/*.scss', styles);
    watch('src/*.html').on('change', function() {
        markup();
        browserSync.reload();
    });
    watch('src/*.php').on('change', function() {
        php();
        browserSync.reload();
    });
    watch('src/js/*.js').on('change', function() {
        scripts();
        browserSync.reload();
    });
}

// default task with task sequence
exports.default = parallel(markup, styles, scripts);
exports.styles = styles;
exports.markup = markup;
exports.scripts = scripts;
exports.php = php;
exports.watch = watchAll;
