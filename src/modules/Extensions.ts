import { QlikSaaSClient } from "qlik-rest-api";
import { Extension, IExtension } from "./Extension";
import { parseFilter } from "../util/filter";

//TODO: import extension method
export class Extensions {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`extensions.get: "id" parameter is required`);
    const extension: Extension = new Extension(this.saasClient, arg.id);
    await extension.init();

    return extension;
  }

  async getAll() {
    return await this.saasClient
      .Get(`extensions`)
      .then((res) => res.data as IExtension[])
      .then((data) => data.map((t) => new Extension(this.saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `extensions.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }  
}
