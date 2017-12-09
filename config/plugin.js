'use strict';

// had enabled by egg
// exports.static = true;
exports.security = false
// 模版渲染
exports.nunjucks = {
  enable: true,
  package: 'egg-view-nunjucks'
};
exports.validate = {
	enabled: true,
	package: 'egg-validate'
}
