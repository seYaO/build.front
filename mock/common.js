const Mock = require('mockjs')
const config = require('../src/utils/config')

const queryArray = (array, key, keyAlias = 'key') => {
    if (!(array instanceof Array)) {
        return null
    }
    const item = array.filter(_ => _[keyAlias] === key)
    if (item.length) {
        return item[0]
    }
    return null
}

const NOTFOUND = {
    message: 'Not Found',
    documentation_url: 'http://localhost:8000/request',
}


module.exports = {
    queryArray,
    NOTFOUND,
    Mock,
    config,
}
