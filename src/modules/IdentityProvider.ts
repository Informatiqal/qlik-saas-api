import { QlikSaaSClient } from "qlik-rest-api";

export interface IIdentityProvider {
  id: string;
}

export interface IClassIdentityProvider {
  details: IIdentityProvider;
  // remove(): Promise<number>;
}

export class IdentityProvider implements IClassIdentityProvider {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IIdentityProvider;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IIdentityProvider
  ) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as IIdentityProvider);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`identity-providers/${this.id}`)
        .then((res) => res.data as IIdentityProvider);
    }
  }

  // async remove() {
  //   return await this.saasClient
  //     .Delete(`identity-providers/${this.id}`)
  //     .then((res) => res.status);
  // }
}
