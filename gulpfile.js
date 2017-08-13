'use strict';

let gulp = require('gulp');
let taskHandler = require('./build/gulp-task');

// 注册任务task
for (let key in taskHandler) {
    gulp.task(taskHandler[key]);
}

// 替换路径
gulp.task('replacePath', gulp.series('replaceLibPath', 'replaceHTMLPath', 'replaceCSSPath'));

// 编译css js 拷贝img
gulp.task('compile', gulp.series('imgMin', 'jsCompile', 'cssCompile'));

// 监听文件改动
gulp.task('watch', gulp.parallel('buildCssAndJs'));

// 开发状态
gulp.task('default', gulp.series('clean', 'replacePath', 'compile', 'watch', 'nodemon', 'browser-sync'));

// 打包上传
gulp.task('build:production', gulp.series('clean', 'replacePath', 'compile', 'htmlCompile', 'prefixPublicPath', 'generatorViews'));