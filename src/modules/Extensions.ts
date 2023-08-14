import { QlikSaaSClient } from "qlik-rest-api";
import { Extension, IExtension } from "./Extension";

//TODO: import extension method
export class Extensions {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`extensions.get: "id" parameter is required`);
    const extension: Extension = new Extension(this.saasClient, id);
    await extension.init();

    return extension;
  }

  async getAll() {
    return await this.saasClient
      .Get(`extensions`)
      .then((res) => res.data as IExtension[])
      .then((data) => data.map((t) => new Extension(this.saasClient, t.id, t)));
  }
}
