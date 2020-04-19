require('shelljs/global')
var fs = require('fs')
var path = require('path')
var config = require('./config')
var namespace = config.build.namespace

// global start
var paths = require('./paths') || {}
fis.project.setProjectRoot(config.build.workspaceRoot)
fis.hook(config.build.moduleMode, {
  forwardDeclaration: true,
  // skipBuiltinModules: true,
  // 兼容require(id)的写法
  paths: paths
})
// 设置项目源码文件过滤，按需编译
fis.set('project.files', [
    'sites/**/*.{html,dot,json}',  //只处理 html 类型文件，根据 html 引用依赖分析其他文件
]);

fis.match('*.{js,css,less,dot}', {
  useHash: true
});

fis.match('::image', {
  useHash: true
});

fis.match('*.{js,dot}', {
  optimizer: fis.plugin('uglify-js'),
  useSameNameRequire: true,
  useMap: true
});

fis.match('*.{less,css}', {
  optimizer: fis.plugin('clean-css')
});

fis.match('*.png', {
  // optimizer: fis.plugin('png-compressor')
  // 图片格式错误导致编译报错
});

fis.match('*.dot', {
  parser: fis.plugin('dot-compiler'),
  isMod: true,
  rExt: '.js'
})

fis.match('*.less', {
  parser: fis.plugin('less'),
  rExt: '.css'
});

fis.match('*.{css,less}', {
  // preprocessor: fis.plugin('autoprefixer', {
  // "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
  // "cascade": true
  // })
  useSprite: true
})

fis.match('echarts/**.js', {
  optimizer: null
});

// define module
fis.match('{' + config.build.modulePath.join(',') + '}/**.js', {
  isMod: true
})

fis.match('sites/**.html', {
  deploy: fis.plugin('local-deliver', {
    to: './' + config.build.outPath
  }),
  useMap: true
})
//
fis.match(/sites\/(.*)\.(css|less|js|dot)$/, {
  release: function ($0, $1) {
    return $0[1].replace(/\//g, '_')
  },
  deploy: [
    fis.plugin('local-deliver', {
      to: './' + config.build.outPath + 'static/'
    }),
    // 强行把dot模板再输出一遍
    function (options, modified, total, next) {
      var to = fis.util(process.cwd() + '/' + config.build.outPath)
      modified.forEach(function (file) {
        if (file.ext === '.dot') {
          fis.util.write(to + '/' + file.id, fs.readFileSync(file.origin))
        }
      })
      next()
    }
  ],
  useSprite: true,
  moduleId: '$1',
});

fis.match(/(modules|modules-lite)\/(.*)\.(css|less|js|dot)$/, {
  release: function ($0) {
    return $0[1] + '/' + $0[2].replace(/\//g, '_')
  },
  deploy: fis.plugin('local-deliver', {
    to: './' + config.build.outPath + 'static/'
  }),
  moduleId: '$2',
}).match(/(src\/utils\/.*)\.js/, {
  release: function ($0) {
    return 'modules/' + $0[1].replace(/\//g, '_')
  },
  deploy: fis.plugin('local-deliver', {
    to: './' + config.build.outPath + 'static/'
  }),
  useSprite: true,
  moduleId: '$2',
}).match(/(modules-lite)\/(.*)\.(css|less|js|dot)$/, {
  release: function ($0) {
    return $0[1] + '/' + $0[2].replace(/\//g, '_')
  },
  deploy: fis.plugin('local-deliver', {
    to: './' + config.build.outPath + 'static/'
  }),
  moduleId: '$1'+ '/' +'$2',
}).match(/(modules-touch)\/(.*)\.(css|less|js|dot)$/, {
  release: function ($0) {
    return $0[1] + '/' + $0[2].replace(/\//g, '_')
  },
  deploy: fis.plugin('local-deliver', {
    to: './' + config.build.outPath + 'static/'
  }),
  moduleId: '$1'+ '/' +'$2',
})

// 自定义path 的都不需要jswrap
Object.keys(paths).forEach(function (id) {
  var subpath = paths[id]
  fis.match(subpath, {
    isMod: false
  })
})

fis.match('/modules-lite/{config,mod,monitor}.js', {
  useHash: false,
  isMod: false
})

fis.match('::image', {
  release: 'images/$0',
  deploy: fis.plugin('local-deliver', {
    to: './' + config.build.outPath + 'static/'
  })
})

fis.match('map.json', {
  deploy: fis.plugin('local-deliver', {
    to: './' + config.build.outPath
  })
})

fis.match('/sites/**/config.json', {
  deploy: fis.plugin('local-deliver', {
    to: './' + config.build.outPath
  })
})

fis.match('maintain.json', {
  deploy: fis.plugin('local-deliver', {
    to: './' + config.build.outPath
  })
})

fis.match('::package', {
  spriter: fis.plugin('csssprites')
})

// default media is `dev`
fis.media('dev')
  .match('*', {
    useHash: false,
    optimizer: null
  }).match('::package', {
    prepackager: function () { },
    postpackager: [fis.plugin('loader', {})]
  });

// extends GLOBAL config
fis.media('qa')
  .match('*', {
    optimizer: null
  }).match(/sites\/(.*)\.(css|less|js|dot)$/, {
    release: function ($0) {
      return path.join('js/cn/v/', namespace, $0[1].replace(/\//g, '_'))
    },
    domain: '//f.1024.team'
  }).match(/(modules|utils)\/(.*)\.(css|less|js|dot)/, {
    release: function ($0) {
      return path.join('js/cn/v/', namespace, 'modules', $0[2].replace(/\//g, '_'))
    },
    domain: '//f.1024.team'
  }).match(/(modules-lite)\/(.*)\.(css|less|js|dot)/, {
    release: function ($0) {
      return path.join('js/cn/v/', namespace, 'modules-lite', $0[2].replace(/\//g, '_'))
    },
    domain: '//f.1024.team'
  }).match(/(modules-touch)\/(.*)\.(css|less|js|dot)/, {
    release: function ($0) {
      return path.join('js/cn/v/', namespace, 'modules-touch', $0[2].replace(/\//g, '_'))
    },
    domain: '//f.1024.team'
  }).match('::image', {
    release: function ($0, $1) {
      return path.join('js/cn/v/', namespace, 'images', $1)
    },
    domain: '//f.1024.team'
  }).match('::package', {
    // prepackager: function () { },
    postpackager: [fis.plugin('loader', {})]
  });

fis.media('prod')
  .match(/sites\/(.*)\.(css|less|js|dot)$/, {
    release: function ($0) {
      return path.join('cn/v/', namespace, $0[1].replace(/\//g, '_'))
    },
    domain: '//file.40017.cn/' + config.build.bucket
  }).match(/(modules|utils)\/(.*)\.(css|less|js|dot)/, {
    release: function ($0) {
      return path.join('cn/v/', namespace, 'modules', $0[2].replace(/\//g, '_'))
    },
    domain: '//file.40017.cn/' + config.build.bucket
  }).match(/(modules-lite)\/(.*)\.(css|less|js|dot)/, {
    release: function ($0) {
      return path.join('cn/v/', namespace, 'modules-lite', $0[2].replace(/\//g, '_'))
    },
    domain: '//file.40017.cn/' + config.build.bucket
  }).match(/(modules-touch)\/(.*)\.(css|less|js|dot)/, {
    release: function ($0) {
      return path.join('cn/v/', namespace, 'modules-touch', $0[2].replace(/\//g, '_'))
    },
    domain: '//file.40017.cn/' + config.build.bucket
  }).match('::image', {
    release: function ($0, $1) {
      return path.join('cn/v/', namespace, 'images', $1)
    },
    domain: '//file.40017.cn/' + config.build.bucket
  }).match('::package', {
    postpackager: [fis.plugin('loader', {})]
  })

// 
fis.match('/sites/stat/**/*.js', {
  useHash: false,
  isMod: false
})
fis.match('/sites/stat/*.js', {
  useHash: false,
  isMod: false
})
fis.match('/sites/stat/statui/index.{less, css}', {
  useHash: false
})
fis.match('/sites/activity/pc/hktest/html2canvas.js', {
  useHash: false,
  isMod: false
})
fis.match('/sites/activity/pc/hktest/**.{js,less,css}', {
  useHash: false,
  isMod: false
})