import { QlikSaaSClient } from "qlik-rest-api";
import { Reload } from "./Reload";
import { Reloads } from "./Reloads";
import { ReloadTask } from "./ReloadTask";
import { IReloadTask, IReloadTaskCreate } from "./ReloadTask.interfaces";
import { ReloadTasks } from "./ReloadTasks";

export interface IClassAppActions {
  /**
   * Create scheduled reload task for the app
   */
  createReloadTask(arg: IReloadTask): Promise<boolean>;
  /**
   * Get list of all scheduled reloads for the app
   */
  getReloadTasks(): Promise<ReloadTask[]>;
  /**
   * Reloads the app
   */
  reload(): Promise<Reload>;
}

export class AppActions implements IClassAppActions {
  private id: string;
  private saasClient: QlikSaaSClient;
  private reloadTasks: ReloadTasks;
  private appReload: Reloads;
  constructor(saasClient: QlikSaaSClient, id: string) {
    this.id = id;
    this.saasClient = saasClient;
    this.reloadTasks = new ReloadTasks(this.saasClient);
    this.appReload = new Reloads(this.saasClient);
  }

  async createReloadTask(arg: Omit<IReloadTaskCreate, "appId">) {
    await this.reloadTasks.create({
      appId: this.id,
      ...arg,
    });
    return true;
  }

  async getReloadTasks() {
    return await this.reloadTasks
      .getAll()
      .then((allTasks) => allTasks.filter((r) => r.details.appId == this.id));
  }

  async reload(partial?: boolean) {
    return await this.appReload.start(this.id, partial || false);
  }
}
