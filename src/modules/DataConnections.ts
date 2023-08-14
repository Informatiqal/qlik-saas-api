import { QlikSaaSClient } from "qlik-rest-api";
import { DataConnection, IDataConnection } from "./DataConnection";

export interface IDataConnectionsCreate {
  qName: string;
  qConnectStatement: string;
  qType: string;
  datasourceID?: string;
  owner?: string;
  qID?: string;
  qLogOn?: 0 | 1;
  qEngineObjectID?: string;
  qArchitecture?: 0 | 1;
  qCredentialsID?: string;
  qCredentialsName?: string;
  qUsername?: string;
  qPassword?: string;
  qSeparateCredentials?: boolean;
  space?: string;
  qConnectionSecret?: string;
}

export class DataConnections {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`dataConnections.get: "id" parameter is required`);
    const dataConnection: DataConnection = new DataConnection(
      this.saasClient,
      id
    );
    await dataConnection.init();

    return dataConnection;
  }

  async getAll() {
    return await this.saasClient
      .Get(`data-connections`)
      .then((res) => res.data as IDataConnection[])
      .then((data) =>
        data.map((t) => new DataConnection(this.saasClient, t.id, t))
      );
  }

  async create(arg: IDataConnectionsCreate) {
    if (!arg.qName)
      throw new Error(`dataConnections.create: "qName" parameter is required`);
    if (!arg.qConnectStatement)
      throw new Error(
        `dataConnections.create: "qConnectStatement" parameter is required`
      );
    if (!arg.qType)
      throw new Error(`dataConnections.create: "qType" parameter is required`);

    return await this.saasClient
      .Post<IDataConnection>(`data-connections`, arg)
      .then(
        (res) => new DataConnection(this.saasClient, res.data.id, res.data)
      );
  }
}
