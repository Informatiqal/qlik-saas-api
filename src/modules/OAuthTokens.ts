import { QlikSaaSClient } from "qlik-rest-api";
import { IOAuthToken, OAuthToken } from "./OAuthToken";
import { parseFilter } from "../util/filter";

export class OAuthTokens {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  // TODO: 400 when called?
  async getAll() {
    return await this.#saasClient
      .Get<IOAuthToken[]>(`oauth-tokens?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new OAuthToken(this.#saasClient, t.id, t))
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`oauthTokens.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as OAuthToken[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `oauthToken.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }
}
