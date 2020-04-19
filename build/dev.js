var fis = require('fis3')
process.env.WEBAPI_ENV = 'dev'
process.env.NODE_ENV = 'development'

/**
 * '-h, --help': 'print this help message',
 * '-d, --dest <path>': 'release output destination',
 * '-l, --lint': 'with lint',
 * '-w, --watch': 'monitor the changes of project',
 * '-L, --live': 'automatically reload your browser',
 * '-c, --clean': 'clean compile cache',
 * '-u, --unique': 'use unique compile caching',
 * '-r, --root <path>': 'specify project root',
 * '-f, --file <filename>': 'specify the file path of `fis-conf.js`',
 * '--no-color': 'disable colored output',
 * '--verbose': 'enable verbose mode'
 */
fis({ media: 'dev', live: true, watch: true, clean: true})
require('./dev-server')
