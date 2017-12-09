// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'

Vue.config.productionTip = false

if(process.env.NODE_ENV === 'development') {
    const VConsole = require('vconsole');
    let vConsole = new VConsole();
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
