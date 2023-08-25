import { QlikSaaSClient } from "qlik-rest-api";

export interface IRun {
  id: string;
  error: object; // ???
  title: string;
  status:
    | "failed"
    | "finished"
    | "finished with warnings"
    | "must stop"
    | "not started"
    | "running"
    | "starting"
    | "stopped";
  context:
    | "test_run"
    | "editor"
    | "detail"
    | "api_sync"
    | "api_async"
    | "webhook"
    | "lookup";
  stopTime: string;
  createdAt: string;
  isTestRun: boolean;
  startTime: string;
  updatedAt: string;
  isArchived: boolean;
  scheduledStartTime: string;
}

export interface IRunExportResponse {
  url: string;
}

export class Run {
  private id: string;
  private automationId: string;
  private saasClient: QlikSaaSClient;
  details: IRun;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    automationId: string,
    details?: IRun
  ) {
    if (!id) throw new Error(`run.get: "id" parameter is required`);

    this.details = details ?? ({} as IRun);
    this.id = id;
    this.saasClient = saasClient;
    this.automationId = automationId;
  }

  // async init() {
  //   if (!this.details || Object.keys(this.details).length == 0) {
  //     this.details = await this.saasClient
  //       .Get<IRun>(`automations/${this.id}`)
  //       .then((res) => res.data);
  //   }
  // }

  async export() {
    return await this.saasClient
      .Post<IRunExportResponse>(
        `automations/automations/${this.automationId}/runs/${this.id}/actions/export`,
        {}
      )
      .then((res) => res.data);
  }

  async retry() {
    return await this.saasClient
      .Post(
        `automations/automations/${this.automationId}/runs/${this.id}/actions/retry`,
        {}
      )
      .then((res) => res.status);
  }

  async stop() {
    return await this.saasClient
      .Post(
        `automations/automations/${this.automationId}/runs/${this.id}/actions/stop`,
        {}
      )
      .then((res) => res.status);
  }
}
