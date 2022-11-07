import { QlikSaaSClient } from "qlik-rest-api";
import { Apps, IClassApps } from "./modules/Apps";
import { DataAlerts, IClassDataAlerts } from "./modules/DataAlerts";
import { Automations, IClassAutomations } from "./modules/Automations";
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
import { Conditions, IClassConditions } from "./modules/Conditions";
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
import { ReloadTasks, IClassReloadTasks } from "./modules/ReloadTasks";
import { Roles, IClassRoles } from "./modules/Roles";
import { Users, IClassUsers } from "./modules/Users";
import { WebHooks, IClassWebHooks } from "./modules/WebHooks";
import { OAuthTokens, IClassOAuthTokens } from "./modules/OAuthTokens";
import { Collections, IClassCollections } from "./modules/Collections";
import {
  IdentityProviders,
  IClassIdentityProviders,
} from "./modules/IdentityProviders";
import { Groups, IClassGroups } from "./modules/Groups";
import { Tenants, IClassTenants } from "./modules/Tenants";
import {
  WebIntegrations,
  IClassWebIntegrations,
} from "./modules/WebIntegrations";
import { Notifications, IClassNotifications } from "./modules/Notifications";
import { IClassTransports, Transports } from "./modules/Transports";

export namespace QlikSaaSApi {
  export class client {
    public saasClient: QlikSaaSClient;
    public apps: IClassApps;
    public automations: IClassAutomations;
    public apiKeys: IClassAPIKeys;
    public audits: IClassAudits;
    /**
     * BETA
     */
    public dataAlerts: IClassDataAlerts;
    public dataConnections: IClassDataConnections;
    public dataCredentials: IClassDataCredentials;
    public conditions: IClassConditions;
    public spaces: IClassSpaces;
    public groups: IClassGroups;
    public items: IClassItems;
    public naturalLanguage: IClassNL;
    public origins: IClassOrigins;
    public quotas: IClassQuotas;
    public licenses: IClassLicenses;
    public themes: IClassThemes;
    public extensions: IClassExtensions;
    /**
     * @deprecated
     * The evaluation endpoints are deprecated are moved under /apps endpoints.
     *
     * Deprecation date (announcement date) - 30 Aug 2022
     *
     * See https://qlik.dev/changelog/deprecation-of-the-evaluations-api
     */
    public evaluations: IClassEvaluations;
    public reloads: IClassReloads;
    public reloadTasks: IClassReloadTasks;
    public roles: IClassRoles;
    public transports: IClassTransports;
    public users: IClassUsers;
    public webHooks: IClassWebHooks;
    public oauthTokens: IClassOAuthTokens;
    public collections: IClassCollections;
    public identityProviders: IClassIdentityProviders;
    public tenants: IClassTenants;
    public webIntegrations: IClassWebIntegrations;
    public notifications: IClassNotifications;

    constructor(public saasConfig: any) {
      this.saasClient = new QlikSaaSClient(saasConfig);

      this.apps = new Apps(this.saasClient);
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
      this.transports = new Transports(this.saasClient);
      this.users = new Users(this.saasClient);
      this.webHooks = new WebHooks(this.saasClient);
      this.oauthTokens = new OAuthTokens(this.saasClient);
      this.collections = new Collections(this.saasClient);
      this.identityProviders = new IdentityProviders(this.saasClient);
      this.tenants = new Tenants(this.saasClient);
      this.webIntegrations = new WebIntegrations(this.saasClient);
      this.notifications = new Notifications(this.saasClient);
    }
  }
}
