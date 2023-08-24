import { QlikSaaSClient } from "qlik-rest-api";
import { APIKey, IAPIKey } from "./APIKey";
import { parseFilter } from "../util/filter";

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

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`apiKeys.get: "id" parameter is required`);
    const apiKey: APIKey = new APIKey(this.saasClient, arg.id);
    await apiKey.init();

    return apiKey;
  }

  async getAll() {
    return await this.saasClient
      .Get<IAPIKey[]>(`api-keys?limit=50`)
      .then((res) => res.data)
      .then((data) => data.map((t) => new APIKey(this.saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`apiKeys.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as APIKey[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`apiKeys.removeFilter: "filter" parameter is required`);

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async create(arg: IAPIKeyCreate) {
    if (!arg.description)
      throw new Error(`apiKeys.create: "description" parameter is required`);

    return await this.saasClient
      .Post<IAPIKey>(`api-keys`, arg)
      .then((res) => new APIKey(this.saasClient, res.data.id, res.data));
  }

  async configs(arg: { tenantId: string }) {
    if (!arg.tenantId)
      throw new Error(`apiKeys.configs: "tenantId" parameter is required`);

    return await this.saasClient
      .Get<IAPIKeysConfigs>(`api-keys/configs/${arg.tenantId}`)
      .then((res) => res.data);
  }

  async configsUpdate(arg: {
    tenantId: string;
    config: IAPIKeysConfigsUpdate[];
  }) {
    if (!arg.tenantId)
      throw new Error(`apiKeys.configs: "tenantId" parameter is required`);

    if (!arg.config)
      throw new Error(`apiKeys.configs: "config" parameter is required`);

    const data = arg.config.map((a) => ({
      op: "replace",
      path: `/${a.path}`,
      value: a.value,
    }));

    return await this.saasClient
      .Patch(`api-keys/configs/${arg.tenantId}`, data)
      .then((res) => res.status);
  }
}
