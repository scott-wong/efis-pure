var fis = module.exports = require('fis')

fis.cli.name = 'efis-pure'
fis.cli.info = fis.util.readJSON(__dirname + '/package.json')
  //output version info
fis.cli.version = function() {
  var content = [
    '',
    '  v' + fis.cli.info.version,
    '',
    '  ╔═╗╔═╗╦╔═╗',
    '  ║╣  ╠╣  ║╚═╗',
    '  ╚═╝╚    ╩╚═╝',
    ''
  ].join('\n')
  console.log(content)
}

fis.config.merge({
  statics: '/static',
  modules: {
    parser: {
      less: 'less',
      tmpl: 'utc',
      atpl: 'artc',
      stpl: 'swig'
    },
    preprocessor: {
      css: 'cssprefixer'
    },
    postprocessor: {
      js: 'jswrapper, require-async',
      html: 'require-async'
    },
    postpackager: 'autoload, simple, html-minifier',
    lint: {
      js: 'jshint'
    }
  },
  roadmap: {
    ext: {
      less: 'css',
      stpl: 'html'
    },
    path: [{
      reg: /^\/pages\/(.*)$/i,
      useCache: false,
      release: '${project.name}/$1'
    }, {
      //一级同名组件，可以引用短路径，比如modules/jquery/juqery.js
      //直接引用为var $ = require('jquery');
      reg: /^\/modules\/([^\/]+)\/\1\.(js)$/i,
      //是组件化的，会被jswrapper包装
      isMod: true,
      //id为文件夹名
      id: '$1',
      release: '${statics}/${project.name}/$&'
    }, {
      //二级同名组件，可以引用短路径，比如modules/ui/header/header.js
      //直接引用为var $ = require('ui/header');
      reg: /^\/modules\/([^\/]+)\/([^\/]+)\/\2\.(js)$/i,
      //是组件化的，会被jswrapper包装
      isMod: true,
      //id为文件夹名
      id: '$1/$2',
      release: '${statics}/${project.name}/$&'
    }, {
      //modules目录下的其他文件
      reg: /^\/modules\/(.*)\.(js)$/i,
      //是组件化的，会被jswrapper包装
      isMod: true,
      //id是去掉modules和.js后缀中间的部分
      id: '$1',
      release: '${statics}/${project.name}/$&'
    }, {
      //mixins文件夹不发布
      reg: /^(.*)\/mixins\/(.*)$/i,
      release: false
    }, {
      //其他css文件
      reg: /^(.*)\.(css|less)$/i,
      //css文件会做csssprite处理
      useSprite: true,
      release: '${statics}/${project.name}/$&'
    }, {
      //前端模板
      reg: /.*\.(tmpl|atpl)/,
      //当做类js文件处理，可以识别__inline, __uri等资源定位标识
      isJsLike: true,
      //只是内嵌，不用发布
      release: false
    }, {
      reg: /.*\.(cmd)/,
      release: false
    }, {
      reg: '**',
      release: '${statics}/${project.name}/$&'
    }]
  },
  settings: {
    preprocessor: {
      cssprefixer: {
        // detail config (https://github.com/postcss/autoprefixer#browsers)
        browsers: [
          'Android 2.3',
          'Android >= 4',
          'Chrome >= 20',
          'Firefox >= 24',
          'Explorer >= 8',
          'iOS >= 6',
          'Opera >= 12',
          'Safari >= 6'
        ],
        cascade: true
      }
    },
    postprocessor: {
      jswrapper: {
        type: 'amd'
      }
    },
    postpackager: {
      simple: {
        //设置是否自动将零散资源进行打包
        autoCombine: true,
        //设置是否自动优化脚本与样式资源引用位置
        autoReflow: true
      },
      autoload: {
        useInlineMap: true
      }
    },
    lint: {
      jshint: {
        asi: false,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        noempty: true,
        node: true,
        sub: true,
        undef: true
      }
    }
  },
  project: {
    fileType: {
      text: ['atpl', 'stpl']
    }
  }
})
