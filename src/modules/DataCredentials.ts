import { QlikSaaSClient } from "qlik-rest-api";
import { DataCredential, IDataCredential } from "./DataCredential";

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
}
