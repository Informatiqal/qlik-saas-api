import { QlikSaaSClient } from "qlik-rest-api";

export interface IOAuthToken {
  tenantId: string;
  userId: string;
  id: string;
  description: string;
  deviceType: string;
  lastUsed: string;
}

export class OAuthToken {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IOAuthToken;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IOAuthToken) {
    if (!id) throw new Error(`oauthToken.get: "id" parameter is required`);

    this.details = details ?? ({} as IOAuthToken);
    this.id = id;
    this.saasClient = saasClient;
  }

  async remove() {
    return await this.saasClient
      .Delete(`oauth-tokens/${this.id}`)
      .then((res) => res.status);
  }
}
