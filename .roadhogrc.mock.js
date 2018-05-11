
const fs = require('fs')
const path = require('path')
const mock = {}

fs.readdirSync(path.join(`${__dirname}/mock`)).forEach(file => {
    Object.assign(mock, require(`./mock/${file}`))
})

module.exports = mock
