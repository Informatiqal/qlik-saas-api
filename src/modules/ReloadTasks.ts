import { QlikSaaSClient } from "qlik-rest-api";
import { ReloadTask } from "./ReloadTask";
import { IReloadTask, IReloadTaskCreate } from "./ReloadTask.interfaces";

export interface IClassReloadTasks {
  get(id: string): Promise<ReloadTask>;
  getAll(): Promise<ReloadTask[]>;
  create(arg: IReloadTaskCreate): Promise<ReloadTask>;
}

export class ReloadTasks implements IClassReloadTasks {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`reloadTasks.get: "id" parameter is required`);
    const rt: ReloadTask = new ReloadTask(this.saasClient, id);
    await rt.init();

    return rt;
  }

  async getAll() {
    return await this.saasClient
      .Get(`reload-tasks`)
      .then((res) => res.data as IReloadTask[])
      .then((data) =>
        data.map((t) => new ReloadTask(this.saasClient, t.id, t))
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

    return await this.saasClient
      .Post<IReloadTask>(`reload-tasks`, arg)
      .then((res) => new ReloadTask(this.saasClient, res.data.id, res.data));
  }
}
