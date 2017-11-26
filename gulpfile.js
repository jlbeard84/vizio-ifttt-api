const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];

const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', () => {
    const tsResult = tsProject.src()
        .pipe(tsProject());
    
    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], () => {
    gulp.watch('src/**/*.ts', ['build']);
});

gulp.task('assets', function() {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch', 'assets']);