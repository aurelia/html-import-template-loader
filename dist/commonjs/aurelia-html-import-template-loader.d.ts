declare module 'aurelia-html-import-template-loader' {
  import { TemplateRegistryEntry, Loader }  from 'aurelia-loader';
  export class HTMLImportTemplateLoader {
    constructor();
    loadTemplate(loader: Loader, entry: TemplateRegistryEntry): Promise<any>;
  }
  export function configure(config: any): any;
}