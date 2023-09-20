import { QlikSaaSClient } from "qlik-rest-api";
import { IReload, Reload } from "./Reload";
import { URLBuild } from "../util/UrlBuild";

export class Reloads {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`reloads.get: "id" parameter is required`);
    const reload: Reload = new Reload(this.#saasClient, arg.id);
    await reload.init();

    return reload;
  }

  async getAll(arg?: { log: boolean }) {
    const urlBuild = new URLBuild(`reloads`);
    urlBuild.addParam("limit", "50");
    urlBuild.addParam("log", `${arg?.log}`);

    const url = urlBuild.getUrl();

    return await this.#saasClient
      .Get<IReload[]>(url)
      .then((res) => res.data)
      .then((data) => data.map((t) => new Reload(this.#saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string; log?: boolean }) {
    if (!arg.filter)
      throw new Error(`reloads.getFilter: "filter" parameter is required`);

    const urlBuild = new URLBuild(`reloads`);
    urlBuild.addParam("limit", 50);
    urlBuild.addParam("filter", arg.filter);
    urlBuild.addParam("log", arg.log);

    const url = urlBuild.getUrl();

    return await this.#saasClient
      .Get<IReload[]>(url)
      .then((res) => res.data)
      .then((data) => data.map((t) => new Reload(this.#saasClient, t.id, t)));
  }

  async start(arg: { appId: string; partial?: boolean }) {
    if (!arg.appId)
      throw new Error(`reloads.start: "appId" parameter is required`);

    return await this.#saasClient
      .Post<IReload>(`reloads`, { appId: arg.appId, partial: arg.partial })
      .then((res) => new Reload(this.#saasClient, res.data.id, res.data));
  }
}
