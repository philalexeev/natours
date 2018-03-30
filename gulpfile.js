var gulp         = require('gulp'), // Подключаем Gulp
  	sass         = require('gulp-sass'), //Подключаем Sass пакет,
  	browserSync  = require('browser-sync'), // Подключаем Browser Sync
  	uglify       = require('gulp-uglify'), // Подключаем gulp-uglify (для сжатия JS)
  	csso         = require('gulp-csso'), // Подключаем пакет для минификации CSS
    fileinclude  = require('gulp-file-include'), // Простой инклудер
  	imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
  	pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
  	cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
    rename       = require('gulp-rename'), // Для изменения имени минимизированным файлам
  	autoprefixer = require('autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
    mqpacker     = require('css-mqpacker'), // Обрабатываем медиавыражения
    htmlmin      = require('gulp-htmlmin'), // Для минимизации html
    postcss      = require('gulp-postcss'),
		ghpages      = require('gulp-gh-pages'),
		wait         = require('gulp-wait'),
		plumber      = require('gulp-plumber'),
		svgsprite    = require("gulp-svg-sprites"),
		svgmin       = require('gulp-svgmin');

////////////////////////////////////////////////
/////////////   SASS COMPILING

gulp.task('sass', function(){ // Создаем таск Sass
  var plugins = [
      autoprefixer({browsers: ['last 5 version'], cascade: true}),
      mqpacker({sort: true})
  ];
	return gulp.src('src/scss/style.scss') // Берем источник
		.pipe(wait(500))
		.pipe(plumber())
		.pipe(sass()) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(postcss(plugins))
		.pipe(gulp.dest('build/css')) // Выгружаем результата в папку build/css
    .pipe(csso())
    .pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.stream()) // Обновляем CSS на странице при изменении
});

////////////////////////////////////////////////
/////////////   SCRIPTS COMPILING

gulp.task('scripts', function() {
	return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
		.pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream())
});

////////////////////////////////////////////////
/////////////   HTML INCLUDE/MINIMIZER

gulp.task('html', function(){
	return gulp.src('src/*.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
		.pipe(browserSync.stream())
});

////////////////////////////////////////////////
/////////////   IMAGES MINIMIZER

gulp.task('img', function() {
	return gulp.src('src/img/**/*.{jpg, png, gif, jpeg}') // Берем все изображения из src
		.pipe(cache(imagemin({ // С кешированием
		// .pipe(imagemin({ // Сжимаем изображения без кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('build/img')); // Выгружаем на продакшен
});

////////////////////////////////////////////////
/////////////   BROWSER SYNC

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "build/"
        }
    });
});

////////////////////////////////////////////////
/////////////   VIDEO COPYING

gulp.task('video', function() {
	return gulp.src('src/video/*.*')
		.pipe(gulp.dest('build/video'))
});

////////////////////////////////////////////////
/////////////   GITHUB DEPLOYING

gulp.task('gh-pages', function() {
  return gulp.src('build/**/*.*')
    .pipe(ghpages({branch: 'master'}));
});

////////////////////////////////////////////////
/////////////   SVG-SPRITE CREATING

gulp.task('svgsprite', function () {
	return gulp.src('src/img/icons/*.svg')
			.pipe(svgsprite({mode: "symbols", preview: false}))
			.pipe(gulp.dest('src/img/icons'))
			.pipe(gulp.dest('build/img/icons'));
});

////////////////////////////////////////////////
/////////////   TASKS

gulp.task('default', ['browser-sync', 'sass', 'scripts', 'html', 'img', 'video'], function() {
	gulp.watch('src/scss/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('src/**/*.html', ['html']); // Наблюдение за HTML файлами
	gulp.watch('src/js/**/*.js', ['scripts']);   // Наблюдение за JS файлами в папке js
	gulp.watch('src/video/**/*.*', ['video']);   // Наблюдение за видео файлами
	gulp.watch('src/img/**/*.{jpg, png, gif, jpeg}', ['img']);   // Наблюдение за фото
});

gulp.task('build', ['img', 'sass', 'scripts', 'html', 'gh-pages'], function() {
	console.log('Build task is done!');
});
