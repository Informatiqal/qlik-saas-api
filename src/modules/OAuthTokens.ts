import { QlikSaaSClient } from "qlik-rest-api";
import { IOAuthToken, OAuthToken } from "./OAuthToken";
import { parseFilter } from "../util/filter";

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

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`oauthTokens.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }
}
