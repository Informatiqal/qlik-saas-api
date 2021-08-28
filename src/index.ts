import { QlikSaaSClient } from "qlik-rest-api";
import { Apps, IClassApps } from "./modules/Apps";
import { APIKeys, IClassAPIKeys } from "./modules/APIKeys";
import { Audits, IClassAudits } from "./modules/Audits";
import {
  DataConnections,
  IClassDataConnections,
} from "./modules/DataConnections";
import {
  DataCredentials,
  IClassDataCredentials,
} from "./modules/DataCredentials";
import { Spaces, IClassSpaces } from "./modules/Spaces";
import { Items, IClassItems } from "./modules/Items";
import { NL, IClassNL } from "./modules/NaturalLanguage";
import { Licenses, IClassLicenses } from "./modules/Licenses";
import { Origins, IClassOrigins } from "./modules/Origins";
import { Quotas, IClassQuotas } from "./modules/Quotas";
import { Themes, IClassThemes } from "./modules/Themes";
import { Extensions, IClassExtensions } from "./modules/Extensions";
import { Evaluations, IClassEvaluations } from "./modules/Evaluations";
import { Reloads, IClassReloads } from "./modules/Reloads";
import { Users, IClassUsers } from "./modules/Users";
import { WebHooks, IClassWebHooks } from "./modules/WebHooks";
import { OAuthTokens, IClassOAuthTokens } from "./modules/OAuthTokens";
import { Collections, IClassCollections } from "./modules/Collections";

export namespace QlikSaaSApi {
  export class client {
    public saasClient: QlikSaaSClient;
    public apps: IClassApps;
    public apiKeys: IClassAPIKeys;
    public audits: IClassAudits;
    public dataConnections: IClassDataConnections;
    public dataCredentials: IClassDataCredentials;
    public spaces: IClassSpaces;
    public items: IClassItems;
    public naturalLanguage: IClassNL;
    public origins: IClassOrigins;
    public quotas: IClassQuotas;
    public licenses: IClassLicenses;
    public themes: IClassThemes;
    public extensions: IClassExtensions;
    public evaluations: IClassEvaluations;
    public reloads: IClassReloads;
    public users: IClassUsers;
    public webHooks: IClassWebHooks;
    public oauthTokens: IClassOAuthTokens;
    public collections: IClassCollections;

    constructor(public saasConfig: any) {
      this.saasClient = new QlikSaaSClient(saasConfig);

      this.apps = new Apps(this.saasClient);
      this.apiKeys = new APIKeys(this.saasClient);
      this.audits = new Audits(this.saasClient);
      this.dataConnections = new DataConnections(this.saasClient);
      this.dataCredentials = new DataCredentials(this.saasClient);
      this.spaces = new Spaces(this.saasClient);
      this.items = new Items(this.saasClient);
      this.naturalLanguage = new NL(this.saasClient);
      this.licenses = new Licenses(this.saasClient);
      this.origins = new Origins(this.saasClient);
      this.quotas = new Quotas(this.saasClient);
      this.themes = new Themes(this.saasClient);
      this.extensions = new Extensions(this.saasClient);
      this.evaluations = new Evaluations(this.saasClient);
      this.reloads = new Reloads(this.saasClient);
      this.users = new Users(this.saasClient);
      this.webHooks = new WebHooks(this.saasClient);
      this.oauthTokens = new OAuthTokens(this.saasClient);
      this.collections = new Collections(this.saasClient);
    }
  }
}
