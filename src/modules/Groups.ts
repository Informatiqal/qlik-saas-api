import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { IGroup, Group } from "./Group";
import { parseFilter } from "../util/filter";

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

export interface IGroupCreate {
  name: string;
  status?: "active";
  assignedRoles: (
    | {
        id: string;
      }
    | { name: string }
  )[];
}

export class Groups {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`groups.get: "id" parameter is required`);

    const group: Group = new Group(this.saasClient, arg.id);
    await group.init();

    return group;
  }

  async getFilterNative(arg: { filter: string; sort?: string }) {
    const urlBuild = new URLBuild(`groups/actions/filter`);
    urlBuild.addParam("NoData", arg.sort);

    if (!arg.filter)
      throw new Error(`groups.getFilter: "filter" parameter is required`);

    return await this.saasClient
      .Post(urlBuild.getUrl(), { filter: arg.filter })
      .then((res) => res.data as IGroup[]);
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `groups.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }

  async getAll() {
    return await this.saasClient
      .Get(`groups`)
      .then((res) => res.data as IGroup[]);
  }

  async getSettings() {
    return await this.saasClient
      .Get(`groups/settings`)
      .then((res) => res.data as IGroupSettings);
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

  async create(arg: IGroupCreate) {
    if (!arg.name)
      throw new Error(`group.create: "name" parameter is required`);
    if (!arg.assignedRoles)
      throw new Error(`group.create: "assignedRoles" parameter is required`);

    return await this.saasClient
      .Post<IGroup>(`groups`, arg)
      .then((res) => new Group(this.saasClient, res.data.id, res.data));
  }
}
