import axiosFn from './axios'
import fetchFn from './fetch'

let userAgent = window.navigator.userAgent;
let request;

if (/android/i.test(userAgent)) {
    request = fetchFn;
} else {
    request = axiosFn;
}

export default request