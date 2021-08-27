import { QlikSaaSClient } from "qlik-rest-api";

export interface IDataCredential {
  id: string;
  qID: string;
  qName: string;
  qType: string;
  qReferenceKey: string;
  qConnCount: number;
  links: {
    self: {
      href: string;
    };
  };
}

export interface IDataCredentialUpdate {
  qName?: string;
  qType?: string;
  qUsername?: string;
  qPassword?: string;
  datasourceID: string;
  connectionId: string;
}

export interface IClassDataCredential {
  details: IDataCredential;
  remove(): Promise<number>;
}

//TODO: whats the difference between the PUT and the PATCH methods
export class DataCredential implements IClassDataCredential {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IDataCredential;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IDataCredential
  ) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`data-credentials/${this.id}`)
        .then((res) => res.data as IDataCredential);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`data-credentials/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: IDataCredentialUpdate) {
    let data: { [k: string]: any } = {};
    if (arg.connectionId) data["connectionId"] = arg.connectionId;
    if (arg.datasourceID) data["datasourceID"] = arg.datasourceID;
    if (arg.qName) data["qName"] = arg.qName;
    if (arg.qPassword) data["o"] = arg.qPassword;
    if (arg.qType) data["qType"] = arg.qType;
    if (arg.qUsername) data["qUsername"] = arg.qUsername;

    return await this.saasClient
      .Put(`data-credentials/${this.id}`, arg)
      .then((res) => res.status);
  }
}
