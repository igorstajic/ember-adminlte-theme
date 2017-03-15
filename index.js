/* jshint node: true */
'use strict';

var path = require('path'),
  Funnel = require('broccoli-funnel'),
  BroccoliMergeTrees = require('broccoli-merge-trees'),
  util = require('util');

module.exports = {
  name: 'ember-adminlte-theme',
  getExamplePath: "pub/example",
  default_options: {
    plugins: ["slimscroll", "fastclick"]
  },
  treeForPublic: function(tree){
    var trees = [tree]

    trees.push(new Funnel("public/", {
      srcDir: "/",
      exclude: ['**/.DS_Store','**/*.md'],
      destDir: "/"
    }))

    if(this.getEnv() == "development"){
      trees.push(new Funnel(this.rootPath +"/vendor/", {
        srcDir: "example",
        destDir: "example"
      }))

      trees.push(new Funnel(this.rootPath +"/vendor/", {
        srcDir: "plugins",
        destDir: "plugins"
      }))
    }

    return BroccoliMergeTrees(trees, {overwrite: true });
  },
  included: function(app){
    var self = this;

    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.nodeModulePath = app.options.project.nodeModulesPath
    this.rootPath = this.nodeModulePath + "/"+ this.name
    this.app = app

    this.options = this.objMerge({}, this.default_options)

    if(app.options.adminLTE){
      this.options = this.objMerge(this.options, app.options.adminLTE)
      if(app.options.adminLTE.plugins){
        this.options.plugins = this.getUnique(this.default_options.plugins.concat(app.options.adminLTE.plugins))
      }
    }

    app.import('vendor/bootstrap/css/bootstrap.css');
    app.import('vendor/css/AdminLTE.css');
    app.import('vendor/css/_all-skins.min.css');
    app.import('vendor/css/font-awesome.css');
    app.import('vendor/bootstrap/js/bootstrap.js');

    app.import("vendor/bootstrap/fonts/glyphicons-halflings-regular.eot", {destDir: 'fonts'})
    app.import("vendor/bootstrap/fonts/glyphicons-halflings-regular.svg", {destDir: 'fonts'})
    app.import("vendor/bootstrap/fonts/glyphicons-halflings-regular.ttf", {destDir: 'fonts'})
    app.import("vendor/bootstrap/fonts/glyphicons-halflings-regular.woff", {destDir: 'fonts'})
    app.import("vendor/bootstrap/fonts/glyphicons-halflings-regular.woff2", {destDir: 'fonts'})

    this.options.plugins.forEach(function(plugin){
      self.loadCssPath(plugin)
      self.loadJSPath(plugin)
    })
    app.import('vendor/js/app.js');
  },
  getEnv: function () {
    return process.env.EMBER_ENV
  },
  logger: function(message){
    console.log('['+ this.name +' HANDLING] '+ message)
  },
  cssPluginsPaths: {
    "datepicker": "datepicker/datepicker3.css",
    "select2": "select2/select2.css",
    "icheck": "iCheck/all.css",
    "morris": "morris/morris.css",
    "bootstrap-wysihtml5": "bootstrap-wysihtml5/bootstrap3-wysihtml5.min.css",
    "daterangepicker": "daterangepicker/daterangepicker-bs3.css",
    "jvectormap": "jvectormap/jquery-jvectormap-1.2.2.css",
    "timepicker": "timepicker/bootstrap-timepicker.css",
    "fullcalendar": ["fullcalendar/fullcalendar.css", "fullcalendar/fullcalendar.print.css"]
  },
  jsPluginsPaths: {
    "slimscroll": "slimScroll/jquery.slimscroll.min.js",
    "fastclick": "fastclick/fastclick.min.js",
    "jquery": "jQuery/jQuery-2.1.4.min.js",
    "input-mask": "input-mask/jquery.inputmask.js",
    "select2": ["select2/select2.full.min.js", "select2/i18n/zh-CN.js"],
    "datepicker": ["datepicker/bootstrap-datepicker.js", "datepicker/locales/bootstrap-datepicker.zh-CN.js"],
    "icheck": "iCheck/icheck.min.js",
    "morris": "morris/morris.min.js",
    "bootstrap-wysihtml5": "bootstrap-wysihtml5/bootstrap3-wysihtml5.all.min.js",
    "daterangepicker": "daterangepicker/daterangepicker.js",
    "jvectormap": "jvectormap/jquery-jvectormap-1.2.2.min.js",
    "timepicker": "timepicker/bootstrap-timepicker.js",
    "fullcalendar": "fullcalendar/fullcalendar.js",
    "moment": "moment/moment.min.js"
  },
  getUnique: function(items){
    var u = {}, a = [];
    for(var i = 0, l = items.length; i < l; ++i){
      if(u.hasOwnProperty(items[i])) {
         continue;
      }
      a.push(items[i]);
      u[items[i]] = 1;
    }
    return a;
  },
  objMerge: function(data, items){
    for(var k in items){  
      data[k] = items[k]
    }
    return data;
  },
  loadJSPath: function(plugin){
    var jsPath = this.jsPluginsPaths[plugin]
    this.loadFilePath(jsPath)
  },
  loadCssPath: function(plugin){
    var cssPath = this.cssPluginsPaths[plugin]
    this.loadFilePath(cssPath)
  },
  loadFilePath: function(path){
    var self = this;
    if(path){
      [].concat(path).forEach(function(p){
        self.app.import("vendor/plugins/"+ p)  
      })
    }
  }
};
