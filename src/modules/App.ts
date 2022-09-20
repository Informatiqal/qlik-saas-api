import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import {
  IApp,
  IAppCopy,
  IAppDataLineage,
  IAppMetaData,
  IAppPublish,
  IAppRePublish,
  IAppUpdate,
} from "./Apps.interfaces";
import { Media, IClassMedia, IAppMedia } from "./AppMedia";
import { AppEvaluations } from "./AppEvaluations";
import { AppActions } from "./AppActions";

export interface IClassApp {
  details: IApp;
  dataLineage(): Promise<IAppDataLineage[]>;
  metaData(): Promise<IAppMetaData>;
  remove(): Promise<number>;
  copy(arg: IAppCopy): Promise<App>;
  addToSpace(spaceId: string): Promise<number>;
  removeFromSpace(): Promise<number>;
  export(noData?: boolean): Promise<Buffer>;
  update(arg?: IAppUpdate): Promise<number>;
  thumbnail(): Promise<Buffer>;
  mediaFiles(): Promise<Media[]>;
  addMedia(content: Buffer, fileName: string): Promise<Media>;
  publish(arg: IAppPublish): Promise<number>;
  rePublish(arg: IAppRePublish): Promise<number>;
  evaluations: AppEvaluations;
  /**
   * Set of actions that are associated with the apps but are not part of the /apps API endpoints
   * Such actions are:
   * - reload - reloads an app. Originally part of /reloads endpoints
   * - createReloadTask - create scheduled reload task. Originally part of /reload-tasks endpoints
   */
  _actions: AppActions;
}

export class App implements IClassApp {
  private id: string;
  private saasClient: QlikSaaSClient;
  evaluations: AppEvaluations;
  _actions: AppActions;
  details: IApp;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IApp) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    this.evaluations = new AppEvaluations(this.saasClient, this.id);
    this._actions = new AppActions(this.saasClient, this.id);
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<IApp>(`apps/${this.id}`)
        .then((res) => res.data);
    }
  }

  async copy(arg: IAppCopy) {
    if (!arg.name) throw new Error(`app.copy: "name" parameter is required`);

    return await this.saasClient
      .Post<IApp>(`apps/${this.id}/copy`, arg)
      .then(
        (res) => new App(this.saasClient, res.data.attributes.id, res.data)
      );
  }

  async dataLineage() {
    return await this.saasClient
      .Get<IAppDataLineage[]>(`apps/${this.id}/data/lineage`)
      .then((res) => res.data);
  }

  async metaData() {
    return await this.saasClient
      .Get<IAppMetaData>(`apps/${this.id}/data/metadata`)
      .then((res) => res.data);
  }

  async export(noData?: boolean) {
    const urlBuild = new URLBuild(`apps/${this.id}/export`);
    urlBuild.addParam("NoData", noData);

    const tempContentLocation = await this.saasClient.Post<{
      location: string;
    }>(urlBuild.getUrl(), {}, "application/json", "json", false, true);

    return await this.saasClient
      .Get<Buffer>(
        tempContentLocation.data.location.replace("/api/v1/", ""),
        "",
        "arraybuffer"
      )
      .then((a) => a.data);
  }

  async publish(arg: IAppPublish) {
    let data: { [k: string]: any } = {};
    data = {
      spaceId: arg.spaceId,
      attributes: {
        name: arg.appName,
      },
    };
    if (arg.data) data["data"] = arg.data;
    if (arg.description) data.attributes["description"] = arg.description;

    return await this.saasClient
      .Post<IApp>(`apps/${this.id}/publish`, { data })
      .then((res) => {
        this.details.attributes = res.data.attributes;
        return res.status;
      });
  }

  async rePublish(arg: IAppRePublish) {
    let data: { [k: string]: any } = {};
    data = {
      targetId: arg.targetId,
      attributes: {
        name: arg.appName,
      },
    };
    if (arg.data) data["data"] = arg.data;
    if (arg.description) data.attributes["description"] = arg.description;
    if (arg.checkOriginAppId) data["checkOriginAppId"] = arg.checkOriginAppId;

    return await this.saasClient
      .Put<IApp>(`apps/${this.id}/publish`, { data })
      .then((res) => {
        this.details.attributes = res.data.attributes;
        return res.status;
      });
  }

  // REVIEW: the name?
  async addToSpace(spaceId: string) {
    return await this.saasClient
      .Put<IApp>(`apps/${this.id}/space`, { spaceId })
      .then((res) => {
        this.details.attributes = res.data.attributes;
        return res.status;
      });
  }

  // REVIEW: the name?
  async removeFromSpace() {
    return await this.saasClient.Delete(`apps/${this.id}/space`).then((res) => {
      this.details.attributes = (res.data as any).attributes;
      return res.status;
    });
  }

  async remove() {
    return await this.saasClient
      .Delete(`apps/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: IAppUpdate) {
    if (!arg.name) throw new Error(`app.update: "name" parameter is required`);

    return this.saasClient
      .Put<IApp>(`apps/${this.id}`, { attributes: { ...arg } })
      .then((res) => {
        this.details.attributes = res.data.attributes;
        return res.status;
      })
      .then(async (status) => {
        if (arg.ownerId)
          return await this.saasClient
            .Put<IApp>(`apps/${this.id}`, {
              ownerId: arg.ownerId,
            })
            .then((res) => {
              this.details.attributes = res.data.attributes;
              return res.status;
            });

        return status;
      });
  }

  async thumbnail() {
    return this.saasClient
      .Get<Buffer>(`apps/${this.id}/media/thumbnail`)
      .then((res) => res.data)
      .catch((e) => {
        if (e.message.indexOf("404") > -1)
          throw new Error(`app.thumbnail: thumbnail file is not found`);

        throw new Error(e);
      });
  }

  async mediaFiles() {
    return this.saasClient
      .Get<IAppMedia[]>(`apps/${this.id}/media/list`)
      .then((res) => {
        return res.data.map((m) => new Media(this.saasClient, m.id, m));
      });
  }

  async addMedia(content: Buffer, fileName: string) {
    if (!content)
      throw new Error(`app.addMedia: "content" parameter is required`);
    if (!fileName)
      throw new Error(`app.addMedia: "fileName" parameter is required`);

    return await this.saasClient
      .Put<IAppMedia>(
        `apps/${this.id}/media/files/${fileName}`,
        content,
        "application/octet-stream"
      )
      .then((res) => new Media(this.saasClient, res.data.id, res.data));
  }
}
