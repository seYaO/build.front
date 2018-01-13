import Vue from 'vue'
import indicator from './indicator.vue'

const Indicator = Vue.extend(indicator)
let instance;

export default {
    open(options = {}) {
        if (!instance) {
            instance = new Indicator({
                el: document.createElement('div')
            });
        }
        if (instance.visible) return;
        instance.text = typeof options === 'string' ? options : options.text || '';
        instance.spinnerType = options.spinnerType || 'snake';
        document.body.appendChild(instance.$el);

        Vue.nextTick(() => {
            instance.visible = true;
        });
    },

    close() {
        if (instance) {
            instance.visible = false;
        }
    }
}