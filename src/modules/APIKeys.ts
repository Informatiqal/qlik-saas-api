import { QlikSaaSClient } from "qlik-rest-api";
import { APIKey, IAPIKey } from "./APIKey";

export interface IAPIKeyCreate {
  description: string;
  sub?: string;
  subType?: string;
  expiry?: string;
}

export interface IAPIKeysConfigs {
  api_keys_enabled: boolean;
  max_api_key_expiry: string;
  max_keys_per_user: number;
}

export interface IAPIKeysConfigsUpdate {
  path:
    | "api_keys_enabled"
    | "max_api_key_expiry"
    | "max_keys_per_user"
    | string;
  value: boolean | string | number;
}

export class APIKeys {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`apiKeys.get: "id" parameter is required`);
    const apiKey: APIKey = new APIKey(this.saasClient, id);
    await apiKey.init();

    return apiKey;
  }

  async getAll() {
    return await this.saasClient
      .Get(`api-keys`)
      .then((res) => res.data as IAPIKey[])
      .then((data) => data.map((t) => new APIKey(this.saasClient, t.id, t)));
  }

  async create(arg: IAPIKeyCreate) {
    if (!arg.description)
      throw new Error(`apiKeys.create: "description" parameter is required`);

    return await this.saasClient
      .Post<IAPIKey>(`api-keys`, arg)
      .then((res) => new APIKey(this.saasClient, res.data.id, res.data));
  }

  async configs(tenantId: string) {
    if (!tenantId)
      throw new Error(`apiKeys.configs: "tenantId" parameter is required`);

    return await this.saasClient
      .Get(`api-keys/configs/${tenantId}`)
      .then((res) => res.data as IAPIKeysConfigs);
  }

  async configsUpdate(tenantId: string, arg: IAPIKeysConfigsUpdate[]) {
    if (!tenantId)
      throw new Error(`apiKeys.configs: "tenantId" parameter is required`);

    const data = arg.map((a) => ({
      op: "replace",
      path: `/${a.path}`,
      value: a.value,
    }));

    return await this.saasClient
      .Patch(`api-keys/configs/${tenantId}`, data)
      .then((res) => res.status);
  }
}
