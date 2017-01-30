'use strict';

    // System
var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload,
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    rimraf      = require('rimraf'),
    concat      = require('gulp-concat'),
    util        = require('gulp-util'),

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
    html:  'build/',
    js:    'build/js/',
    css:   'build/css/',
    img:   'build/img/',
    fonts: 'build/fonts/',
    svg:   'build/img/'
  },
  source: {
    jade:  'src/*.jade',
    js:    'src/javascripts/app.js',
    sass:  'src/stylesheets/style.sass',
    img:   'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    svg:   'src/images/svg/**/*.svg'
  },
  watch: {
    jade:  'src/**/*.jade',
    js:    'src/javascripts/**/*.js',
    sass:  'src/stylesheets/**/*.s*ss',
    img:   'src/images/**/*.*',
    fonts: 'src/fonts/**/*.*',
    svg:   'src/images/svg/**/*.svg'
  },
  clean:   './build/**/*.*',
  libraries: [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/foundation-sites/dist/plugins/foundation.core.js',
    './node_modules/foundation-sites/dist/plugins/foundation.util.mediaQuery.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.abide.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.accordion.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.accordionMenu.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.drilldown.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.dropdown.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.dropdownMenu.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.equalizer.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.interchange.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.magellan.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.offcanvas.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.orbit.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.responsiveMenu.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.responsiveToggle.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.reveal.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.slider.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.sticky.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.tabs.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.toggler.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.tooltip.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.util.box.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.util.keyboard.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.util.motion.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.util.nest.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.util.timerAndImageLoader.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.util.touch.js',
    // './node_modules/foundation-sites/dist/plugins/foundation.util.triggers.js',
    './node_modules/svg4everybody/dist/svg4everybody.js'
  ]
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
    .pipe(util.env.production ? util.noop() : sourcemaps.init())
    .pipe(sass())
    .on('error', errorHandler)
    .pipe(prefixer())
    .pipe(util.env.production ? cssmin() : util.noop())
    .pipe(util.env.production ? util.noop() : sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  return browserify({entries: [path.source.js]})
  .transform(babelify, {presets: ["es2015"]})
  .bundle()
  .on('error', errorHandler)
  .pipe(source('app.js'))
  .pipe(util.env.production ? buffer() : util.noop())
  .pipe(util.env.production ? uglify() : util.noop())
  .pipe(gulp.dest(path.build.js))
  .pipe(reload({stream: true}));
});

gulp.task('js:libraries:build', function() {
  return gulp.src(path.libraries)
  .pipe(concat('libraries.js'))
  .pipe(util.env.production ? buffer() : util.noop())
  .pipe(util.env.production ? uglify() : util.noop())
  .on('error', errorHandler)
  .pipe(gulp.dest(path.build.js));
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
  'js:libraries:build',
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
  watch(path.libraries, function(event, cb) {
    gulp.start('js:libraries:build');
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
if (util.env.production) {
  gulp.task('default', ['build']);
} else {
  gulp.task('default', ['build', 'webserver', 'watch']);
}
