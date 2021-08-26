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

export interface IClassQuotas {
  get(id: string): Promise<IQuotas>;
  getAll(): Promise<IQuotas[]>;
}

export class Quotas implements IClassQuotas {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: QuotaType) {
    if (!id) throw new Error(`quotas.get: "id" parameter is required`);
    return await this.saasClient
      .Get(`quotas/${id}`)
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
