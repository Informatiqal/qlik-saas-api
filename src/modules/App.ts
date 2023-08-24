import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import {
  IItem,
  IAppAttributes,
  IAppCopy,
  IAppDataLineage,
  IAppMetaData,
  IAppPublish,
  IAppRePublish,
  IAppUpdate,
  IScriptLogMeta,
  IScriptMeta,
  IScriptVersion,
  IApp,
} from "./Apps.interfaces";
import { Media, IAppMedia } from "./AppMedia";
import { AppEvaluations } from "./AppEvaluations";
import { AppActions } from "./AppActions";
import { AppScript } from "./AppScript";

export class App {
  private id: string;
  private saasClient: QlikSaaSClient;
  evaluations: AppEvaluations;
  /**
   * Set of actions that are associated with the apps but are not part of the /apps API endpoints
   * Such actions are:
   * - reload - reloads an app. Originally part of /reloads endpoints
   * - createReloadTask - create scheduled reload task. Originally part of /reload-tasks endpoints
   */
  _actions: AppActions;
  details: IItem;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IItem) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as IItem);
    this.id = id;
    this.saasClient = saasClient;
    this.evaluations = new AppEvaluations(this.saasClient, this.id);
    this._actions = new AppActions(this.saasClient, this.id);
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<IItem>(`items?resourceType=app&resourceId=${this.id}`)
        .then((res) => res.data);
    }
  }

  async copy(arg: IAppCopy) {
    if (!arg.name) throw new Error(`app.copy: "name" parameter is required`);

    return await this.saasClient
      .Post<IItem>(`apps/${this.id}/copy`, arg)
      .then((res) => new App(this.saasClient, res.data.resourceId, res.data));
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

  async export(arg?: { noData: boolean }) {
    const urlBuild = new URLBuild(`apps/${this.id}/export`);
    urlBuild.addParam("NoData", arg?.noData);

    const tempContentLocation = await this.saasClient.Post<{
      location: string;
    }>(urlBuild.getUrl(), {}, "application/json", "json", false, true);

    const appContent: Buffer = await this.saasClient
      .Get(
        tempContentLocation.data.location.replace("/api/v1/", ""),
        "",
        "arraybuffer"
      )
      .then((a) => a.data as Buffer);

    return appContent;
  }

  /**
   * IMPORTANT! This method to is to publish apps to **MANAGED** spaces only.
   * For shared spaces please use `addToSpace` method
   */
  async publish(arg: IAppPublish) {
    let data: { [k: string]: any } = {};
    data = {
      spaceId: arg.spaceId,
      attributes: {
        name: arg.appName ?? this.details.name,
        description: arg.description ?? "",
      },
      moveApp: false,
      data: "source",
    };

    if (arg.data) data["data"] = arg.data;
    if (arg.description) data.attributes["description"] = arg.description;
    if (arg.moveApp) data.moveApp = arg.moveApp;
    if (arg.originAppId) data.originalAppId = arg.originAppId;
    if (arg.originAppId && !arg.moveApp)
      throw new Error(
        `apps.publish: If app is moved, originAppId needs to be provided.`
      );

    return await this.saasClient
      .Post<IApp>(`apps/${this.id}/publish`, data)
      .then((res) =>
        this.saasClient.Get<IItem[]>(
          `items?resourceType=app&resourceId=${res.data.attributes.id}`
        )
      )
      .then(
        (items) =>
          new App(this.saasClient, items.data[0].resourceId, items.data[0])
      );
  }

  /**
   * IMPORTANT! This method to is to re-publish apps to **MANAGED** spaces only.
   * For shared spaces please use `addToSpace` method
   */
  async rePublish(arg: IAppRePublish) {
    let data: { [k: string]: any } = {};
    data = {
      targetId: arg.targetId,
      data: "source",
      attributes: {
        name: arg.appName,
        description: arg.description ?? "",
      },
      checkOriginAppId: true,
    };
    if (arg.data) data["data"] = arg.data;
    if (arg.description) data.attributes["description"] = arg.description;
    if (arg.checkOriginAppId) data["checkOriginAppId"] = arg.checkOriginAppId;

    return await this.saasClient
      .Put<IApp>(`apps/${this.id}/publish`, data)
      .then((res) =>
        this.saasClient.Get<IItem[]>(
          `items?resourceType=app&resourceId=${res.data.attributes.id}`
        )
      )
      .then(
        (items) =>
          new App(this.saasClient, items.data[0].resourceId, items.data[0])
      );
  }

  // REVIEW: the name?
  async addToSpace(arg: { spaceId: string }) {
    if (!arg.spaceId)
      throw new Error(`app.addToSpace: "spaceId" parameter is required`);

    return await this.saasClient
      .Put<IApp>(`apps/${this.id}/space`, { spaceId: arg.spaceId })
      .then((res) =>
        this.saasClient.Get<IItem[]>(
          `items?resourceType=app&resourceId=${res.data.attributes.id}`
        )
      )
      .then((res) => {
        this.details = res.data[0];
        return res.status;
      });
  }

  // REVIEW: the name?
  async removeFromSpace() {
    return await this.saasClient
      .Delete(`apps/${this.id}/space`)
      .then((res) =>
        this.saasClient.Get<IItem[]>(
          `items?resourceType=app&resourceId=${this.id}`
        )
      )
      .then((res) => {
        this.details = res.data[0];
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
      .Put<{ attributes: IAppAttributes }>(`apps/${this.id}`, {
        attributes: arg,
      })
      .then(() =>
        this.saasClient.Get<IItem>(
          `items?resourceType=app&resourceId=${this.id}`
        )
      )
      .then((res) => {
        this.details = res.data;
        return this.details;
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

  async addMedia(arg: { content: Buffer; fileName: string }) {
    if (!arg.content)
      throw new Error(`app.addMedia: "content" parameter is required`);
    if (!arg.fileName)
      throw new Error(`app.addMedia: "fileName" parameter is required`);

    return await this.saasClient
      .Put<IAppMedia>(
        `apps/${this.id}/media/files/${arg.fileName}`,
        arg.content,
        "application/octet-stream"
      )
      .then((res) => new Media(this.saasClient, res.data.id, res.data));
  }

  /**
  //  * List of all script versions
  //  *
  //  * To reduce the number of API calls the actual script content is initially left empty
  //  * Call `getScriptContent()` for each version.
  //  *
  //  * Rate limit: Tier 1 (600 requests per minute)
  //  */
  async scriptVersions() {
    return await this.saasClient
      .Get<{ scripts: IScriptMeta[] }>(`apps/${this.id}/scripts`)
      .then((res) => res.data)
      .then((data) => {
        return data.scripts.map(
          (t) =>
            new AppScript(this.saasClient, t.scriptId, this.id, {
              ...t,
              script: "",
            })
        );
      });
  }

  /**
   * Get all details (including the script) for a specific script version
   *
   * Rate limit: Tier 1 (600 requests per minute)
   */
  async scriptVersion(arg: { versionId: string }) {
    if (!arg.versionId)
      throw new Error(`app.scriptVersions: "versionId" parameter is required`);

    const scriptVersion = new AppScript(
      this.saasClient,
      arg.versionId,
      this.id
    );
    await scriptVersion.init();
    await scriptVersion.getScriptContent();

    return scriptVersion;
  }

  /**
   * Set the app script and create new script version
   *
   * Rate limit: Tier 2 (60 requests per minute)
   */
  async setScript(arg: IScriptVersion) {
    return await this.saasClient
      .Post(`apps/${this.id}/scripts`, arg)
      .then((res) => res.status);
  }

  /**
  //  * List of reload logs (actual log is not included)
  //  */
  async reloadLogs() {
    return this.saasClient
      .Get<IScriptLogMeta[]>(`apps/${this.id}/reloads/logs`)
      .then((res) => res.data);
  }

  /**
   * Returns the reload log content for the specified reloadId
   */
  async reloadLogContent(arg: { reloadId: string }) {
    if (!arg.reloadId)
      throw new Error(`app.reloadLogContent: "reloadId" parameter is required`);

    return this.saasClient
      .Get<string>(`apps/${this.id}/reloads/logs/${arg.reloadId}`)
      .then((res) => res.data);
  }
}
