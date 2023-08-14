import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import {
  IApp,
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
  details: IApp;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IApp) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as IApp);
    this.id = id;
    this.saasClient = saasClient;
    this.evaluations = new AppEvaluations(this.saasClient, this.id);
    this._actions = new AppActions(this.saasClient, this.id);
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`apps/${this.id}`)
        .then((res) => res.data as IApp);
    }
  }

  async copy(arg: IAppCopy) {
    if (!arg.name) throw new Error(`app.copy: "name" parameter is required`);

    return await this.saasClient
      .Post(`apps/${this.id}/copy`, arg)
      .then(
        (res) =>
          new App(
            this.saasClient,
            (res.data as IApp).attributes.id,
            res.data as IApp
          )
      );
  }

  async dataLineage() {
    return await this.saasClient
      .Get(`apps/${this.id}/data/lineage`)
      .then((res) => res.data as IAppDataLineage[]);
  }

  async metaData() {
    return await this.saasClient
      .Get(`apps/${this.id}/data/metadata`)
      .then((res) => res.data as IAppMetaData);
  }

  async export(noData?: boolean) {
    const urlBuild = new URLBuild(`apps/${this.id}/export`);
    urlBuild.addParam("NoData", noData);

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
      .Post(`apps/${this.id}/publish`, { data })
      .then((res) => {
        this.details.attributes = (res.data as IApp).attributes;
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
      .Put(`apps/${this.id}/publish`, { data })
      .then((res) => {
        this.details.attributes = (res.data as IApp).attributes;
        return res.status;
      });
  }

  // REVIEW: the name?
  async addToSpace(spaceId: string) {
    return await this.saasClient
      .Put(`apps/${this.id}/space`, { spaceId })
      .then((res) => {
        this.details.attributes = (res.data as IApp).attributes;
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
      .Put<{ attributes: IAppAttributes }>(`apps/${this.id}`, {
        attributes: { ...arg },
      })
      .then((res) => {
        this.details.attributes = res.data.attributes;
        return res.status;
      })
      .then(async (status) => {
        if (arg.ownerId)
          return await this.saasClient
            .Put<{ attributes: IAppAttributes }>(`apps/${this.id}`, {
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
      .Put(
        `apps/${this.id}/media/files/${fileName}`,
        content,
        "application/octet-stream"
      )
      .then(
        (res) =>
          new Media(
            this.saasClient,
            (res.data as IAppMedia).id,
            res.data as IAppMedia
          )
      );
  }

  /**
   * List of all script versions
   *
   * To reduce the number of API calls the actual script content is initially left empty
   * Call `getScriptContent()` for each version.
   *
   * Rate limit: Tier 1 (600 requests per minute)
   */
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
  async scriptVersion(versionId: string) {
    const scriptVersion = new AppScript(this.saasClient, versionId, this.id);
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
   * List of reload logs (actual log is not included)
   */
  async reloadLogs() {
    return this.saasClient
      .Get<IScriptLogMeta[]>(`apps/${this.id}/reloads/logs`)
      .then((res) => res.data);
  }

  /**
   * Returns the reload log content for the specified reloadId
   */
  async reloadLogContent(reloadId: string) {
    if (!reloadId)
      throw new Error(`app.reloadLogContent: "reloadId" parameter is required`);
    return this.saasClient
      .Get<string>(`apps/${this.id}/reloads/logs/${reloadId}`)
      .then((res) => res.data);
  }
}
