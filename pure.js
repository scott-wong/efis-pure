var fis = module.exports = require('fis');

fis.cli.name = 'efis-pure';
fis.cli.info = fis.util.readJSON(__dirname + '/package.json');

fis.config.merge({
    statics: '/static',
    modules: {
        parser: {
            less: 'less',
            tmpl: 'utc',
            atpl: 'artc',
            stpl: 'swig'
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
            //less的mixin文件无需发布
            reg: /^(.*)mixin\.less$/i,
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
            reg: /.*\.(html|jsp|tpl|vm|htm|asp|aspx|atpl|stpl)/,
            useCache: false,
            release: '${project.name}/$&'
        }, {
            reg: "README.md",
            release: false
        }, {
            reg: "**",
            release: '${statics}/${project.name}/$&'
        }]
    },
    settings: {
        postprocessor: {
            jswrapper: {
                type: 'amd'
            }
        },
        postpackager: {
            simple: {
                //设置是否自动将零散资源进行打包
                autoCombine: true
            }
        },
        jshint: {
            //using Chinese reporter
            i18n: 'zh-CN',
            camelcase: true,
            curly: true,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            noempty: true,
            node: true
        }
    },
    project: {
        fileType: {
            text: ['atpl', 'stpl']
        }
    }
});
