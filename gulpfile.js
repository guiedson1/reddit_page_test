// Initialize modules
var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');

// Sass task: compiles the style.scss file into style.css
gulp.task('sass', function(){
    return gulp.src('src/sass/style.scss')
        .pipe(sass()) // compile SCSS to CSS
        .pipe(cssnano()) // minify CSS
        .pipe(gulp.dest('public/css'));// put final CSS in dist folder
});


// Watch task: watch SCSS and HTML files for changes
gulp.task('watch', function(){
    gulp.watch('src/sass/*.scss', gulp.series('sass'));
});

// Default task
gulp.task('default', gulp.series('sass','watch'));
