import { QlikSaaSClient } from "qlik-rest-api";

export interface IReload {
  id: string;
  appId: string;
  tenantId: string;
  userId: string;
  partial: boolean;
  type: "hub" | "chronos" | "external" | string;
  status: "CREATED" | "QUEUED" | "RELOADING" | "FAILED" | "SUCCEEDED" | string;
  log: string;
  duration: string;
  creationTime: string;
  startTime: string;
  endTime: string;
  engineTime: string;
  links: {
    self: {
      href: string;
    };
  };
}

export interface IClassReload {
  details: IReload;
}

export class Reload implements IClassReload {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IReload;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IReload) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as IReload);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`reloads/${this.id}`)
        .then((res) => res.data as IReload);
    }
  }

  async cancel() {
    return await this.saasClient
      .Post(`reloads/${this.id}/actions/cancel`, {})
      .then((res) => res.status);
  }
}
