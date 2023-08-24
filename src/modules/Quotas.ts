import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { parseFilter } from "../util/filter";

export interface IQuotas {
  type: string;
  id: string;
  attributes: {
    quota: number;
    unit: string;
    usage: number;
    warningThresholds: number[];
  };
}

type QuotaType =
  | "managed_spaces"
  | "shared_spaces"
  | "app_upload_disk_size"
  | "app_mem_size"
  | string;

export class Quotas {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: QuotaType }) {
    if (!arg.id) throw new Error(`quotas.get: "id" parameter is required`);

    return await this.saasClient
      .Get<IQuotas>(`quotas/${arg.id}`)
      .then((res) => res.data);
  }

  async getAll() {
    const urlBuild = new URLBuild("quotas?limit=50");
    urlBuild.addParam("reportUsage", "true");

    return await this.saasClient
      .Get<IQuotas[]>(urlBuild.getUrl())
      .then((res) => res.data);
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`quotas.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as IQuotas[];
    });
  }
}
