
const del            = require('del');
const fs             = require('fs');
const path           = require('path');
const webpack        = require('webpack');
const browserSync    = require('browser-sync');
const runSequence    = require('run-sequence');
const gulp           = require('gulp');
const gulpif         = require('gulp-if');
const prefix         = require('gulp-autoprefixer');
const sass           = require('gulp-sass');
const less           = require('gulp-less');
const csso           = require('gulp-csso');
const sourcemaps     = require('gulp-sourcemaps');
const env            = require('yargs').argv;
const config         = require('./gulp.config')();
const chalk          = require('chalk');
const moment         = require('moment');
const nodemon        = require('gulp-nodemon');

// Update config from environment variables
config.port.browsersync = (env.hasOwnProperty('APP_PORT')) ? env.APP_PORT : config.port.browsersync;
config.env = (env.hasOwnProperty('environment')) ? env.environment : config.env;

const timestamp = () => {
    let now = moment().format('HH:mm:ss');
    return `[${chalk.blue(now)}]`;
};

// Set webpack config after environment variables
const webpackConfig    = require('./webpack.config')(config);
const webpackConfigServer    = require('./webpack.config')(config, 'server');

// Compile js
gulp.task('scripts', (done) => {
    webpack(webpackConfig, (err, stats) => {
        if (err) {
            console.log(err());
            done();
            return;
        }

        let result = stats.toJson();

        if (result.errors.length > 0) {
            result.errors.forEach((error) => {
                console.log(error);
            });

            done();
            return;
        }
        done();
    });
});
gulp.task('scripts:server', (done) => {
    webpack(webpackConfigServer, (err, stats) => {
        if (err) {
            console.log(err());
            done();
            return;
        }

        let result = stats.toJson();

        if (result.errors.length > 0) {
            result.errors.forEach((error) => {
                console.log(error);
            });

            done();
            return;
        }
        done();
    });
});

// Sass styles
gulp.task('styles', () => {
    let isDev     = (config.env === 'development');
    let isSass    = (config.cssPreProcessor === 'sass');
    let isLess    = (config.cssPreProcessor === 'less');

    return gulp.src(config.src.style)
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(gulpif(isSass, sass({includePaths: config.src.includes}).on('error', sass.logError)))
    .pipe(gulpif(isLess, less({paths: config.src.includes})))
    .pipe(prefix(config.browsers))
    .pipe(gulpif(!isDev, csso()))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest(config.dest.style))
    .pipe(gulpif(isDev, browserSync.stream()));
});

// Copy assets
gulp.task('assets', () => {
    return gulp.src(config.src.assets)
    .pipe(gulp.dest(config.dest.assets));
});


gulp.task('assets:toolkit', () => {
    return gulp.src(config.src.toolkit.assets)
    .pipe(gulp.dest(config.dest.assets));
});

// Copy markup
gulp.task('markup', () => {
    return gulp.src(config.src.markup)
    .pipe(gulp.dest(config.dest.markup));
});

// Remove all distribution files
gulp.task('clean', (done) => {
    del.sync([config.dest.dist]);
    done();
});

// Manages changes for a single file instead of a directory
const watcher = (e) => {
    let src      = path.relative(path.resolve(__dirname), e.path);
    let fpath    = `${config.dest.dist}/${path.relative(path.resolve(config.src.app), e.path)}`;
    let dest     = path.normalize(path.dirname(fpath));

    if (fs.existsSync(fpath)) {
        del.sync([fpath]);
    }

    if (e.type !== 'deleted') {
        gulp.src(src).pipe(gulp.dest(dest));
    }

    console.log(`${timestamp()} File '${chalk.cyan(e.type)}' ${src}`);
};

gulp.task('watching', (done) => {
    gulp.watch(config.watch.style, ['styles']);
    gulp.watch(config.watch.server, ['scripts:server']);
    gulp.watch([config.watch.markup, config.watch.assets], watcher);
    gulp.watch(config.watch.js, () => { runSequence(['scripts'], ['scripts:server']); });
    done();
});

// nodemon -> start server and reload on change
let started = false;
gulp.task('nodemon', (done) => {
    if (config.env !== 'development') { done(); return; }

    nodemon({
        quite: true,
        watch : config.dest.server,
        env: {
            port: config.port.proxy
        },
        ignore: ["**/*.css", "**/*.DS_Store"],
        script: path.join('.', config.dest.server, 'index.js'),
        ext: 'js ejs json jsx html css scss jpg png gif svg txt md'
    }).on('start', function () {
        if (started === true) {
            setTimeout(browserSync.reload, 725);
        } else {
            setTimeout(done, 3000);
        }
    }).on('quit', () => {
        process.exit();
    });
});

// Server locally
gulp.task('serve', (done) => {
    browserSync({
        notify: false,
        timestamps: true,
        logPrefix: '00:00:00',
        port: config.port.browsersync,
        ui: {port: config.port.browsersync + 1},
        proxy: `localhost:${config.port.proxy}`
    });

    started = true;
    done();
});

// Build
gulp.task('build', (done) => {
    runSequence(
        ['clean'],
        ['assets', 'assets:toolkit', 'markup', 'styles', 'scripts', 'scripts:server'],
        done
    );
});

// The default task
gulp.task('default', (done) => {
    if (config.env === 'development') {
        runSequence(['build'], ['nodemon'], ['watching'], () => {
            gulp.start('serve');
            done();
        });
    } else {
        runSequence(['build'], () => {
            done();
        });
    }
});
