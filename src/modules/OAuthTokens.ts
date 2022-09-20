import { QlikSaaSClient } from "qlik-rest-api";
import { IOAuthToken, OAuthToken } from "./OAuthToken";

export interface IClassOAuthTokens {
  getAll(): Promise<OAuthToken[]>;
}

export class OAuthTokens implements IClassOAuthTokens {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  // TODO: 400 when called?
  async getAll() {
    return await this.saasClient
      .Get<IOAuthToken[]>(`oauth-tokens`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new OAuthToken(this.saasClient, t.id, t))
      );
  }
}
