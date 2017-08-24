const gulp = require('gulp');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');

// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task("default", ['build']);


gulp.task('build', function() {
  return tsProject.src()
  .pipe(tsProject())
  .js.pipe(gulp.dest("dist"));
});
