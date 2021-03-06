import { QlikSaaSClient } from "qlik-rest-api";
import {
  DataCredential,
  IClassDataCredential,
  IDataCredential,
} from "./DataCredential";

export interface IClassDataCredentials {
  get(id: string): Promise<IClassDataCredential>;
  getAll(): Promise<IClassDataCredential[]>;
}

export class DataCredentials implements IClassDataCredentials {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`dataCredentials.get: "id" parameter is required`);
    const dataCredential: DataCredential = new DataCredential(
      this.saasClient,
      id
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
