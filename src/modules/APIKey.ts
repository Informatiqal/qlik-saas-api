import { QlikSaaSClient } from "qlik-rest-api";

export interface IAPIKey {
  id: string;
  tenantId: string;
  description: string;
  sub: string;
  subType: string;
  status: string;
  expiry: string;
  createdByUser: string;
  created: string;
  lastUpdated: string;
}

export class APIKey {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IAPIKey;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IAPIKey) {
    if (!id) throw new Error(`apiKeys.get: "id" parameter is required`);

    this.details = details ?? ({} as IAPIKey);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init(arg?: { force: true }) {
    if (Object.keys(this.details).length == 0 || arg?.force == true) {
      this.details = await this.saasClient
        .Get<IAPIKey>(`api-keys/${this.id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`api-keys/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: { description: string }) {
    if (!arg.description)
      throw new Error(`apiKey.update: "description" parameter is required`);

    const data = {
      op: "replace",
      path: `/description`,
      value: arg.description,
    };

    let updateStatus = 0;
    return await this.saasClient
      .Patch(`api-keys/${this.id}`, data)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
