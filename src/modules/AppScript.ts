import { QlikSaaSClient } from "qlik-rest-api";
import { IScriptMeta, IScriptMetaWithScript } from "./Apps.interfaces";

export class AppScript {
  #id: string;
  private appId: string;
  #saasClient: QlikSaaSClient;
  details: IScriptMetaWithScript;
  constructor(
    saasClient: QlikSaaSClient,
    versionId: string,
    appId: string,
    details?: IScriptMetaWithScript
  ) {
    if (!versionId) throw new Error(`"versionId" parameter is required`);

    this.details = details ?? ({} as IScriptMetaWithScript);
    this.#id = versionId;
    this.appId = appId;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (!this.details || arg?.force == true) {
      this.details = await this.#saasClient
        .Get<IScriptMetaWithScript>(
          `apps/${this.appId}/scripts?filter=ScriptId eq "${this.#id}"`
        )
        .then((res) => ({ ...res.data, script: "" }));
    }
  }

  async getScriptContent() {
    this.details.script = await this.#saasClient
      .Get<string>(`apps/${this.appId}/scripts/${this.#id}`)
      .then((res) => res.data);

    return this.details.script;
  }

  async remove() {
    return await this.#saasClient
      .Delete(`apps/${this.appId}/scripts/${this.#id}`)
      .then((res) => res.status);
  }

  /**
   * Not very clear from the documentation what can be done here
   *
   * The UI allows only the name of the version (`versionMessage` ) to be updated.
   * And because of this, this method only updates the name as well
   */
  async update(arg: { name: string }) {
    const updateStatus = await this.#saasClient
      .Patch(`apps/${this.appId}/scripts/${this.#id}`, [
        {
          op: "replace",
          path: "/versionMessage",
          value: arg.name,
        },
      ])
      .then((res) => res.status);

    await this.init({ force: true });

    return updateStatus;
  }
}
