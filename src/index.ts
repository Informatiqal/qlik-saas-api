import { QlikSaaSClient } from "qlik-rest-api";
import { Apps, IClassApps } from "./modules/Apps";
import { APIKeys, IClassAPIKeys } from "./modules/APIKeys";
import { Audits, IClassAudits } from "./modules/Audits";
import {
  DataConnections,
  IClassDataConnections,
} from "./modules/DataConnections";
import { Spaces, IClassSpaces } from "./modules/Spaces";
import { Items, IClassItems } from "./modules/Items";
import { NL, IClassNL } from "./modules/NaturalLanguage";
import { Origins, IClassOrigins } from "./modules/Origins";
import { Quotas, IClassQuotas } from "./modules/Quotas";
import { Themes, IClassThemes } from "./modules/Themes";
import { Extensions, IClassExtensions } from "./modules/Extensions";
import { Evaluations, IClassEvaluations } from "./modules/Evaluations";
import { Reloads, IClassReloads } from "./modules/Reloads";

export namespace QlikSaaSApi {
  export class client {
    public saasClient: QlikSaaSClient;
    public apps: IClassApps;
    public apiKeys: IClassAPIKeys;
    public audits: IClassAudits;
    public dataConnections: IClassDataConnections;
    public spaces: IClassSpaces;
    public items: IClassItems;
    public naturalLanguage: IClassNL;
    public origins: IClassOrigins;
    public quotas: IClassQuotas;
    public themes: IClassThemes;
    public extensions: IClassExtensions;
    public evaluations: IClassEvaluations;
    public reloads: IClassReloads;

    constructor(public saasConfig: any) {
      this.saasClient = new QlikSaaSClient(saasConfig);

      this.apps = new Apps(this.saasClient);
      this.apiKeys = new APIKeys(this.saasClient);
      this.audits = new Audits(this.saasClient);
      this.dataConnections = new DataConnections(this.saasClient);
      this.spaces = new Spaces(this.saasClient);
      this.items = new Items(this.saasClient);
      this.naturalLanguage = new NL(this.saasClient);
      this.origins = new Origins(this.saasClient);
      this.quotas = new Quotas(this.saasClient);
      this.themes = new Themes(this.saasClient);
      this.extensions = new Extensions(this.saasClient);
      this.evaluations = new Evaluations(this.saasClient);
      this.reloads = new Reloads(this.saasClient);
    }
  }
}
