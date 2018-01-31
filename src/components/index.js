import './index.scss';

import Layout from './layout'
import { XButton, XButtonGroup } from './button'
import { NavBar, NavBarBackIcon, NavBarNextIcon } from './navbar'
import Popup from './popup'

const install = function(Vue) {

}

if(typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export {
    install,

    Layout,
    XButton, XButtonGroup,
    NavBar, NavBarBackIcon, NavBarNextIcon,
    Popup
}