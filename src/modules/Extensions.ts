import { QlikSaaSClient } from "qlik-rest-api";
import { Extension, IClassExtension, IExtension } from "./Extension";

//TODO: import extension method
export interface IClassExtensions {
  get(id: string): Promise<IClassExtension>;
  getAll(): Promise<IClassExtension[]>;
}

export class Extensions implements IClassExtensions {
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
