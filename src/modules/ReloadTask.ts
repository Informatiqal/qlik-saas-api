import { QlikSaaSClient } from "qlik-rest-api";
import { IReloadTask, IReloadTaskUpdate } from "./ReloadTask.interfaces";

export interface IClassReloadTask {
  details: IReloadTask;
  remove(): Promise<number>;
  update(arg: IReloadTaskUpdate): Promise<number>;
}

export class ReloadTask implements IClassReloadTask {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IReloadTask;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IReloadTask) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`reload-tasks/${this.id}`)
        .then((res) => res.data as IReloadTask);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`reload-tasks/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: IReloadTaskUpdate) {
    arg["appId"] = this.details.appId;

    if (!arg.partial) arg.partial = this.details.partial;
    if (!arg.autoReload) arg.autoReload = this.details.autoReload;
    if (!arg.autoReloadPartial)
      arg.autoReloadPartial = this.details.autoReloadPartial;
    if (!arg.startDateTime) arg.startDateTime = this.details.startDateTime;
    if (!arg.endDateTime) arg.endDateTime = this.details.endDateTime || "";
    if (!arg.timeZone) arg.timeZone = this.details.timeZone || "Europe/London";
    if (!arg.recurrence) arg.recurrence = this.details.recurrence;
    // if (!arg.state) arg.state = this.details.state;

    return await this.saasClient
      .Put(`reload-tasks/${this.id}`, arg)
      .then((res) => {
        this.details = res.data;
        return res.status;
      });
  }
}
