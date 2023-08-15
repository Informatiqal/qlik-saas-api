import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";

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
      .Get(`quotas/${arg.id}`)
      .then((res) => res.data as IQuotas);
  }

  async getAll() {
    const urlBuild = new URLBuild("quotas");
    urlBuild.addParam("reportUsage", "true");

    return await this.saasClient
      .Get(urlBuild.getUrl())
      .then((res) => res.data as IQuotas[]);
  }
}
