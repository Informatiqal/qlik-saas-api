import { QlikSaaSClient } from "qlik-rest-api";
import { IReload, Reload } from "./Reload";
import { parseFilter } from "../util/filter";

export class Reloads {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`reloads.get: "id" parameter is required`);
    const reload: Reload = new Reload(this.saasClient, arg.id);
    await reload.init();

    return reload;
  }

  async getAll() {
    return await this.saasClient
      .Get<IReload[]>(`reloads`)
      .then((res) => res.data)
      .then((data) => data.map((t) => new Reload(this.saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`reloads.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as Reload[];
    });
  }

  async start(arg: { appId: string; partial?: boolean }) {
    if (!arg.appId)
      throw new Error(`reloads.start: "appId" parameter is required`);

    return await this.saasClient
      .Post<IReload>(`reloads`, { appId: arg.appId, partial: arg.partial })
      .then((res) => new Reload(this.saasClient, res.data.id, res.data));
  }
}
