var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
var clean = require('gulp-clean');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var typescript = require('gulp-typescript');
var template = require('gulp-template-compile'); // to compile and generate template
var clean1 = require('gulp-rimraf');
var cssmin = require('gulp-cssmin');
var jsonTransform = require('gulp-json-transform');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

//var tscConfig = require(tsconfig.json);

var tsProject = typescript.createProject('tsconfig.json');
var del = require('del');

var bases = {
    app: 'app/',
    dist: 'dist/',
}
var paths = {
    pages: ['views/**/*.html', '!index.html', '!404.html'],
    mainpage: ['**/*.html', '!views/**/*.html'],
    scripts: ['scripts/**/*.ts', '!service/**/*.ts','typings/tsd.d.ts'],
    service: ['service/**/*.ts'],
    images: ['images/**/*.png'],
    styles: ['css/**/*.scss'],
    utility: ['utlity/**/*.json'],
    bower: ['bower_components/**/*.js', 'bower_components/dist/**/*.js']
};
gulp.task('clean', [], function () {
    console.log("Clean all files in build folder");
    return gulp.src(bases.dist, {
        read: false
    }).pipe(clean());
});
//Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean'], function () {
    gulp.src(paths.scripts, {
            cwd: bases.app
        })
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(tsProject())
        //.pipe(browserify())
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(bases.dist));
});

gulp.task('service', ['clean'], function () {
    gulp.src(paths.service, {
            cwd: bases.app
        })
        //.pipe(browserify())
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(typescript({
            "target": "es5"
        }))
        .pipe(gulp.dest(bases.dist + 'service/'));
});

gulp.task('pages', ['clean'], function () {
    gulp.src(paths.pages, {
            cwd: bases.app
        })
        //.pipe(browserify())
        .pipe(template()) // converts html to JS
        .pipe(concat('templates.js'))
        .pipe(gulp.dest(bases.dist))
});

gulp.task('mainpages', ['clean'], function () {
    gulp.src(paths.mainpage, {
            cwd: bases.app
        })
       // .pipe(browserify())
        .pipe(gulp.dest(bases.dist))
});


// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean'], function () {
    gulp.src(paths.images, {
            cwd: bases.app
        })
        .pipe(imagemin())
       // .pipe(browserify())
        .pipe(gulp.dest(bases.dist + 'images/'));
});

//Copy styles
gulp.task('cssmin', ['clean'], function () {
    gulp.src(paths.styles, {
            cwd: bases.app
        })
        .pipe(sass())
        .pipe(cssmin())
       // .pipe(browserify())
        .pipe(gulp.dest(bases.dist + 'styles/'));
});

gulp.task('utility', ['clean'], function () {
    gulp.src(paths.utility, {
            cwd: bases.app
        })
        .pipe(jsonTransform(function (data, file) {
            return data;
        }))
        //.pipe(browserify())
        .pipe(gulp.dest(bases.dist + 'utility/'));
});

gulp.task('bower', ['clean'], function () {
    gulp.src(paths.bower, {
            cwd: bases.app
        })
        .pipe(gulp.dest(bases.dist + 'bower_components/'));
});
gulp.task('LocalDeploy', ['clean',
    'scripts', 'service', 'pages', 'mainpages', 'imagemin', 'cssmin', 'utility', 'bower'
]);

gulp.task("watch",['server'], function () {
  gulp.watch(paths.scripts, ["scripts", browserSync.reload()]).on("change", reportChange);
  gulp.watch(paths.mainpage, ["mainpage", browserSync.reload()]).on("change", reportChange);
  gulp.watch(paths.pages, ["pages", browserSync.reload()]).on("change", reportChange);
  gulp.watch(paths.service, ["service", browserSync.reload()]).on("change", reportChange);
  gulp.watch(paths.styles, ["cssmin", browserSync.reload()]).on("change", reportChange);
  gulp.watch(paths.images, ["imagemin", browserSync.reload()]).on("change", reportChange);
  gulp.watch(paths.bower, ["bower", browserSync.reload()]).on("change", reportChange);
});

gulp.task("server", ['LocalDeploy'], function (done) {
    browserSync.init(({
        open: false,
        port: 9000,
        server: {
            baseDir:[paths.dist]
        }
    }, done));
});


function reportChange(event) {
    console.log("File " + event.path + " was " + event.type + ", running tasks...");
}