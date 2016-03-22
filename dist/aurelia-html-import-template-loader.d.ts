declare module 'aurelia-html-import-template-loader' {
  import {
    TemplateRegistryEntry,
    Loader
  } from 'aurelia-loader';
  import {
    FEATURE
  } from 'aurelia-pal';
  
  /**
  * An implementation of the TemplateLoader interface implemented using HTML Imports.
  * Suitable for use when integrating with Polymer.
  */
  export class HTMLImportTemplateLoader {
    
    /**
       * Creates an instance of HTMLImportTemplateLoader.
       */
    constructor();
    
    /**
      * Loads a template.
      * @param loader The loader that is requesting the template load.
      * @param entry The TemplateRegistryEntry to load and populate with a template.
      * @return A promise which resolves when the TemplateRegistryEntry is loaded with a template.
      */
    loadTemplate(loader: Loader, entry: TemplateRegistryEntry): Promise<any>;
  }
  
  /**
   * Configuires the HTMLImportTemplateLoader as the default loader for Aurelia.
   * @param config The FrameworkConfiguration instance.
   */
  export function configure(config: Object): Promise<void>;
}