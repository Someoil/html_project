let
  gulp = require('gulp'),
  sass = require('gulp-sass'), // scss =>css
  browserSync = require('browser-sync'), // синхронизация окон браузеров
  cheerio = require('gulp-cheerio'), // удаление атрибутов
  replace = require('gulp-replace'), // замена символов
  svgSprite = require('gulp-svg-sprite'), // спрайт свг
  sourcemaps = require('gulp-sourcemaps'), //карта для браузера
  autoprefixer = require('gulp-autoprefixer'), // автопрефиксер
  cleanCSS = require('gulp-clean-css'), // минификациия CSS
  rename = require('gulp-rename'), // переименование файла
  babel = require('gulp-babel'),  // babel
  uglify = require('gulp-uglify'),  // сжатие js
  tinypng = require('gulp-tinypng'); // уменьшаем png
  favicons = require('gulp-favicons'); // генерация favicon
  concat = require('gulp-concat'), // объединение файлов


gulp.task('scss', function() { // работа с основным scss файлом
  return gulp.src('css/style.scss')
    .pipe(sourcemaps.init()) // sourcemap scss
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions'], {
      cascade: true
    })) // автопрефиксер 15 последних версий
    .pipe(cleanCSS()) // сжимаем
    .pipe(rename({
      suffix: '.min'
    })) // переименовываем с постфиксом .min
    .pipe(sourcemaps.write('.')) //создаем файл sourcemap
    .pipe(gulp.dest('css')) // выгружаем результат в css
    .pipe(browserSync.reload({
      stream: true
    })); // обновляем браузер при изменении
});

gulp.task('libs-css', function() { // работы с css файлами библиотек
  return gulp.src('css/libs/**/**/*.css')
    .pipe(concat('lib.min.css')) // объединяем все файлы
    .pipe(cleanCSS()) // минифицируем
    .pipe(gulp.dest('css')) // выгружаем результат в app/css
    .pipe(browserSync.reload({
      stream: true
    })); // обновляем браузер при изменении
});

gulp.task('js', function() { //работа с основным js файлом
  return gulp.src('js/custom.js')
  .pipe(sourcemaps.init()) //  sourcemap
    .pipe(babel({presets: ['@babel/preset-env']})) //babel
    .pipe(uglify()) //сжатие
    .pipe(rename({
      suffix: '.min'
    })) // переименовываем с постфиксом .min
    .pipe(sourcemaps.write('.')) //создаем файл sourcemap
    .pipe(gulp.dest('js')) // выгружаем результат в js
    .pipe(browserSync.reload({
      stream: true
    })); // обновляем браузер при изменении
});

gulp.task('libs-js', function() { // работы с js файлами библиотек
  return gulp.src([
      'js/libs/jquery-3.4.1.min.js',
      'js/libs/jquery-migrate.min.js',
      'js/libs/svg4everybody.min.js',
    ])
    .pipe(concat('lib.min.js')) // объединяем все файлы
    .pipe(uglify()) //сжатие
    .pipe(gulp.dest('js')) // выгружаем результат в app/js
    .pipe(browserSync.reload({ // обновляем браузер при изменении
      stream: true
    }));
});

gulp.task('favicon', function () { //создаем фавиконки
    return gulp.src('app/favicon.{jpg,jpeg,png,gif,ico}')
    .pipe(favicons({
      icons: {
        appleIcon: true,
        favicons: true,
        online: false,
        appleStartup: false,
        android: true,
        firefox: false,
        yandex: false,
        windows: false,
        coast: false
      }
    }))
    .pipe(gulp.dest('app/favicons/'));
});

//svg sprite
gulp.task('sprite', function() {
  return gulp.src('img/icons/**/**/*.svg') // svg files for sprite
    .pipe(cheerio({
      run: function($) {
        // $('[fill]').removeAttr('fill');
        // $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
      mode: {
        symbol: {
          sprite: "../sprite.svg" //sprite file name
        }
      },
    }))
    .pipe(gulp.dest('img/'))
});


gulp.task('tinypng', function () { // уменьшаем картинки
	// return gulp.src('img/**/**/**/*.png')
  return gulp.src('img/**/**/**/*.jpg')
		.pipe(tinypng('vpZbmVybC3lBHnvBXX7wxnBzyhldQwYM'))
		.pipe(gulp.dest('img'));
});


gulp.task('browser-sync', function() { // синхронизация окон браузеров
  browserSync({
    server: {
      baseDir: './' // директория для сервера
    },
    notify: false // отключаем уведомления
  });
});

gulp.task('watch', function() { //отслеживание изменений
  gulp.watch("**/**/*.php").on('change', browserSync.reload); // отслеживаем изменения в php, обновляем браузер при изменении
  gulp.watch("**/**/*.html").on('change', browserSync.reload); // отслеживаем изменения в html, обновляем браузер при изменении
  gulp.watch(['js/custom.js'], gulp.parallel('js')); // при изменении custom.js файлов запускает js
  gulp.watch('css/scss/**/*.scss', gulp.parallel('scss')); // при изменении scss файлов запускает scss
  gulp.watch('img/icon/**/**/*.svg', gulp.parallel('sprite')); // при изменении svg файлов запускает svgSprite
});


gulp.task('default', gulp.parallel('scss', 'libs-css', 'js', 'libs-js', 'browser-sync', 'sprite', 'watch')); // отладка по дефолту команда 'gulp'
