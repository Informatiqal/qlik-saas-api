import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { IGroup, Group } from "./Group";

export interface IGroupSettings {
  link: {
    self: {
      href: string;
    };
    tenantId: string;
    syncIdpGroups: boolean;
    autoCreateGroups: boolean;
  };
}

export interface IGroupSettingsUpdate {
  path: "autoCreateGroups" | "syncIdpGroups";
  value: boolean;
}

export interface IClassGroups {
  get(id: string): Promise<Group>;
  getFilter(filter: string, sort?: string): Promise<Group[]>;
  getAll(): Promise<Group[]>;
  getSettings(): Promise<IGroupSettings>;
  updateSettings(arg: IGroupSettingsUpdate[]): Promise<number>;
}

export class Groups implements IClassGroups {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`groups.get: "id" parameter is required`);

    const group: Group = new Group(this.saasClient, id);
    await group.init();

    return group;
  }

  async getFilter(filter: string, sort?: string) {
    const urlBuild = new URLBuild(`groups/actions/filter`);
    urlBuild.addParam("NoData", sort);

    if (!filter)
      throw new Error(`groups.getFilter: "filter" parameter is required`);

    return await this.saasClient
      .Post<IGroup[]>(urlBuild.getUrl(), { filter })
      .then((res) => res.data)
      .then((data) => data.map((t) => new Group(this.saasClient, t.id, t)));
  }

  async getAll() {
    return await this.saasClient
      .Get<IGroup[]>(`groups`)
      .then((res) => res.data)
      .then((data) => data.map((t) => new Group(this.saasClient, t.id, t)));
  }

  async getSettings() {
    return await this.saasClient
      .Get<IGroupSettings>(`groups/settings`)
      .then((res) => res.data);
  }

  async updateSettings(arg: IGroupSettingsUpdate[]) {
    if (!arg)
      throw new Error(
        `groups.updateSettings: at least one update setting is required`
      );
    if (arg.length == 0)
      throw new Error(
        `groups.updateSettings: at least one update setting is required`
      );

    return await this.saasClient
      .Patch(
        `groups/settings`,
        arg.map((a) => ({
          op: "replace",
          path: `/${a.path}`,
          value: a.value,
        }))
      )
      .then((res) => res.status);
  }
}
