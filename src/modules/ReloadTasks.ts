import { QlikSaaSClient } from "qlik-rest-api";
import { ReloadTask } from "./ReloadTask";
import { IReloadTask, IReloadTaskCreate } from "./ReloadTask.interfaces";
import { parseFilter } from "../util/filter";

export class ReloadTasks {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`reloadTasks.get: "id" parameter is required`);
    const rt: ReloadTask = new ReloadTask(this.#saasClient, arg.id);
    await rt.init();

    return rt;
  }

  async getAll() {
    return await this.#saasClient
      .Get<IReloadTask[]>(`reload-tasks?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new ReloadTask(this.#saasClient, t.id, t))
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`reloadTasks.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as ReloadTask[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `reloadTasks.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async create(arg: IReloadTaskCreate) {
    if (!arg.appId)
      throw new Error(`reloadTasks.create: "appId" parameter is required`);
    if (!arg.recurrence)
      throw new Error(`reloadTasks.create: "recurrence" parameter is required`);
    if (!arg.startDateTime)
      throw new Error(
        `reloadTasks.create: "startDateTime" parameter is required`
      );

    if (!arg.partial) arg["partial"] = false;
    if (!arg.autoReload) arg["autoReload"] = false;
    if (!arg.autoReloadPartial) arg["autoReloadPartial"] = false;
    if (!arg.endDateTime) arg["endDateTime"] = "";
    if (!arg.timeZone) arg["timeZone"] = "Europe/London";
    arg["state"] = "Enabled";
    arg["type"] = "scheduled_reload";

    return await this.#saasClient
      .Post<IReloadTask>(`reload-tasks`, arg)
      .then((res) => new ReloadTask(this.#saasClient, res.data.id, res.data));
  }
}
