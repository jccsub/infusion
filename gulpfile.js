const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');
const webpack = require('webpack-stream');


// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task("default", ['build-server', 'build-client']);


gulp.task('build-server', function() {
  return tsProject.src()
  .pipe(tsProject())
  .js.pipe(gulp.dest("dist"));
});


gulp.task('build-client', function() {
  return gulp.src('client/index.js')
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(gulp.dest('dist/'));
});
