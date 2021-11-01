//La api de gulp retorna múltiples funciones
//por eso las llaves
const { src, dest, watch, parallel } = require('gulp');

//DEPENDENCIAS DE CSS

//Importa la funcionadlidad de SASS(sintaxis de node.js, se trae la carpeta de node_modules)
const sass = require('gulp-sass')(require('sass'));
//ese segundo parentesis con el require de sass anidado es porque
//gulp-sass no cuenta con el conocimiento de las hojas de estilos de sass
// es solo el conector que sirve para compilarlas, por ello se llama ese paquete node y se asigna
//a la constante sass para que ahora sí cuente con el conocimiento de SASS
const plumber = require('gulp-plumber');
//Adapta lo ultimo de css a todos los navegadores para que sea mas compatible
const autoprefixer = require('autoprefixer');
//Comprime el css
const cssnano = require('cssnano');
// Hace algunas transformaciones en el css por medio de las doslibrerias anteriores
const postcss = require('gulp-postcss');

const sourcemaps = require('gulp-sourcemaps');

//DEPENDENCIAS DE IMAGENES
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//Dependencias de JS
const terser = require('gulp-terser-js');

function css( done ) {
    src('src/scss/**/*.scss')  // Identificar el archivo .SCSS a compilar
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe( sass() ) // Compilarlo
        .pipe( postcss([ autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') ) //Almacenarla en el disco duro
    done();
}
function imagenes(done) {

    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe( cache( imagemin(opciones) ) )
        .pipe( dest('build/img') );
    done();

}
function versionWebp( done ) {

    const opciones = {
        quality: 50,
    };

    // Busca de manera recursiva
    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones) )
        .pipe( dest('build/img'));

    done();
}
function versionAvif( done ) {

    const opciones = {
        quality: 50,
    };

    // Busca de manera recursiva
    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones) )
        .pipe( dest('build/img'));

    done();
}
function javascript( done ) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/js'));
    done();    
}
function dev( done ) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    done();
}


exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = parallel( imagenes, versionWebp, versionAvif, javascript, dev) ;