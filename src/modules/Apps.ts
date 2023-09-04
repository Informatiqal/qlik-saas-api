import { QlikSaaSClient } from "qlik-rest-api";
import { App } from "./App";
import { IAppCreate, IAppImport, IApp } from "./Apps.interfaces";
import { URLBuild } from "../util/UrlBuild";
import { AppEvaluation, IAppEvaluation } from "./AppEvaluation";
import { parseFilter } from "../util/filter";
import { IItem } from "./Item";

export class Apps {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`apps.get: "id" parameter is required`);

    const app: App = new App(this.#saasClient, arg.id);
    await app.init();

    return app;
  }

  async getEvaluation(arg: { id: string }) {
    return await this.#saasClient
      .Get<IAppEvaluation>(`apps/evaluations/${arg.id}`)
      .then((res) => res.data)
      .then(
        (data) =>
          new AppEvaluation(this.#saasClient, (data.id || data.ID) ?? "", data)
      );
  }

  async getAll() {
    return await this.#saasClient
      .Get<IItem[]>(`items?resourceType=app&limit=50`)
      .then((res) => res.data)
      .then((data) => {
        return data.map((t) => new App(this.#saasClient, t.resourceId, t));
      });
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`apps.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as App[];
    });
  }

  async getFilterNative(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`apps.getFilter: "filter" parameter is required`);

    return await this.#saasClient
      .Get<IItem[]>(`items?resourceType=app,qvapp,qlikview&query=${arg.filter}`)
      .then((res) => res.data)
      .then((data) => {
        return data.map((t) => new App(this.#saasClient, t.id, t));
      });
  }

  async removeFilterNative(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`apps.removeFilter: "filter" parameter is required`);

    const apps = await this.getFilter({ filter: arg.filter });

    return Promise.all(
      apps.map((app) =>
        app.remove().then((s) => ({ id: app.details.id, status: s }))
      )
    );
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`apps.removeFilter: "filter" parameter is required`);

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity
            .remove()
            .then((s) => ({ id: entity.details.resourceId, status: s }))
        )
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

    return await this.#saasClient
      .Post<IApp>(urlBuild.getUrl(), arg.file, "application/octet-stream")
      .then((res) =>
        this.#saasClient.Get<IItem[]>(
          `/items?resourceType=app&resourceId=${res.data.attributes.id}`
        )
      )
      .then(
        (res) => new App(this.#saasClient, res.data[0].resourceId, res.data[0])
      );
  }

  async create(arg: IAppCreate) {
    if (!arg.name) throw new Error(`apps.create: "name" parameter is required`);

    return this.#saasClient
      .Post<IApp>("apps", { attributes: arg })
      .then((res) =>
        this.#saasClient.Get<IItem[]>(
          `/items?resourceType=app&resourceId=${res.data.attributes.id}`
        )
      )
      .then(
        (res) => new App(this.#saasClient, res.data[0].resourceId, res.data[0])
      );
  }

  async privileges() {
    return await this.#saasClient
      .Get<{ [key: string]: string }>(`apps/privileges`)
      .then((p) => p.data);
  }
}
