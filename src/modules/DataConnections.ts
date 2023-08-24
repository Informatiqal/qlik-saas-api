import { QlikSaaSClient } from "qlik-rest-api";
import { DataConnection, IDataConnection } from "./DataConnection";
import { parseFilter } from "../util/filter";

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

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(`dataConnections.get: "id" parameter is required`);
    const dataConnection: DataConnection = new DataConnection(
      this.saasClient,
      arg.id
    );
    await dataConnection.init();

    return dataConnection;
  }

  async getAll() {
    return await this.saasClient
      .Get<IDataConnection[]>(`data-connections?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new DataConnection(this.saasClient, t.id, t))
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `dataConnections.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as DataConnection[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `dataConnection.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
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
