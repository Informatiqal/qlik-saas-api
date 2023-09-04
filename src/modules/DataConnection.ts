import { QlikSaaSClient } from "qlik-rest-api";
import { Privileges } from "../types/types";

export interface IDataConnection {
  id: string;
  qID: string;
  qName: string;
  qConnectStatement: string;
  qType: string;
  qLogOn: number;
  qArchitecture: number;
  qEngineObjectID: string;
  qCredentialsID: string;
  qCredentialsName: string;
  qSeparateCredentials: true;
  qReferenceKey: string;
  qConnectionSecret: string;
  privileges: Privileges[];
  qUsername: string;
  qPassword: string;
  space: string;
  user: string;
  tenant: string;
  created: string;
  updated: string;
  links: {
    self: {
      href: string;
    };
  };
}

export interface IDataConnectionsUpdate {
  qName?: string;
  qConnectStatement?: string;
  qType?: string;
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

//TODO: whats the difference between the PUT and the PATCH methods
export class DataConnection {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IDataConnection;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IDataConnection
  ) {
    if (!id) throw new Error(`dataConnection.get: "id" parameter is required`);

    this.details = details ?? ({} as IDataConnection);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IDataConnection>(`data-connections/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`data-connections/${this.#id}`)
      .then((res) => res.status);
  }

  async update(arg: IDataConnectionsUpdate) {
    if (arg.qName) this.details.qName = arg.qName;
    if (arg.qConnectStatement)
      this.details.qConnectStatement = arg.qConnectStatement;
    if (arg.qType) this.details.qType = arg.qType;
    if (arg.owner) this.details.user = arg.owner;
    if (arg.qLogOn) this.details.qLogOn = arg.qLogOn;
    if (arg.qArchitecture) this.details.qArchitecture = arg.qArchitecture;
    if (arg.qCredentialsID) this.details.qCredentialsID = arg.qCredentialsID;
    if (arg.qCredentialsName)
      this.details.qCredentialsName = arg.qCredentialsName;
    if (arg.qUsername) this.details.qUsername = arg.qUsername;
    if (arg.qPassword) this.details.qPassword = arg.qPassword;
    if (arg.qSeparateCredentials)
      this.details.qSeparateCredentials = arg.qSeparateCredentials;
    if (arg.space) this.details.space = arg.space;
    if (arg.qConnectionSecret)
      this.details.qConnectionSecret = arg.qConnectionSecret;

    let updateStatus = 0;

    return await this.#saasClient
      .Put(`data-connections/${this.#id}`, this.details)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
