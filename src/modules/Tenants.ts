import { QlikSaaSClient } from "qlik-rest-api";
import { IClassTenant, ITenant, Tenant } from "./Tenant";

export interface ITenantCreationRequest {
  name: string;
  hostname: string[];
  licenseKey: string;
}

export interface IClassTenants {
  create(arg: ITenantCreationRequest): Promise<IClassTenant>;
}

export class Tenants implements IClassTenants {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async create(arg: ITenantCreationRequest) {
    if (!arg.name)
      throw new Error(`tenants.create: "name" parameter is required`);
    if (!arg.hostname)
      throw new Error(`tenants.create: "hostname" parameter is required`);
    if (!arg.licenseKey)
      throw new Error(`tenants.create: "licenseKey" parameter is required`);

    return this.saasClient
      .Post("tenants", arg)
      .then(
        (res) =>
          new Tenant(
            this.saasClient,
            (res.data as ITenant).id,
            res.data as ITenant
          )
      );
  }
}
