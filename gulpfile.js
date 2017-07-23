var gulp = require('gulp');
var uncss = require('gulp-uncss');
var unusedImages = require('gulp-unused-images');
var plumber = require('gulp-plumber');
var imagemin = require('gulp-imagemin');
var elixir = require("laravel-elixir");


//over-ride laravel-elixir configuration
elixir.config.assetsPath = 'src';
elixir.config.publicPath = '';
elixir.config.viewPath = './';
elixir.config.sourcemaps = false;


//source path configuration
var vendors = 'src/vendors/';
var resourcesAssets = 'src/';
var srcCss = resourcesAssets + 'css/';
var srcJs = resourcesAssets + 'js/';

//destination path configuration
var dest = '';
var destFonts = dest + 'fonts/';
var destCss = dest + 'css/';
var destJs = dest + 'js/';
var destVendors = dest + 'vendors/';

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Less
 | file for our application, as well as publishing vendor resources.
 |
 */

var paths = {
    'jquery': vendors + 'jquery/dist/',
    'bootstrap': vendors + 'bootstrap/dist/',
    'fontawesome': vendors + 'font-awesome/'
};

elixir(function(mix) {

    // Copy fonts straight to public
    mix.copy(paths.bootstrap + 'fonts', destFonts);

    //bootstrap
    mix.copy(paths.bootstrap + 'js/bootstrap.min.js', destJs);

    //fontawesome
    mix.copy(srcCss + 'font-awesome.min.css', destCss);
    mix.copy(paths.fontawesome + 'fonts', destFonts);

    //jquery
    mix.copy(paths.jquery + 'jquery.min.js', destJs);

    /*
    browserSync for auto-reloading browser on changes
     */
    mix.browserSync({
        files: ['**/*.html', '**/*.css', '**/*.js'],
        proxy: undefined,
        server: {
            baseDir: "./"
        }
    });

    mix.sass('bootstrap.scss','css/bootstrap.css');
    mix.sass('custom.scss','css/custom.css');
});


/*
| Finds un-used css and outputs css files into out folder
| NOTE: sometimes even for used classes, it shows false positibe, be careful
 */
//directory
gulp.task('uncss', function () {
    //medical
    return gulp.src([
        // include custom css files here
    ])
        .pipe(uncss({
            html: ['**/*.html']
        }))
        .pipe(gulp.dest('./out'));

});

/*
| Find for un-used images and show log
*/
gulp.task('images:filter', function () {
    return gulp.src(['images/**/*'])
        .pipe(plumber())
        .pipe(unusedImages({log:true, delete:false}))
        .pipe(plumber.stop());
});


/*
 | image minimisation
 */
gulp.task('images:min', function(){
    return gulp.src('images/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin())
        .pipe(gulp.dest('images/'))
});