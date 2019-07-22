"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();

var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var del = require("del");


gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("clean", function (done) {
  return del("build");
  done();
});

gulp.task("style", function (done) {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
    done();
});

gulp.task("images", function (done) {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
    imagemin.optipng({
        optimizationLevel: 3
      }),
    imagemin.jpegtran({
        progressive: true
      }),
    imagemin.svgo()
  ]))
    .pipe(gulp.dest("source/img"));
    done();
});

gulp.task("copy", function (done) {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.html"
  ], {
      base: "source"
    })
    .pipe(gulp.dest("build"));
    done();
});


gulp.task('build', gulp.series('clean', 'style', 'images', 'copy', function (done) {
  done();
}));

gulp.task("start", gulp.series("css", "server"));
