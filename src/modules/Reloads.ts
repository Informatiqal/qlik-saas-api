import { QlikSaaSClient } from "qlik-rest-api";
import { IClassReload, IReload, Reload } from "./Reload";

export interface IClassReloads {
  get(id: string): Promise<IClassReload>;
  getAll(): Promise<IClassReload[]>;
  start(appId: string, partial?: boolean): Promise<IClassReload>;
}

export class Reloads implements IClassReloads {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`reloads.get: "id" parameter is required`);
    const reload: Reload = new Reload(this.saasClient, id);
    await reload.init();

    return reload;
  }

  async getAll() {
    return await this.saasClient
      .Get(`reloads`)
      .then((res) => res.data as IReload[])
      .then((data) => data.map((t) => new Reload(this.saasClient, t.id, t)));
  }

  async start(appId: string, partial?: boolean) {
    if (!appId) throw new Error(`reloads.start: "appId" parameter is required`);

    return await this.saasClient
      .Post<IReload>(`reloads`, { appId, partial })
      .then((res) => new Reload(this.saasClient, res.data.id, res.data));
  }
}
