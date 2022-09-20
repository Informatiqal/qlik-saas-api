import { QlikSaaSClient } from "qlik-rest-api";
import { ITenant, Tenant } from "./Tenant";

export interface ITenantCreationRequest {
  name: string;
  hostname: string[];
  licenseKey: string;
}

export interface IClassTenants {
  create(arg: ITenantCreationRequest): Promise<Tenant>;
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
      .Post<ITenant>("tenants", arg)
      .then((res) => new Tenant(this.saasClient, res.data.id, res.data));
  }
}
