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

export interface IClassAPIKey {
  details: IAPIKey;
  remove(): Promise<number>;
  update(description: string): Promise<number>;
}

export class APIKey implements IClassAPIKey {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IAPIKey;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IAPIKey) {
    if (!id) throw new Error(`apiKeys.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`api-keys/${this.id}`)
        .then((res) => res.data as IAPIKey);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`api-keys/${this.id}`)
      .then((res) => res.status);
  }

  async update(description: string) {
    if (!description)
      throw new Error(`apiKey.update: "description" parameter is required`);

    const data = {
      op: "replace",
      path: `/description`,
      value: description,
    };

    return await this.saasClient
      .Patch(`api-keys/${this.id}`, data)
      .then((res) => {
        this.details.description = description;
        return res.status;
      });
  }
}
