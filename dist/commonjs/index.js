'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _aureliaHtmlImportTemplateLoader = require('./aurelia-html-import-template-loader');

Object.keys(_aureliaHtmlImportTemplateLoader).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aureliaHtmlImportTemplateLoader[key];
    }
  });
});