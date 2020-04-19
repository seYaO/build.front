'use strict';

var gulp = require('gulp');
//var less = require('gulp-less');
var sass = require('gulp-sass')
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rev = require('gulp-rev');
var replace = require('gulp-replace');
var del = require('del');
var glob = require('glob');
var path = require('path');
var sftp = require('gulp-sftp');
var base64 = require('gulp-base64');
var fs = require('fs');
//var tmodjs = require('tmodjs');
var lr = require('tiny-lr')()
var gulpif = require('gulp-if')
var gulpReplacePath = require('./build/gulp-replace-path')
var config = require('./config')
var NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development'

var tpl = {
    name: 'Sloth',
    jsA: '/17216004011 ftp (172.16.4.11)/js_40017_y/cn/y/output',
    jsB: '/17216004010 ftp (172.16.4.10)/js_40017_y/cn/y/output',
    cssA: '/17216004011 ftp (172.16.4.11)/css_40017_y/cn/y/output',
    cssB: '/17216004010 ftp (172.16.4.10)/css_40017_y/cn/y/output',
    imgA: '/17216004011 ftp (172.16.4.11)/img1_40017_y/cn/y/output',
    imgB: '/17216004010 ftp (172.16.4.10)/img1_40017_y/cn/y/output',
    imgRoot:"http://img1.40017.cn/cn/y/output/",
    illegal: /alert/g,
    html:'usemin.html',
    stageHtml:'usemin-stage.html',
    to: 'syt4528@ly.com'
};

// 报错抛出提示
var onError = function (err) {
    gutil.log('======= ERROR. ========\n');
    notify.onError("ERROR: " + err.message)(err); // for growl
    gutil.beep();
};

// 首次进来先获取缓存数据存起来
// var cacheJSON  = require('./cache.json');
    var bUpload = {};

var _listen = function(obj, prop, fn){

    return Object.defineProperty(obj, prop, {
        get: function(){
            return this['_'+prop];
        },
        set: function(newValue){

            if(this['_'+prop] !== newValue){
                this['_'+prop] = newValue;
                fn(newValue);
            }
        }
    });
};

// 监听上传状态
_listen(bUpload, 'cursor', updateCache);
bUpload['cursor'] = 0;

/*
 * upload
 * 首先会先判断有没有文件上传
 * 如果有：才去连接， 否则不连接
 *
 * */
function upload(cfg, callback){

    if(!cfg.files.length)
        cfg.files = 'thetcbestfrontteam/*.frontteam';

    return gulp.src(cfg.files)
        .pipe(sftp({
            host: cfg.host || '172.16.7.251',
            port: cfg.port || '22',
            auth: cfg.auth || 'hyh08431',
            remotePath: cfg.path,
            callback: function(){
                gutil.log(gutil.colors.green(cfg.log) + gutil.colors.yellow(' SFTP connection is closed.'));
            }
        }))
        .on('error', function(e){
            gutil.log(gutil.colors.red(e.message));

            throw 'User name or password is incorrect! please stop!!';
        })
        .on('finish', function(){
            callback && callback();
        });
}
/**
 * .pipe(plumber({errorHandler: onError}))
        .pipe(gulpif(NODE_ENV === 'development', sourcemaps.init()))
        //.pipe(less())
        .pipe(sass())
        .pipe(gulpif(NODE_ENV === 'development', gulpReplacePath(config.development)))
        .pipe(gulpif(NODE_ENV !== 'development', rev()))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dest/public/css'))
        .pipe(rev.manifest({merge: true}))
        // .pipe(gulp.dest('./dest/public/css'))
        .pipe(gulpReplacePath.gatherManifest())
        .pipe(gulpReplacePath({manifest: gulpReplacePath._manifest}))
        .pipe(gulpif(NODE_ENV !== 'development', gulpReplacePath(config.NODE_ENV)))
        .on('finish', function(){cb && cb()});
 */

function buildCss(styleSrc, cb){
    gulp.src(styleSrc, {client: './'})
        .pipe(plumber({errorHandler: onError}))
        .pipe(gulpif(NODE_ENV !== 'production', sourcemaps.init()))
        //.pipe(less())
        .pipe(sass())
        .pipe(gulpif(NODE_ENV === 'development', gulpReplacePath(config.development)))
        .pipe(gulpif(NODE_ENV !== 'development', rev()))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dest/public/css'))
        .pipe(rev.manifest({merge: true}))
        .pipe(gulpReplacePath.gatherManifest())
        .on('finish', function(){cb && cb()});
}

// require编译
function bundle(b, file, cb) {
    return b.bundle()
        .on("error", notify.onError(function (error) {
            gutil.log('======= ERROR. ========\n', error);
            return "Message to the notifier: " + error.message;
        }))
        .pipe(source(file))
        .pipe(buffer())
        .pipe(gulpif(NODE_ENV !== 'development', rev()))
        .pipe(gulpif(NODE_ENV !== 'production', sourcemaps.init({loadMaps: true})))
        // .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dest/public/js'))
        .pipe(rev.manifest())
        .pipe(gulpReplacePath.gatherManifest())
        .on("finish", function(){cb && cb()})
}


/*function tmodjsTask(callback){

    var tmod = new tmodjs("app/tpl", {
        type: "commonjs",
        minify: false,
        cache: false
    });

    tmod.watch();
    callback();
}*/

function reload(){
  lr.changed({
    body: {
      files: ['']
    }
  })
}
// 根据变动生成css与js
function buildCssAndJs(){
    lr.listen(35730);
    // watch('./src/modules/**/!(_)*.scss',function(event) {

    //     var path = event.path.replace(/\\/g, '/'),
    //         reg = path.match(/(\/src(\/\w+)*)?\/([\w]+.scss)?$/),
    //         src = reg[0];
    //     buildCss(src.substring(1), function(){
    //       lr.changed({
    //         body: {
    //           files: [require('path').relative('./src', event.path)]
    //         }
    //       })
    //     });

    //     gutil.log(gutil.colors.green("SUCCESS: " + src.substring(1) + '  finished!'));

    // });

    // watch(['./src/modules/**/!(_)*.js'],function(event) {

    //     var path = event.path.replace(/\\/g, '/');

    //     var reg = path.match(/\/(((src|tpl\/build)\/(\w+)*)?\/([\w]+.js))?$/),
    //         src = reg[1],
    //         fileName = reg[5];


    //     var b = watchify(browserify(assign({}, watchify.args, {
    //         cache: {},
    //         packageCache: {},
    //         entries: [src]
    //     })));

    //     b.on('log', gutil.log);

    //     bundle(b, fileName, function(){
    //       lr.changed({
    //         body: {
    //           files: [require('path').relative('./src', file.path)]
    //         }
    //       })
    //     });
    // });
  var server = {
    start: function(){
      var fork = require('child_process').fork
      var serverAppFile = path.join(__dirname, 'build/dev-server.js')
      server.instance = fork(serverAppFile, {
        silent: false
      })
    },
    stop: function(){
      server.instance.kill('SIGTERM')
    },
    restart: function(){
        server.stop()
        server.start()
        gutil.log(gutil.colors.gray("NOTICE: " + 'restart server'));
    }
  }
  watch('./src/**/*.scss', function(file){
    gulp.src('./src/**/*.scss')
      .pipe(gulpReplacePath(config.build))
      .pipe(gulp.dest('./.temp'))
      .on('finish', function(){
        Sass(function(){
          reload()
        })
      })
  });
  watch('./src/**/*.js', function(file){
    reset(function(){
      reload()
    })
  });
  watch('./src/**/*.@(png|jpg|jpeg|gif|bmp)', function(){
    gulp.src('./src/**/*.@(png|jpg|jpeg|gif|bmp)')
    //   .pipe(gulpif(NODE_ENV !== 'development', rev()))
      .pipe(gulp.dest('./dest/public/img'))
    //   .pipe(rev.manifest())
    //   .pipe(gulpReplacePath.gatherManifest())
    //   .on('finish', cb);
    })
  watch('./src/**/*.html',function(file) {
    gulp.src('./src/**/*.html')
      .pipe(gulpReplacePath(config.build))
      .pipe(gulpif(NODE_ENV === 'development', gulpReplacePath(config.development)))
      .pipe(gulp.dest('./.temp'))
      .on('finish', function(){
          if(file.event === 'add'){
            server.restart()
          }else{
            reload()
          }

      })
  });
  watch('./lib/**/*.js',function(file) {
    server.restart()
    reload()
  });
  server.start()
}

/*
 编译所有的scss
 */
function Sass(callback){

    glob('./.temp/modules/**/!(_)*.scss', {}, function (err, files) {

        files.forEach(function (file) {

            buildCss(file);

            gutil.log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

        });

        callback();
    });
}


/*
 编译所有的js
 注：执行此命令的时候请注释掉下面的 [default]任务行
 */
function reset(callback){
    var count = 0
    glob('./src/modules/**/!(_)*.js', {}, function (err, files) {

        files.forEach(function (file) {
            var reg = file.match(/(src\/(\w+)*)?\/([\w-\.]+.js)?$/),
            fileName = reg[3];

            // var b = watchify(browserify(assign({}, watchify.args, {
            //     cache: {},
            //     packageCache: {},
            //     entries: [file]
            // })));
            var b = browserify(assign({}, watchify.args, {
                cache: {},
                packageCache: {},
                entries: [file]
            }))

            bundle(b, fileName, function(){
                count++
                if(count === files.length){
                    callback();
                }
            });

            gutil.log(gutil.colors.green("SUCCESS: " + file + '  finished!'));

        });

    });

    // callback();
}


/**
 *  gulp build
 */

/*
 * clean output
 * */
function clean(callback){
    del.sync(['output/**', '!output', '.temp/**', 'dest/**']);
    callback();
}
/*
 * clean uplod.json
 * */
function cleanUpload(callback) {
    writeJson('./upload.json', []);
    callback();
}

/*
 *
 * img CDN
 * */
function cdnImg(callback){

    glob('app/img/*', {}, function (err, files) {

        // addCDN
        return gulp.src(files)
            .pipe(rev())
            .pipe(gulp.dest('./app/output/img'))
            .pipe(rev.manifest('img.json', {
                base: './output',
                merge: true // merge with the existing manifest (if one exists)
            }))
            .pipe(gulp.dest('./app/output/img'))
            .on('finish', callback);
    });
}

/*
 *
 * js CDN
 *
 * */
function cdnJs(callback){

    glob('./dest/public/js/*.js', {}, function (err, files) {

        // addCDN
        return gulp.src(files)
            .pipe(rev())
            .pipe(gulp.dest('./app/output/js'))
            .pipe(rev.manifest('js.json', {
                base: './output',
                merge: true // merge with the existing manifest (if one exists)
            }))
            .pipe(gulp.dest('./app/output/js'))
            .on('finish', callback);
    });
}

/*
 *
 * minCss
 *
 * */

function minCss(callback){
    return gulp.src('./dest/public/css/*.css')
        .pipe(minifycss())
        .pipe(gulp.dest('./dest/public/css'))
        .on('finish', callback);
}

/*
 *
 * compress
 *
 * */
function compress(callback){
    return gulp.src('./dest/public/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./dest/public/js'))
        .on('finish', callback);
}

/*
 *
 * find illegal in content
 * */

function findIllegalChar(callback){

    return gulp.src("app/min/js/*.js")
        .pipe(notify(function (file) {

            var fileName = file.relative;
            // 将buffer 转为字符串
            var content = String(file.contents);
            var aIllegal = content.match(tpl.illegal);

            if(aIllegal){
                return gutil.colors.yellow('Found ' + aIllegal + ' in ' + fileName);
            }
        }))
        .on('finish', callback);
}

/*
 *
 * replaceUrl
 *
 * */
function replaceUrl(callback){

    var imgJson = readJson('app/output/img.json'),
        aUploading = [];

    return gulp.src(['app/min/css/*.css'])
        .pipe(replace(/url\(["']?\.\.\/\.\.\/img\/(.*?)["']?\)/gi, function(match, p1) {

            if(!imgJson[p1]){
                gutil.log(gutil.colors.red('ERROR: '+p1 + ' is missing'));
            }

            // 生成img的到上传列表
            if(!cacheJSON[p1] || cacheJSON[p1] !== imgJson[p1]){
                aUploading.indexOf(p1) === -1 && aUploading.push(p1);
            }

            return 'url(' + tpl.imgRoot + imgJson[p1] + ')';
        }))
        .pipe(rev())
        .pipe(gulp.dest('./app/output/css'))
        .pipe(rev.manifest('css.json', {
            base: './output',
            merge: true // merge with the existing manifest (if one exists)
        }))
        .pipe(gulp.dest('app/output/css'))
        .on('finish', function(){

            // fs.writeFile('upload.json', JSON.stringify(aUploading, null, 4), callback);
            callback();
        });
}

/*
 *
 * base64
 *
 * */
function imgIncodeBybase64(callback){

    glob('./app/min/css/*.css', {}, function (err, files) {

        if(err){
            return gutil.log(gutil.colors.red('ERROR: in imgIncodeBybase64!'));
        }

        return gulp.src(files)
            .pipe(base64({
                extensions: [/^["']?\.\.\/\.\.\/img\/(.*?).(png|jpg|gif)["']?$/i],
                maxImageSize: 8*1024, // bytes
                debug: false
            }))
            .pipe(gulp.dest('app/min/css'))
            .on('finish', callback);
    });
}

/*
 *
 * update wechat
 *
 * */
function update(callback){

    var sFile = {
        js: {},
        css:{}
    };
    var json = readJson('app/output/js.json');

    for(var k in json){
        sFile.js[k.replace('.js', '')] = json[k];
    }

    var cssJson = readJson('app/output/css.json');

    for(var j in cssJson){
        sFile.css[j.replace('.css', '')] = cssJson[j];
    }

    // 删除
    del.sync(['app/min/**']);

    writeJson('app/output/usemin.json', sFile);

    callback();
}

/*
 * 生成上传列表
 *
 * */
function uploadList(callback){

    fs.readFile('upload.json', 'utf8', function(err, data){

        if(err){
            return gutil.log(gutil.colors.red('ERROR: updateCache error!'));
        }

        var aUploading = JSON.parse(data);

        fs.readFile('app/output/js.json', 'utf8', function(err, data){

            if(err){
                return gutil.log(gutil.colors.red('ERROR: updateCache error!'));
            }

            var jsJson = JSON.parse(data);

            for(var k in jsJson){

                if(!cacheJSON[k] || cacheJSON[k] !== jsJson[k]){
                    aUploading.push(k);
                }
            }

            fs.readFile('app/output/css.json', 'utf8', function(err, data){

                if(err){
                    return gutil.log(gutil.colors.red('ERROR: updateCache error!'));
                }

                var cssJson = JSON.parse(data);

                for(var i in cssJson){

                    if(!cacheJSON[i] || cacheJSON[i] !== cssJson[i]){
                        aUploading.push(i);
                    }
                }

                fs.writeFile('upload.json', JSON.stringify(aUploading, null, 4), callback);
            });
        });
    });
}


/*
 *
 * FTP Part
 *
 * */

/*
 *
 * read json
 *
 * */
function readJson(fileName){
    var json = JSON.parse(fs.readFileSync(fileName));

    return json;
}

/*
 *
 * write json
 *
 * */
function writeJson(fileName, data){

    fs.writeFileSync(fileName, JSON.stringify(data));
}

/*
 *
 * find upload file
 *
 * */
function findUploadFile(destFile, reg, prefix){

    var json = readJson('upload.json');
    var imgJson = readJson(destFile);

    var reg = reg || /(.png|.jpg|.gif)$/;

    json = json.filter(function(f){

        return reg.test(f);
    });

    json = json.map(function(f){
        return prefix + imgJson[f];
    });

    return json;
}

/*
 *
 * FTP Part
 *
 * */
function serverImgA(callback){

    var aFile = findUploadFile('app/output/img.json', false, 'app/output/img/');

    return upload({
        files: aFile,
        path: tpl.imgA,
        log: '[server-IMG-11]'
    }, function(){
        bUpload['cursor']++;
        callback();
    });
}

function serverImgB(callback){

    var aFile = findUploadFile('app/output/img.json', false, 'app/output/img/');

    return upload({
        files: aFile,
        path: tpl.imgB,
        log: '[server-IMG-10]'
    }, function(){
        bUpload['cursor']++;
        callback();
    });
}

/* js */
function serverJsA(callback){

    var aFile = findUploadFile('app/output/js.json', /.js$/, 'app/output/js/');

    return upload({
        files: aFile,
        path: tpl.jsA,
        log: '[server-JS-11]'
    }, function(){
        bUpload['cursor']++;
        callback();
    });
}

function serverJsB(callback){

    var aFile = findUploadFile('app/output/js.json', /.js$/, 'app/output/js/');

    return upload({
        files: aFile,
        path: tpl.jsB,
        log: '[server-JS-10]'
    }, function(){
        bUpload['cursor']++;
        callback();
    });
}

/* css */
function serverCssA(callback){

    var aFile = findUploadFile('app/output/css.json', /.css$/, 'app/output/css/');

    return upload({
        files: aFile,
        path: tpl.cssA,
        log: '[server-CSS-11]'
    }, function(){
        bUpload['cursor']++;
        callback();
    });
}

function serverCssB(callback){

    var aFile = findUploadFile('app/output/css.json', /.css$/, 'app/output/css/');

    return upload({
        files: aFile,
        path: tpl.cssB,
        log: '[server-CSS-10]'
    }, function(){
        bUpload['cursor']++;
        callback();
    });
}

/*
 * 更新缓存
 * */
function updateCache(callback){

    if(bUpload['cursor'] < 6){
        return;
    }

    var cache = {};

    var cssJson = readJson('app/output/css.json');

    for(var k in cssJson){
        cache[k] = cssJson[k];
    }

    var jsJson = readJson('app/output/js.json');

    for(var k in jsJson){
        cache[k] = jsJson[k];
    }

    var imgJson = readJson('app/output/img.json');

    for(var k in imgJson){
        cache[k] = imgJson[k];
    }

    fs.writeFile('cache.json', JSON.stringify(cache, null, 4), function(){

        /*gulp.src("cache.json")
            .pipe(notify({
                message: tpl.name + " website deploy OK!"
            }));*/

        writeJson('./upload.json', []);

    });
}

//default task
//gulp.task(tmodjsTask);
gulp.task(buildCssAndJs);

//编译所有的scss
gulp.task(Sass);
//编译所有的js
gulp.task(reset);

// register task
gulp.task(clean);
gulp.task(cleanUpload);
gulp.task(cdnImg);
gulp.task(cdnJs);
gulp.task(minCss);
gulp.task(compress);
gulp.task(replaceUrl);
gulp.task(imgIncodeBybase64);
gulp.task(update);
gulp.task(uploadList);
//gulp.task(findIllegalChar);

// upload
gulp.task(serverImgA);
gulp.task(serverImgB);
gulp.task(serverJsA);
gulp.task(serverJsB);
gulp.task(serverCssA);
gulp.task(serverCssB);

var gulpAries = require('./build/gulp-ariestp')

gulp.task('compileHtml', function(cb){
  gulp.src('./.temp/pages/**/*.html')
    .pipe(gulpAries({
      path: './.temp/templates'
    }))
    // .pipe(gulpReplacePath(Object.assign({}, config[NODE_ENV], {manifest: gulpReplacePath._manifest})))
    .pipe(gulp.dest('./dest/pages'))
    .on('finish', function(){cb && cb()});
})

gulp.task('img', function(cb){
  gulp.src('./src/**/*.@(png|jpg|jpeg|gif|bmp)')
    .pipe(gulpif(NODE_ENV !== 'development', rev()))
    .pipe(gulp.dest('./dest/public/img'))
    .pipe(rev.manifest())
    .pipe(gulpReplacePath.gatherManifest())
    .on('finish', cb);
})

// 替换 html 路径包括 manifest
gulp.task('replaceHTMLPath', function(cb){
  gulp.src('./src/**/*.html')
    // 替换相对路径与manifest如果存在的话
    .pipe(gulpReplacePath(config.build))
    // 开发环境不加hash所以直接加前缀
    .pipe(gulpif(NODE_ENV === 'development', gulpReplacePath(config.development)))
    .pipe(gulp.dest('./.temp/'))
    .on('finish', cb)
})

// 替换 css 路径包括 manifest
// 默认脚本中不存在路径所以不做替换
gulp.task('replaceCSSPath', function(cb){
  gulp.src('./src/**/*.scss')
    .pipe(gulpReplacePath(config.build))
    .pipe(gulp.dest('./.temp'))
    .on('finish', cb)
})

// 加前缀与替换manifest
gulp.task('prefixPublicPath', function(cb){
  gulp.src('./dest/**/*.html')
    .pipe(gulpReplacePath({manifest: gulpReplacePath._manifest}))
    .pipe(gulpReplacePath(config[NODE_ENV]))
    .pipe(gulp.dest('./dest'))
    .on('finish', cb)
  gulp.src('./dest/**/*.css')
    .pipe(gulpReplacePath(Object.assign({}, {manifest: gulpReplacePath._manifest}, config[NODE_ENV])))
    .pipe(gulp.dest('./dest'))
    .on('finish', cb)
})

var gulpResolveInclude = require('./build/gulp-resolve-include')
gulp.task('resolveInclude', function(cb){
  gulp.src('./dest/**/*.html')
    .pipe(gulpResolveInclude())
    .pipe(gulp.dest('./dest'))
    .on('finish', cb)
})

// 替换路径
gulp.task('replacePath', gulp.series('replaceCSSPath', 'replaceHTMLPath'))
// 编译css js 拷贝img
gulp.task('compile', gulp.series('img', 'reset', 'Sass'))
// 监听文件改动
gulp.task('watch', gulp.series('buildCssAndJs'))
gulp.task('default', gulp.series('clean', 'replacePath', 'compile', 'watch'));
gulp.task('build:testing', gulp.series('clean', 'replacePath', 'compile', 'compileHtml', 'prefixPublicPath'));
gulp.task('build:production', gulp.series('clean', 'replacePath', 'compile', 'compileHtml','minCss', 'compress', 'resolveInclude', 'prefixPublicPath'));

// FTP deploy
// gulp.task('p', gulp.series('serverImgA','serverJsA', 'serverCssA', 'serverImgB', 'serverJsB', 'serverCssB'));
