window.jQuery = window.$ = require('../../common/jquery/3.1.1/jquery.min.js');
require('./js/_Detector.js')
window.THREE = require('../../common/THREE/83/three.min.js');
window.VRUtil = require('./js/_util.js');
require('./js/_webvr-polyfill.js');
require('./js/_OrbitControls.js');
require('./js/_VRControls.js');
require('./js/_VREffect.js');
require('../../common/bridge/bridge.2.2.2.js');//引入app里的脚本
require('./js/_panoTemplate.js');
require('./js/_Confirm.js');