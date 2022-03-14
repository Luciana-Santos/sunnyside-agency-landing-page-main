const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browsersync = require('browser-sync').create();

// Função que compila o sass
function scssTask() {
	return src('app/scss/style.scss', { sourcemaps: true })
		.pipe(sass())
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(dest('dist', { sourcemaps: '.' }));
}

// Converte o js para versões antigas
function jsTask() {
	return src('app/js/script.js', { sourcemaps: true })
		.pipe(concat('scrip.js'))
		.pipe(babel({ presets: ['@babel/preset-env'] }))
		.pipe(uglify())
		.pipe(dest('dist', { sourcemaps: '.' }));
}

// Browsersync
function browserSyncServe(cb) {
	browsersync.init({
		server: {
			baseDir: '.',
		},
		notify: {
			styles: {
				top: 'auto',
				bottom: '0',
			},
		},
	});
	cb();
}
function browserSyncReload(cb) {
	browsersync.reload();
	cb();
}

// Watch Task
function watchTask() {
	watch('*.html', browserSyncReload);
	watch(
		['app/scss/**/*.scss', 'app/**/*.js'],
		series(scssTask, jsTask, browserSyncReload)
	);
}

// Default Gulp Task
exports.default = series(scssTask, jsTask, browserSyncServe, watchTask);