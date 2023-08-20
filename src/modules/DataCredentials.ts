import { QlikSaaSClient } from "qlik-rest-api";
import { DataCredential, IDataCredential } from "./DataCredential";
import { parseFilter } from "../util/filter";

export class DataCredentials {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(`dataCredentials.get: "id" parameter is required`);
    const dataCredential: DataCredential = new DataCredential(
      this.saasClient,
      arg.id
    );
    await dataCredential.init();

    return dataCredential;
  }

  async getAll() {
    return await this.saasClient
      .Get(`data-credentials`)
      .then((res) => res.data as IDataCredential[])
      .then((data) =>
        data.map((t) => new DataCredential(this.saasClient, t.qID, t))
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `dataCredentials.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `dataCredentials.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }
}
