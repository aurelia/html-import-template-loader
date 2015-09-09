define(['exports', 'aurelia-loader'], function (exports, _aureliaLoader) {
  'use strict';

  exports.__esModule = true;
  exports.configure = configure;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var HTMLImportTemplateLoader = (function () {
    function HTMLImportTemplateLoader() {
      _classCallCheck(this, HTMLImportTemplateLoader);

      this.hasTemplateElement = 'content' in document.createElement('template');
      this.needsBundleCheck = true;
      this.onBundleReady = null;
    }

    HTMLImportTemplateLoader.prototype.loadTemplate = function loadTemplate(loader, entry) {
      var _this = this;

      return this._tryFindTemplateInBundle(entry).then(function (found) {
        return found ? entry : _this._importDocument(entry).then(function (doc) {
          return _this._findTemplate(doc, entry);
        });
      });
    };

    HTMLImportTemplateLoader.prototype._tryFindTemplateInBundle = function _tryFindTemplateInBundle(entry) {
      var _this2 = this;

      if (this.bundle) {
        return this._tryGetTemplateFromBundle(entry);
      } else if (this.onBundleReady) {
        return this.onBundleReady.then(function () {
          return _this2._tryGetTemplateFromBundle(entry);
        });
      } else if (this.needsBundleCheck) {
        return this._loadBundle(entry);
      }

      return Promise.resolve(false);
    };

    HTMLImportTemplateLoader.prototype._loadBundle = function _loadBundle(entry) {
      var _this3 = this;

      var bundleLink = document.querySelector('link[aurelia-view-bundle]');
      this.needsBundleCheck = false;

      if (bundleLink) {
        this.onBundleReady = this._importBundle(bundleLink).then(function (doc) {
          _this3._normalizeTemplateIds(doc);
          _this3.bundle = doc;
          _this3.onBundleReady = null;
        });

        return this.onBundleReady.then(function () {
          return _this3._tryGetTemplateFromBundle(entry);
        });
      }

      return Promise.resolve(false);
    };

    HTMLImportTemplateLoader.prototype._importDocument = function _importDocument(entry) {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var frag = document.createDocumentFragment();
        var link = document.createElement('link');

        link.rel = 'import';
        link.href = entry.address;
        frag.appendChild(link);

        _this4._importElements(frag, link, function () {
          return resolve(link['import']);
        });
      });
    };

    HTMLImportTemplateLoader.prototype._findTemplate = function _findTemplate(doc, entry) {
      if (!this.hasTemplateElement) {
        HTMLTemplateElement.bootstrap(doc);
      }

      var template = doc.getElementsByTagName('template')[0];

      if (!template) {
        throw new Error('There was no template element found in \'' + entry.address + '\'.');
      }

      entry.setTemplate(template);
    };

    HTMLImportTemplateLoader.prototype._tryGetTemplateFromBundle = function _tryGetTemplateFromBundle(entry) {
      var found = this.bundle.getElementById(entry.address);

      if (found) {
        entry.setTemplate(found);
        return Promise.resolve(true);
      }

      return Promise.resolve(false);
    };

    HTMLImportTemplateLoader.prototype._importBundle = function _importBundle(link) {
      var _this5 = this;

      return new Promise(function (resolve, reject) {
        if (link['import']) {
          if (!_this5.hasTemplateElement) {
            HTMLTemplateElement.bootstrap(link['import']);
          }

          resolve(link['import']);
        } else {
          _this5._importElements(null, link, function () {
            if (!_this5.hasTemplateElement) {
              HTMLTemplateElement.bootstrap(link['import']);
            }

            resolve(link['import']);
          });
        }
      });
    };

    HTMLImportTemplateLoader.prototype._normalizeTemplateIds = function _normalizeTemplateIds(doc) {
      var templates = doc.getElementsByTagName('template');
      var i = templates.length;

      while (i--) {
        var current = templates[i];
        var beforeNormalize = current.getAttribute('id') + '!template-registry-entry';
        var afterNormalize = System.normalizeSync(beforeNormalize);
        current.setAttribute('id', afterNormalize.replace('!template-registry-entry', ''));
      }
    };

    HTMLImportTemplateLoader.prototype._importElements = function _importElements(frag, link, callback) {
      if (frag) {
        document.head.appendChild(frag);
      }

      if (window.Polymer && Polymer.whenReady) {
        Polymer.whenReady(callback);
      } else {
        link.addEventListener('load', callback);
      }
    };

    return HTMLImportTemplateLoader;
  })();

  exports.HTMLImportTemplateLoader = HTMLImportTemplateLoader;

  function configure(config) {
    config.aurelia.loader.useTemplateLoader(new HTMLImportTemplateLoader());

    if (!('import' in document.createElement('link'))) {
      return System.normalize('aurelia-html-import-loader').then(function (name) {
        return System['import']('webcomponentsjs/HTMLImports.min', name);
      });
    }
  }
});