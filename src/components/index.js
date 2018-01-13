import './index.scss'

import Vue from 'vue'
import Layout from './layout'
import Group from './group'
import XHeader from './header'
import XBody from './body'
import XInput from './input'
import XButton from './button'
import XSwitch from './switch'

import Divider from './divider'
import Popup from './popup'
import PopupPicker from './popup-picker'
import Picker from './picker'
import DatetimePicker from './datetime-picker'

import Search from './search'
import Confirm from './confirm'
import Alert from './alert'
import Prompt from './prompt'
import Icon from './icon'
import { Actionsheet, ActionsheetItem } from './actionsheet'

import IndexList from './index-list'
import IndexSection from './index-section'
import Cell from './cell'

import LoadMore from './load-more'
import TabBar from './tab-bar'
import OrderBottom from './order-bottom'

import Indicator from './indicator'
import Spinner from './spinner'
import Toast from './toast/index'

import NativeShare from './native-share/index'

const version = '1.0.0'
const install = function(Vue, config = {}) {
    if(install.installed) return;

    Vue.$indicator = Vue.prototype.$indicator = Indicator
    Vue.$toast = Vue.prototype.$toast = Toast
    Vue.$alert = (props, mounted = document.body) => {
        props = Object.assign({
            open: true,
            onConfirm() {
                return true;
            }
        }, props)
        let node = document.createElement('div')
        mounted.appendChild(node)
        let vue = new Vue({
            el: node,
            template: `<alert :open="props.open :confirm-text="props.confirmText" @on-confirm="confirmHandler" @on-close="closeHandler">{{props.content}}</alert>`,
            components: { Alert },
            data: { props },
            methods: {
                confirmHandler() {
                    props.open = props.onConfirm() === false
                    !props.open && setTimeout(() => {
                        vue.$destroy()
                    }, 1000)
                },
                closeHandler() {
                    props.open = props.onCancel() === false
                    !props.open && setTimeout(() => {
                        vue.$destroy()
                    }, 1000)
                }
            },
            destroyed() {
                requestAnimationFrame(() => {
                    vue.$el.remove()
                })
            }
        })
    }
}

if(typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export {
    version,
    install,
    Indicator,
    Spinner,
    Toast,

    Layout,
    Group,
    XHeader,
    XBody,
    XInput,
    XButton,
    XSwitch,

    Popup,
    Picker,
    Divider,
    PopupPicker,
    DatetimePicker,
    
    Search,
    Confirm,
    Alert,
    Prompt,
    Icon,
    Actionsheet,
    ActionsheetItem,

    IndexList,
    IndexSection,
    Cell,
    

    LoadMore,
    TabBar,
    OrderBottom,

    NativeShare,
}