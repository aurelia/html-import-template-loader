define(['exports', './aurelia-html-import-template-loader'], function (exports, _aureliaHtmlImportTemplateLoader) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.keys(_aureliaHtmlImportTemplateLoader).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(exports, key, {
      enumerable: true,
      get: function () {
        return _aureliaHtmlImportTemplateLoader[key];
      }
    });
  });
});