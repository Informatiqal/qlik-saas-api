import { QlikSaaSClient } from "qlik-rest-api";
import { Apps } from "./modules/Apps";
import { AutoML } from "./modules/AutoML";
import { DataAlerts } from "./modules/DataAlerts";
import { Automations } from "./modules/Automations";
import { APIKeys } from "./modules/APIKeys";
import { Audits } from "./modules/Audits";
import { DataConnections } from "./modules/DataConnections";
import { DataCredentials } from "./modules/DataCredentials";
import { Conditions } from "./modules/Conditions";
import { Spaces } from "./modules/Spaces";
import { Items } from "./modules/Items";
import { NL } from "./modules/NaturalLanguage";
import { Licenses } from "./modules/Licenses";
import { Origins } from "./modules/Origins";
import { Quotas } from "./modules/Quotas";
import { Themes } from "./modules/Themes";
import { Extensions } from "./modules/Extensions";
import { Evaluations } from "./modules/Evaluations";
import { Reloads } from "./modules/Reloads";
import { ReloadTasks } from "./modules/ReloadTasks";
import { Roles } from "./modules/Roles";
import { Users } from "./modules/Users";
import { WebHooks } from "./modules/WebHooks";
import { OAuthTokens } from "./modules/OAuthTokens";
import { Collections } from "./modules/Collections";
import { Lineage } from "./modules/Lineage";
import { IdentityProviders } from "./modules/IdentityProviders";
import { Groups } from "./modules/Groups";
import { Tenants } from "./modules/Tenants";
import { WebIntegrations } from "./modules/WebIntegrations";
import { Notifications } from "./modules/Notifications";

export namespace QlikSaaSApi {
  export class client {
    public saasClient: QlikSaaSClient;
    public apps: Apps;
    public autoML: AutoML;
    public automations: Automations;
    public apiKeys: APIKeys;
    public audits: Audits;
    /**
     * BETA
     */
    public dataAlerts: DataAlerts;
    public dataConnections: DataConnections;
    public dataCredentials: DataCredentials;
    public conditions: Conditions;
    public spaces: Spaces;
    public groups: Groups;
    public items: Items;
    public naturalLanguage: NL;
    public origins: Origins;
    public quotas: Quotas;
    public licenses: Licenses;
    public themes: Themes;
    public extensions: Extensions;
    /**
     * @deprecated
     * The evaluation endpoints are deprecated are moved under /apps endpoints.
     *
     * Deprecation date (announcement date) - 30 Aug 2022
     *
     * See https://qlik.dev/changelog/deprecation-of-the-evaluations-api
     */
    public evaluations: Evaluations;
    public reloads: Reloads;
    public reloadTasks: ReloadTasks;
    public roles: Roles;
    public users: Users;
    public webHooks: WebHooks;
    public oauthTokens: OAuthTokens;
    public collections: Collections;
    public identityProviders: IdentityProviders;
    public tenants: Tenants;
    public webIntegrations: WebIntegrations;
    public notifications: Notifications;
    public lineage: Lineage;

    constructor(public saasConfig: any) {
      this.saasClient = new QlikSaaSClient(saasConfig);
      this.apps = new Apps(this.saasClient);
      this.autoML = new AutoML(this.saasClient);
      this.automations = new Automations(this.saasClient);
      this.apiKeys = new APIKeys(this.saasClient);
      this.audits = new Audits(this.saasClient);
      this.dataAlerts = new DataAlerts(this.saasClient);
      this.dataConnections = new DataConnections(this.saasClient);
      this.dataCredentials = new DataCredentials(this.saasClient);
      this.conditions = new Conditions(this.saasClient);
      this.spaces = new Spaces(this.saasClient);
      this.groups = new Groups(this.saasClient);
      this.items = new Items(this.saasClient);
      this.naturalLanguage = new NL(this.saasClient);
      this.licenses = new Licenses(this.saasClient);
      this.origins = new Origins(this.saasClient);
      this.quotas = new Quotas(this.saasClient);
      this.themes = new Themes(this.saasClient);
      this.extensions = new Extensions(this.saasClient);
      this.evaluations = new Evaluations(this.saasClient);
      this.reloads = new Reloads(this.saasClient);
      this.reloadTasks = new ReloadTasks(this.saasClient);
      this.roles = new Roles(this.saasClient);
      this.users = new Users(this.saasClient);
      this.webHooks = new WebHooks(this.saasClient);
      this.oauthTokens = new OAuthTokens(this.saasClient);
      this.collections = new Collections(this.saasClient);
      this.identityProviders = new IdentityProviders(this.saasClient);
      this.tenants = new Tenants(this.saasClient);
      this.webIntegrations = new WebIntegrations(this.saasClient);
      this.notifications = new Notifications(this.saasClient);
      this.lineage = new Lineage(this.saasClient);
    }
  }
}
