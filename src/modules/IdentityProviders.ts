import { QlikSaaSClient } from "qlik-rest-api";
import { IdentityProvider, IIdentityProvider } from "./IdentityProvider";
import { parseFilter } from "../util/filter";

// TODO: documentation is incomplete!
export class IdentityProviders {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(`identityProviders.get: "id" parameter is required`);
    const identityProvider: IdentityProvider = new IdentityProvider(
      this.saasClient,
      arg.id
    );
    await identityProvider.init();

    return identityProvider;
  }

  async getAll() {
    return await this.saasClient
      .Get<IIdentityProvider[]>(`identity-providers`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new IdentityProvider(this.saasClient, t.id, t))
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `identityProviders.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as IdentityProvider[];
    });
  }
}
