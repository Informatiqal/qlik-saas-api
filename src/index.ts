import { QlikSaaSClient } from "qlik-rest-api";
import { Apps, IClassApps } from "./modules/Apps";
import { Audits, IClassAudits } from "./modules/Audits";
import { Spaces, IClassSpaces } from "./modules/Spaces";
import { Items, IClassItems } from "./modules/Items";
import { Origins, IClassOrigins } from "./modules/Origins";
import { Quotas, IClassQuotas } from "./modules/Quotas";
import { Themes, IClassThemes } from "./modules/Themes";
import { Extensions, IClassExtensions } from "./modules/Extensions";

export namespace QlikSaaSApi {
  export class client {
    public saasClient: QlikSaaSClient;
    public apps: IClassApps;
    public audits: IClassAudits;
    public spaces: IClassSpaces;
    public items: IClassItems;
    public origins: IClassOrigins;
    public quotas: IClassQuotas;
    public themes: IClassThemes;
    public extensions: IClassExtensions;

    constructor(public saasConfig: any) {
      this.saasClient = new QlikSaaSClient(saasConfig);

      this.apps = new Apps(this.saasClient);
      this.audits = new Audits(this.saasClient);
      this.spaces = new Spaces(this.saasClient);
      this.items = new Items(this.saasClient);
      this.origins = new Origins(this.saasClient);
      this.quotas = new Quotas(this.saasClient);
      this.themes = new Themes(this.saasClient);
      this.extensions = new Extensions(this.saasClient);
    }
  }
}
