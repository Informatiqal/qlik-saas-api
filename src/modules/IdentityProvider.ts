import { QlikSaaSClient } from "qlik-rest-api";

export interface IIdentityProvider {
  id: string;
}
export class IdentityProvider {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IIdentityProvider;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IIdentityProvider
  ) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as IIdentityProvider);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init() {
    if (!this.details || Object.keys(this.details).length == 0) {
      this.details = await this.#saasClient
        .Get<IIdentityProvider>(`identity-providers/${this.#id}`)
        .then((res) => res.data);
    }
  }

  // async remove() {
  //   return await this.#saasClient
  //     .Delete(`identity-providers/${this.#id}`)
  //     .then((res) => res.status);
  // }
}
