import { QlikSaaSClient } from "qlik-rest-api";
import { IdentityProvider, IIdentityProvider } from "./IdentityProvider";

// TODO: documentation is incomplete!
export class IdentityProviders {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id)
      throw new Error(`identityProviders.get: "id" parameter is required`);
    const identityProvider: IdentityProvider = new IdentityProvider(
      this.saasClient,
      id
    );
    await identityProvider.init();

    return identityProvider;
  }

  async getAll() {
    return await this.saasClient
      .Get(`identity-providers`)
      .then((res) => res.data as IIdentityProvider[])
      .then((data) =>
        data.map((t) => new IdentityProvider(this.saasClient, t.id, t))
      );
  }
}
