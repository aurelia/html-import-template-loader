import {TemplateRegistryEntry, Loader} from 'aurelia-loader';
import {FEATURE} from 'aurelia-pal';
import {initialize} from 'aurelia-pal-browser';

/**
* An implementation of the TemplateLoader interface implemented using HTML Imports.
* Suitable for use when integrating with Polymer.
*/
export class HTMLImportTemplateLoader {

  /**
   * Creates an instance of HTMLImportTemplateLoader.
   */
  constructor(linkHrefPrefix) {
    this.linkHrefPrefix = linkHrefPrefix || "";
    this.needsBundleCheck = true;
    this.onBundleReady = null;
  }

  /**
  * Loads a template.
  * @param loader The loader that is requesting the template load.
  * @param entry The TemplateRegistryEntry to load and populate with a template.
  * @return A promise which resolves when the TemplateRegistryEntry is loaded with a template.
  */
  loadTemplate(loader: Loader, entry: TemplateRegistryEntry): Promise<any> {
    return this._tryFindTemplateInBundle(loader, entry).then(found => {
      return found ? entry : this._importDocument(entry).then(doc => this._findTemplate(doc, entry));
    });
  }

  _tryFindTemplateInBundle(loader, entry) {
    if (this.bundle) {
      return this._tryGetTemplateFromBundle(entry);
    } else if (this.onBundleReady) {
      return this.onBundleReady.then(() => this._tryGetTemplateFromBundle(entry));
    } else if (this.needsBundleCheck) {
      return this._loadBundle(loader, entry);
    }

    return Promise.resolve(false);
  }

  _loadBundle(loader, entry) {
    let bundleLink = document.querySelector('link[aurelia-view-bundle]');
    this.needsBundleCheck = false;

    if (bundleLink) {
      this.onBundleReady = this._importBundle(bundleLink).then(doc => {
        return this._normalizeTemplateIds(loader, doc).then(() => {
          this.bundle = doc;
          this.onBundleReady = null;
        });
      });

      return this.onBundleReady.then(() => this._tryGetTemplateFromBundle(entry));
    }

    return Promise.resolve(false);
  }

  _importDocument(entry) {
    return new Promise((resolve, reject) => {
      let frag = document.createDocumentFragment();
      let link = document.createElement('link');

      link.rel = 'import';
      link.href = this.linkHrefPrefix + entry.address;
      frag.appendChild(link);

      this._importElements(frag, link, () => resolve(link.import));
    });
  }

  _findTemplate(doc, entry) {
    let template = doc.getElementsByTagName('template')[0];

    if (!template) {
      throw new Error(`There was no template element found in '${entry.address}'.`);
    }
    entry.template = FEATURE.ensureHTMLTemplateElement(template);
  }

  _tryGetTemplateFromBundle(entry) {
    let found = this.bundle.getElementById(entry.address);

    if (found) {
      entry.template = FEATURE.ensureHTMLTemplateElement(found);
      return Promise.resolve(true);
    }

    return Promise.resolve(false);
  }

  _importBundle(link) {
    return new Promise((resolve, reject) => {
      if (link.import) {
        resolve(link.import);
      } else {
        this._importElements(null, link, () => resolve(link.import));
      }
    });
  }

  _normalizeTemplateIds(loader, doc) {
    let templates = doc.getElementsByTagName('template');
    let i = templates.length;
    let all = [];

    while (i--) {
      let current = templates[i];
      let id = current.getAttribute('id');

      if (id !== null && id !== undefined) {
        all.push(normalizeTemplateId(loader, id, current));
      }
    }

    return Promise.all(all);
  }

  _importElements(frag, link, callback) {
    if (frag) {
      document.head.appendChild(frag);
    }

    if (window.Polymer && Polymer.whenReady ) {
      Polymer.whenReady(callback);
    } else {
      link.addEventListener('load', callback);
    }
  }
}

function normalizeTemplateId(loader, id, current) {
  let beforeNormalize = id + '!template-registry-entry';

  return loader.normalize(beforeNormalize).then(afterNormalize => {
    current.setAttribute('id', afterNormalize.replace('!template-registry-entry', ''));
  });
}

/**
 * Configuires the HTMLImportTemplateLoader as the default loader for Aurelia.
 * @param config The FrameworkConfiguration instance.
 */
export function configure(config: Object, inlineConfig: Object): Promise<void> {
  initialize();
  config.aurelia.loader.useTemplateLoader(new HTMLImportTemplateLoader(inlineConfig.linkHrefPrefix));

  // Check for native or polyfilled HTML imports support.
  if (!('import' in document.createElement('link')) && !('HTMLImports' in window)) {
    return config.aurelia.loader.normalize('aurelia-html-import-template-loader').then(name => {
      return config.aurelia.loader.normalize('webcomponentsjs/HTMLImports.min', name);
    }).then(importsName => config.aurelia.loader.loadModule(importsName));
  }
}
