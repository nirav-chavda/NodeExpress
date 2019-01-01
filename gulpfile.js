const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const fs = require('fs');

gulp.task('concatJS', () => {
    return new Promise( 
        (resolve,reject) => {
            writeLog(`${ new Date().toString() } : Gulp Task Started`);
            gulp.src(['resources/assets/js/*.js','public/js/app.js'])
            .pipe(concat('main.js'))
            .pipe(uglify())
            .pipe(gulp.dest('public'));
            writeLog(`${ new Date().toString() } : Gulp Task Finished`);
            resolve();
        }
    );
});

function writeLog(data) {
    
    fs.appendFile('./logcat.log' , data+"\n" , (err) => {
        if(err) {
            return console.log('Error while writing log \n',err);
        }
    });
}

gulp.task('default',gulp.series('concatJS'));