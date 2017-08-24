/**
 * @author 王莉(wl09720@ly.com)
 * @module task
 * @exports
 * @desc gulp task
 */


let util = require('util');
let glob = require('glob');
let gulp = require('gulp');
let gutil = require('gulp-util'); // 
let del = require('del');
let sass = require('gulp-sass');
let browserify = require('browserify');
let watchify = require('watchify'); // watchify 加速 browserify编译
let autoprefixer = require('gulp-autoprefixer');
let sourcemaps = require('gulp-sourcemaps');
let rev = require('gulp-rev'); // demo.png => demo-d41d8cd98f.png  manifest
let plumber = require('gulp-plumber');
let gulpif = require('gulp-if');
let notify = require('gulp-notify'); // 在控制台中加入文字描述，主要用于错误信息打印
let assign = require('lodash.assign'); // Object.assign
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let browserSync = require('browser-sync');
let nodemon = require('gulp-nodemon'); // 让node 自动重启
let watch = require('gulp-watch'); // 
let minifycss = require('gulp-minify-css'); // 压缩css
let uglify = require('gulp-uglify'); // 压缩js
const cssBase64 = require('gulp-css-base64');

let gulpTempMerge = require('./gulp-template-merge');
let gulpReplacePath = require('./gulp-replace-path');
let config = require('../config');
let version = require('./versions');
let log = gutil.log;
let colors = gutil.colors;
let NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development';


let obj = {
    // 报错抛出提示
    onError(err) {
        log('======= ERROR. ========\n');
        notify.onError("ERROR: " + err.message)(err); // for growl
        gutil.beep();
    },
    replaceLibPath(callback) {
        gulp.src('./src/lib/**/*.*')
            .pipe(gulp.dest('./output/public/lib'))
            .on('finish', callback);
    },
    // 替换HTML路径
    replaceHTMLPath(callback) {
        gulp.src('./src/templates/**/*.@(html|ftl|ejs)')
            .pipe(gulp.dest('./.temp/templates'))
            .on('finish', callback);
        gulp.src('./src/sites/**/*.@(html|ftl|ejs)')
            // 替换相对路径
            .pipe(gulpReplacePath(config.build))
            // 开发环境不加hash所以直接加前缀
            .pipe(gulpif(NODE_ENV === 'development', gulpReplacePath(config.development)))
            .pipe(gulp.dest('./.temp/pages/'))
            .on('finish', callback);
    },
    // 替换scss路径
    replaceCSSPath(callback) {
        gulp.src('./src/sites/**/*.scss')
            .pipe(gulpReplacePath(config.build))
            .pipe(gulp.dest('./.temp/modules/'))
            .on('finish', callback);
    },
    // require编译
    bundle(b, file, fileName, index, callback) {
        b.bundle()
            .on("error", notify.onError(function (error) {
                log('======= ERROR. ========\n', error);
                return "Message to the notifier: " + error.message;
            }))
            .pipe(source(fileName))
            .pipe(buffer())
            .pipe(gulpif(NODE_ENV !== 'development', version({
                path: file,
                type: 'versionsJs'
            })))
            .pipe(gulpif(NODE_ENV !== 'production', sourcemaps.init({
                loadMaps: true
            })))
            .pipe(gulpif(NODE_ENV === 'production', uglify()))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./output/public/js'))
            .pipe(version.manifest({
                merge: true
            }))
            .pipe(gulpReplacePath.gatherManifest())
            .on('finish', () => {
                callback(index);
            })
    },
    // 编译所有的js
    jsCompile(callback) {
        glob('./src/sites/**/!(_)*.js', {}, (err, files) => {
            let num = files.length,
                _i = 0;

            files.forEach((file, index) => {

                let reg = file.match(/(src\/(\w+)*)?\/([\w-\.]+.js)?$/),
                    fileName = reg[3];

                // browserify 编译 js
                let b = browserify(assign({}, watchify.args, {
                    cache: {},
                    packageCache: {},
                    entries: [file],
                    debug: true
                }));

                // 使用es6语法,编译为es5
                // 规则：已 .es.js结尾  如： demo.es.js 
                if (/\.es\.js$/.test(file)) {
                    b.transform("babelify", {
                        "presets": ["es2015"]
                    });
                }
                obj.bundle(b, file, fileName, index, (_index) => {
                    _i++;

                    // NODE_ENV !== 'development' && log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

                    _i === num && function () {
                        if (NODE_ENV !== 'development') {
                            let _obj = gulpReplacePath._manifest;
                            let _arr = Object.keys(_obj);
                            _arr = _arr.filter(key => /.js$/.test(key));
                            console.log('========jsCompile==================', _arr.length);
                        }
                        callback();
                    }();

                });

            });
        });
    },
    // 编译css
    buildCss(styleSrc, index, callback) {
        gulp.src(styleSrc, {
                client: './'
            })
            .pipe(plumber({
                errorHandler: obj.onError
            }))
            .pipe(gulpif(NODE_ENV !== 'production', sourcemaps.init()))
            .pipe(sass())
            .pipe(autoprefixer())
            .pipe(cssBase64({
                baseDir: 'output/public/img',
                maxWeightResource: 2000,
                extensionsAllowed: ['.gif', '.jpg', '.png']
            }))
            .pipe(gulpReplacePath(config.build))
            .pipe(gulpif(NODE_ENV === 'development', gulpReplacePath(config.development)))
            .pipe(gulpif(NODE_ENV !== 'development', version({
                path: styleSrc,
                type: 'versionsCss'
            })))
            .pipe(gulpif(NODE_ENV === 'production', minifycss()))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./output/public/css'))
            .pipe(version.manifest({
                merge: true
            }))
            .pipe(gulpReplacePath.gatherManifest())
            .on('finish', () => {
                callback(index);
            })
    },
    // 编译所有的scss
    cssCompile(callback) {
        glob('./src/sites/**/!(_)*.scss', {}, (err, files) => {
            let num = files.length,
                _i = 0;

            files.forEach((file, index) => {
                obj.buildCss(file, index, (_index) => {
                    _i++;

                    // NODE_ENV !== 'development' && log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

                    _i === num && function () {
                        if (NODE_ENV !== 'development') {
                            let _obj = gulpReplacePath._manifest;
                            let _arr = Object.keys(_obj);
                            _arr = _arr.filter(key => /.css$/.test(key));
                            console.log('========cssCompile==================', _arr.length);
                        }
                        callback();
                    }();
                });

            });
        });
    },
    // img拷贝
    imgMin(callback) {
        return gulp.src('./src/sites/**/*.@(png|jpg|jpeg|gif|bmp)')
            .pipe(gulpif(NODE_ENV !== 'development', version({
                type: 'image'
            })))
            .pipe(gulp.dest('./output/public/img/modules/'))
            .pipe(version.manifest())
            .pipe(gulpReplacePath.gatherManifest())
            .on('finish', () => {
                if (NODE_ENV !== 'development') {
                    let _obj = gulpReplacePath._manifest;
                    let _arr = Object.keys(_obj);
                    console.log('========imgMin==================', _arr.length);
                }
                callback();
            })
    },
    // 根据变动生成css与js
    buildCssAndJs(callback) {
        watch('./src/**/*.scss', file => {
            return gulp.src('./src/**/*.scss')
                .pipe(gulpReplacePath(config.build))
                .pipe(gulp.dest('./.temp'))
                .on('finish', function () {
                    obj.cssCompile(function () {
                        browserSync.reload();
                    })
                })
        });
        watch('./src/**/*.js', file => {
            obj.jsCompile(function () {
                browserSync.reload();
            })
        });
        watch('./src/sites/**/*.@(png|jpg|jpeg|gif|bmp)', () => {
            return gulp.src('./src/sites/**/*.@(png|jpg|jpeg|gif|bmp)')
                .pipe(gulp.dest('./output/public/img/modules/'))
        })
        watch('./src/sites/**/*.@(html|ftl|ejs)', file => {
            gulp.src('./src/sites/**/*.@(html|ftl|ejs)')
                .pipe(gulpReplacePath(config.build))
                .pipe(gulpif(NODE_ENV === 'development', gulpReplacePath(config.development)))
                .pipe(gulp.dest('./.temp/pages/'))
                .on('finish', function () {
                    if (file.event === 'add') {
                        // obj.nodemonStream.emit('restart');
                    } else {
                        browserSync.reload();
                    }
                })
        });
        watch('./src/templates/**/*.@(html|ftl|ejs)', file => {
            gulp.src('./src/templates/**/*.@(html|ftl|ejs)')
                .pipe(gulp.dest('./.temp/templates'));
        });
        watch('./src/lib/**/*.*', file => {
            gulp.src('./src/lib/**/*.*')
                .pipe(gulp.dest('./output/public/lib'))
        })

        callback();
    },
    // 编译所有页面
    htmlCompile(callback) {
        gulp.src('./.temp/@(pages|templates)/**/*.ftl')
            .pipe(gulpTempMerge())
            .pipe(gulp.dest('./output'))
            .on('finish', callback)
    },
    //加前缀与替换manifest
    prefixPublicPath(callback) {
        // console.log(gulpReplacePath._manifest)
        gulp.src('./output/**/*.@(ftl|css)')
            .pipe(gulpReplacePath({
                manifest: gulpReplacePath._manifest
            }))
            .pipe(gulpReplacePath(config[NODE_ENV]))
            .pipe(gulp.dest('./output'))
            .on('finish', callback)
    },
    // 最后打包上传静态文件和freemarker文件
    generatorViews(callback) {
        gulp.src(['./output/public/css/**', './output/public/js/**', './output/public/img/**'])
            .pipe(gulp.dest('./output/static/agbpc'))
            .on('finish', callback)
        gulp.src('./output/public/lib/**')
            .pipe(gulp.dest('./output/static/lib'))
            .on('finish', callback)
        gulp.src('./output/templates/**')
            .pipe(gulp.dest('./output/views/templates'))
            .on('finish', callback)
        glob('./output/pages/**/*.ftl', {}, (err, files) => {
            files.forEach(file => {
                gulp.src(file)
                    .pipe(gulp.dest('./output/views'));

                log(gutil.colors.green("SUCCESS: " + file + '  finished!'));
            });
            callback();
        })
    }
}


module.exports = {

    // 构建目录清理
    clean(callback) {
        del.sync(['output/**', '!output', '.temp/**', 'dest/**']);
        callback();
    },

    // 替换路径
    replaceLibPath: obj.replaceLibPath,
    replaceHTMLPath: obj.replaceHTMLPath,
    replaceCSSPath: obj.replaceCSSPath,

    // 编译css js 拷贝img
    imgMin: obj.imgMin,
    jsCompile: obj.jsCompile,
    cssCompile: obj.cssCompile,

    htmlCompile: obj.htmlCompile,
    prefixPublicPath: obj.prefixPublicPath,

    // 根据变动生成css与js
    buildCssAndJs: obj.buildCssAndJs,
    generatorViews: obj.generatorViews,

    // 自动刷新浏览器
    'browser-sync': (callback) => {
        browserSync.init(null, {
            proxy: `http://localhost:${config.build.port}`,
            // 设置监听的文件，以gulpfile.js所在的根目录为起点，如果不在根目录要加上路径，单个文件就用字符串，多个文件就用数组
            files: ['./', 'public/**/*.*'],
            // browser: 'google chrome',
            port: config.build['browser-sync-prot'],
            open: "external",
            // 更改控制台日志前缀
            logPrefix: 'learning browser-sync in gulp'
        });
        callback();
    },

    // 让node自动重启， 实时监控node
    nodemon: (callback) => {

        let started = false;

        nodemon({
            script: 'app.js',
            // 忽略部分对程序运行无影响的文件的改动， nodemon只监视js文件，可用ext项来扩展别的文件类型
            ignore: ['gulpfile.js', 'node_modules/', '.git/', '.vscode/'],
            ext: 'js json',
            env: {
                'NODE_ENV': 'development'
            },
            watch: ['config/api-router.js', 'config/proxy.js', 'src/sites/*/config.json']
        }).on('start', () => {

            // to avoid nodemon being started multiple times
            if (!started) {

                started = true;
                callback();

            }
        })
    }
}