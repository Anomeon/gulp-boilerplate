'use strict';

    // System
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload,
    source      = require('vinyl-source-stream'),
    rimraf      = require('rimraf'),

    // JS
    babel       = require('gulp-babel'),
    browserify  = require('browserify'),
    babelify    = require('babelify'),
    uglify      = require('gulp-uglify'),

    // Styles
    sass        = require('gulp-sass'),
    prefixer    = require('gulp-autoprefixer'),
    cssmin      = require('gulp-minify-css'),
    sourcemaps  = require('gulp-sourcemaps'),

    // Markup
    jade        = require('gulp-jade');

// Error handler
function errorHandler (error) {
  console.log(error.toString());
}

// Paths
var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/img/',
    fonts: 'build/fonts/',
    svg: 'build/img/'
  },
  source: {
    jade: 'src/*.jade',
    js: 'src/javascripts/app.js',
    sass: 'src/stylesheets/style.sass',
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    svg: 'src/images/svg/**/*.svg'
  },
  watch: {
    jade: 'src/**/*.jade',
    js: 'src/javascripts/**/*.js',
    sass: 'src/stylesheets/**/*.s*ss',
    img: 'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    svg: 'src/images/svg/**/*.svg'
  },
  clean: './build/**/*.*'
};

gulp.task('jade:build', function () {
  gulp.src(path.source.jade)
    .pipe(jade())
    .on('error', errorHandler)
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream: true}));
});

gulp.task('sass:build', function () {
  gulp.src(path.source.sass)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on('error', errorHandler)
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  return browserify({entries: [path.source.js]})
  .transform(babelify, {presets: ["es2015"]})
  .bundle()
  .on('error', errorHandler)
  .pipe(source('app.js'))
  .pipe(gulp.dest(path.build.js))
  .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.source.fonts)
    .pipe(gulp.dest(path.build.fonts))
});

gulp.task('image:build', function () {
  gulp.src('src/images/**/*.{png,jpg,jpeg,PNG,JPG,JPEG}')
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream: true}));
});

// Group all build tasks to gulp:build
gulp.task('build', [
  'jade:build',
  'js:build',
  'sass:build',
  'image:build',
  'fonts:build'
]);

// Watchers
gulp.task('watch', function(){
  watch([path.watch.jade], function(event, cb) {
    gulp.start('jade:build');
  });
  watch([path.watch.sass], function(event, cb) {
    gulp.start('sass:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
});

// Web server config
var config = {
  server: {
    baseDir: "./build"
  },
  // tunnel: true,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend"
};

// Webserver task
gulp.task('webserver', function () {
    browserSync(config);
});

// Task to clean build folder
gulp.task('clean', function (cb) {
  rimraf(path.clean, cb);
});

// Gulp global task
gulp.task('default', ['build', 'webserver', 'watch']);
