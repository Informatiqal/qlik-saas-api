import { QlikSaaSClient } from "qlik-rest-api";

export interface IOAuthToken {
  tenantId: string;
  userId: string;
  id: string;
  description: string;
  deviceType: string;
  lastUsed: string;
}

export interface IClassOAuthToken {
  details: IOAuthToken;
  remove(): Promise<number>;
}

export class OAuthToken implements IClassOAuthToken {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IOAuthToken;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IOAuthToken) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async remove() {
    return await this.saasClient
      .Delete(`oauth-tokens/${this.id}`)
      .then((res) => res.status);
  }
}
