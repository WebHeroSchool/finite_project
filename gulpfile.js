const env = require( 'gulp-env' ),
      glob = require( 'glob' ),
      gulp = require( 'gulp' ),
      clean = require( 'gulp-clean' ),
      babel = require( 'gulp-babel' ),
      short = require( 'postcss-short' ),
      concat = require( 'gulp-concat' ),
      uglify = require( 'gulp-uglify' ),
      gulpif = require( 'gulp-if' ),
      nested = require( 'postcss-nested' ),
      assets = require( 'postcss-assets' ),
      rename = require( 'gulp-rename' ),
      postcss = require( 'gulp-postcss' ),
      cssnano = require( 'gulp-cssnano' ),
      handlebars = require( 'gulp-compile-handlebars' ),
      sourcemaps = require( 'gulp-sourcemaps' ),
      browserSync = require( 'browser-sync' ).create(),
      autoprefixer = require( 'autoprefixer' ), 
      postcssPresetEnv = require( 'postcss-preset-env' ),
      templateContext = require( './src/db.json' ),
      rulesScripts = require( './eslint-rules.json' ),
      eslint = require( 'gulp-eslint' ),
      stylelint = require( 'stylelint' ),
      reporter = require( 'postcss-reporter' ),
      rulesStyles = require( './stylelint-rules.json' ),
      filter = require('gulp-filter'),
      imagemin = require( 'gulp-imagemin' );

const paths = {
    src: {
      dir: './src/',
      styles: './src/styles/*.css',
      scripts: './src/scripts/*.js',
      fonts: './src/fonts/**/*',
      images: './src/images/**/*'
    },
    build: {
      dir: 'build/',
      styles: 'build/styles',
      scripts: 'build/scripts',
      fonts: 'build/fonts',
      images: 'build/images'
    },
    buildNames: {
      styles: 'index.min.css',
      scripts: 'index.min.js'
    },
    handlebars: [ './src/**/*.hbs' ],
    contextJson: './src/db.json',
    templates: 'src/templates/**/*.hbs',
    lint: {
      scripts: [ '**/*.js', '!node_modules/**/*', '!build/**/*' ],
      styles: [ '**/*.css', '!node_modules/**/*', '!build/**/*' ]
    }
};

env({
  file: '.env',
  type: 'ini',
});

gulp.task( 'compile', () => {
	glob(paths.templates, ( err, files ) => {
		if ( !err ) {
			const options = {
				ignorePartials: true,
        batch: files.map(item => item.slice(0, item.lastIndexOf('/'))),
        helpers: {
          capitals: str => str.toUpperCase(),
          sum: ( a, b ) => a + b,
          point: ( str ) => str.split('').join('.'),
        }
      };
      
    gulp.src( `${ paths.src.dir }/index.hbs` )
        .pipe(handlebars( templateContext, options) )
        .pipe(rename( 'index.html') )
        .pipe( gulp.dest(paths.build.dir) );
    }
	});
});

gulp.task( 'time', () => {
  let date = new Date();

  console.log( "Текущее время: " + date.getHours() + ":" + date.getMinutes() );
} );

gulp.task( 'build-js', () => {
  return gulp.src( [paths.src.scripts] )
    .pipe( sourcemaps.init() )
      .pipe( concat( paths.buildNames.scripts ) )
      .pipe( babel({
        presets: ['@babel/env']
      }))
      .pipe( gulpif(process.env.NODE_ENV === 'production', uglify()) )
    .pipe( sourcemaps.write( '../maps' ) )
    .pipe( gulp.dest( paths.build.scripts ) );
} );

gulp.task( 'build-css', () => {
  const plugins = [
    nested,
    short,
    assets({
      loadPaths: ['src/images'],
      relativeTo: 'src/styles',
    }),
    postcssPresetEnv(/* pluginOptions */),
    autoprefixer({
      browsers: ['last 2 version']
    }),
  ];

  return gulp.src( [paths.src.styles] )
    .pipe( sourcemaps.init() )
    .pipe( postcss(plugins) )
      .pipe( concat( paths.buildNames.styles ) )
      .pipe( gulpif(process.env.NODE_ENV === 'production', cssnano() ) )
    .pipe( sourcemaps.write( '../maps') )
    .pipe( gulp.dest( paths.build.styles ) );
});

gulp.task( 'eslint', () => {
  gulp.src( paths.lint.scripts )
    .pipe( eslint(rulesScripts) )
    .pipe( eslint.format() );
});

gulp.task( 'stylelint', () => {
  gulp.src( paths.lint.styles )
    .pipe( postcss([
      stylelint( rulesStyles ),
      reporter({
        clegarMessages: true,
        throwErrore: false
      })
    ]));
});

gulp.task( 'lint', [ 'stylelint', 'eslint'] );

gulp.task( 'browserSync', () => {
  browserSync.init({
    server: {
        baseDir: "./"
    }
  });

  gulp.watch( paths.src.scripts, ['js-watch'] );
  gulp.watch( paths.src.styles, ['css-watch'] );
  gulp.watch( paths.handlebars, ['compile-watch'] );
} );

gulp.task( 'watch', () => {
  gulp.task( 'js-watch', [ 'build-js' ], () => browserSync.reload() );
  gulp.task( 'css-watch', [ 'build-css' ], () => browserSync.reload() );
  gulp.task( 'compile-watch', ['compile'], () => browserSync.reload() );
  gulp.watch( paths.contextJson )
    .on( 'change', browserSync.reload );
  gulp.watch( `${paths.build.dir}/**/*` )
    .on( 'change', browserSync.reload );
} );

gulp.task( 'build-fonts', () => {
  gulp.src( paths.src.fonts )
    //.pipe( filter( ['*.woff', '*.woff2', '*,eot', '*.ttf'] )) //with filter not working
    .pipe( gulp.dest( paths.build.fonts ));
});

gulp.task( 'build-images', () =>
    gulp.src( paths.src.images )
        .pipe( imagemin() )
        .pipe( gulp.dest( paths.build.images ))
);

gulp.task('clean-build', () => {
  return gulp.src('./build', { read: false })
    .pipe(clean());
});

gulp.task( 'build', [ 'build-js', 'build-css', 'build-fonts', 'build-images', 'compile']  );

gulp.task( 'default', ['build'] );
gulp.task( 'dev', ['build', 'browserSync'] );
gulp.task( 'prod', ['build'] );

