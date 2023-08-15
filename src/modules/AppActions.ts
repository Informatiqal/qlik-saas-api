import { QlikSaaSClient } from "qlik-rest-api";
import { Reloads } from "./Reloads";
import { IReloadTaskCreate } from "./ReloadTask.interfaces";
import { ReloadTasks } from "./ReloadTasks";
import { AppObject } from "./Apps.interfaces";

export class AppActions {
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

  /**
   * Create scheduled reload task for the app
   */
  async createReloadTask(arg: Omit<IReloadTaskCreate, "appId">) {
    await this.reloadTasks.create({
      appId: this.id,
      ...arg,
    });
    return true;
  }

  /**
   * Get list of all scheduled reloads for the app
   */
  async getReloadTasks() {
    return await this.reloadTasks
      .getAll()
      .then((allTasks) => allTasks.filter((r) => r.details.appId == this.id));
  }

  /**
   * Reloads the app
   */
  async reload(arg?: { partial: boolean }) {
    if (arg && !arg.partial)
      throw new Error(
        `app.reload: argument object is passed but "partial" property is missing`
      );

    return await this.appReload.start({
      appId: this.id,
      partial: arg?.partial || false,
    });
  }

  async changeObjectOwner(arg: { objectId: string; ownerId: string }) {
    if (!arg.objectId)
      throw new Error(
        `app.changeObjectOwner: "objectId" parameter is required`
      );

    if (!arg.ownerId)
      throw new Error(`app.changeObjectOwner: "ownerId" parameter is required`);

    return this.saasClient.Post<AppObject>(
      `apps/${this.id}/objects/${arg.objectId}/actions/change-owner`,
      { ownerId: arg.ownerId }
    );
  }
}
