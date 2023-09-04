import { QlikSaaSClient } from "qlik-rest-api";
import { ITenant, Tenant } from "./Tenant";

export interface ITenantCreationRequest {
  name: string;
  hostname: string[];
  licenseKey: string;
}

export class Tenants {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`tenants.get: "id" parameter is required`);
    const tenant: Tenant = new Tenant(this.#saasClient, arg.id);
    await tenant.init();

    return tenant;
  }

  async create(arg: ITenantCreationRequest) {
    if (!arg.name)
      throw new Error(`tenants.create: "name" parameter is required`);
    if (!arg.hostname)
      throw new Error(`tenants.create: "hostname" parameter is required`);
    if (!arg.licenseKey)
      throw new Error(`tenants.create: "licenseKey" parameter is required`);

    return this.#saasClient
      .Post<ITenant>("tenants", arg)
      .then((res) => new Tenant(this.#saasClient, res.data.id, res.data));
  }
}
