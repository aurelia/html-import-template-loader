declare module 'aurelia-html-import-template-loader' {
  import { TemplateRegistryEntry, Loader }  from 'aurelia-loader';
  import { FEATURE }  from 'aurelia-pal';
  export class HTMLImportTemplateLoader {
    constructor();
    loadTemplate(loader: Loader, entry: TemplateRegistryEntry): Promise<any>;
  }
  export function configure(config: any): any;
}