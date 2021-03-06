import { QlikSaaSClient } from "qlik-rest-api";
import { IEntityRemove } from "../types/types";
import { App, IClassApp } from "./App";
import {
  IApp,
  IAppAttributes,
  IAppCreate,
  IAppImport,
} from "./Apps.interfaces";
import { URLBuild } from "../util/UrlBuild";

export interface IClassApps {
  get(id: string): Promise<IClassApp>;
  getAll(): Promise<IClassApp[]>;
  getFilter(filter: string): Promise<IClassApp[]>;
  removeFilter(filter: string): Promise<IEntityRemove[]>;
  import(arg: IAppImport): Promise<IClassApp>;
  create(arg: IAppCreate): Promise<IClassApp>;
  privileges(): Promise<{ [key: string]: string }>;
}

export class Apps implements IClassApps {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`apps.get: "id" parameter is required`);
    const app: App = new App(this.saasClient, id);
    await app.init();

    return app;
  }

  async getAll() {
    return await this.saasClient
      .Get(`items?resourceType=app,qvapp,qlikview`)
      .then((res) => res.data as IAppAttributes[])
      .then((data) => {
        return data.map(
          (t) => new App(this.saasClient, t.id, { attributes: t })
        );
      });
  }

  async getFilter(filter: string) {
    if (!filter)
      throw new Error(`apps.getFilter: "filter" parameter is required`);
    return await this.saasClient
      .Get(`items?resourceType=app,qvapp,qlikview&query=${filter}`)
      .then((res) => res.data as IAppAttributes[])
      .then((data) => {
        return data.map(
          (t) => new App(this.saasClient, t.id, { attributes: t })
        );
      });
  }

  async removeFilter(filter: string) {
    if (!filter)
      throw new Error(`apps.removeFilter: "filter" parameter is required`);

    const apps = await this.getFilter(filter);

    return Promise.all(
      apps.map((app) =>
        app.remove().then((s) => ({ id: app.details.attributes.id, status: s }))
      )
    );
  }

  async import(arg: IAppImport) {
    if (!arg.file) throw new Error(`apps.import: "file" parameter is required`);

    const urlBuild = new URLBuild(`apps/import`);
    urlBuild.addParam("name", arg.name);
    urlBuild.addParam("spaceId", arg.spaceId);
    urlBuild.addParam("mode", arg.mode);
    urlBuild.addParam("mode", arg.appId);
    urlBuild.addParam("fallbackName", arg.fallbackName);

    return await this.saasClient
      .Post(urlBuild.getUrl(), arg.file, "application/octet-stream")
      .then(
        (res) =>
          new App(
            this.saasClient,
            (res.data as IApp).attributes.id,
            res.data as IApp
          )
      );
  }

  async create(arg: IAppCreate) {
    if (!arg.name) throw new Error(`apps.create: "name" parameter is required`);

    return this.saasClient
      .Post("apps", arg)
      .then(
        (a) =>
          new App(
            this.saasClient,
            (a.data as IApp).attributes.id,
            a.data as IApp
          )
      );
  }

  async privileges() {
    return await this.saasClient.Get(`apps/privileges`).then((p) => p.data);
  }
}
