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

//TODO: whats the difference between the PUT and the PATCH methods
export class DataCredential {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IDataCredential;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IDataCredential
  ) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as IDataCredential);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init(arg?: { force: true }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.saasClient
        .Get<IDataCredential>(`data-credentials/${this.id}`)
        .then((res) => res.data);
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

    let updateStatus = 0;

    return await this.saasClient
      .Put(`data-credentials/${this.id}`, arg)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
