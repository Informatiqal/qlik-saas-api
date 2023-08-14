import { QlikSaaSClient } from "qlik-rest-api";
import { IOAuthToken, OAuthToken } from "./OAuthToken";

export class OAuthTokens {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  // TODO: 400 when called?
  async getAll() {
    return await this.saasClient
      .Get(`oauth-tokens`)
      .then((res) => res.data as IOAuthToken[])
      .then((data) =>
        data.map((t) => new OAuthToken(this.saasClient, t.id, t))
      );
  }
}
