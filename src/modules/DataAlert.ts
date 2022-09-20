import { QlikSaaSClient } from "qlik-rest-api";
import {
  IDataAlert,
  IAlertingConditionResponse,
  IAlertingRecipientStatsResponse,
  IAlertingExecutionResponse,
  IDataAlertUpdate,
} from "./DataAlerts.interfaces";

export interface IClassDataAlert {
  details: IDataAlert;
  remove(): Promise<number>;
  getConditions(): Promise<IAlertingConditionResponse>;
  getRecipientStats(): Promise<IAlertingRecipientStatsResponse>;
  getExecution(executionId: string): Promise<IAlertingExecutionResponse>;
  removeExecution(executionId: string): Promise<number>;
  update(arg?: IDataAlertUpdate[]): Promise<number>;
}

export class DataAlert implements IClassDataAlert {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IDataAlert;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IDataAlert) {
    if (!id) throw new Error(`dataAlert.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<IDataAlert>(`data-alerts/${this.id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`data-alerts/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg?: IDataAlertUpdate[]) {
    return await this.saasClient
      .Patch(
        `data-alerts/${this.id}`,
        arg.map((a) => ({
          op: "replace",
          path: `/${a.path}`,
          value: a.value,
        }))
      )
      .then((res) => res.status);
  }

  async getConditions() {
    return await this.saasClient
      .Get<IAlertingConditionResponse>(`data-alerts/${this.id}/condition`)
      .then((res) => res.data);
  }

  async getRecipientStats() {
    return await this.saasClient
      .Get<IAlertingRecipientStatsResponse>(
        `data-alerts/${this.id}/recipient-stats`
      )
      .then((res) => res.data);
  }

  async getExecution(executionId: string) {
    if (!executionId)
      throw new Error(
        `dataAlert.getExecution: "executionId" parameter is required`
      );

    return await this.saasClient
      .Get<IAlertingExecutionResponse>(
        `/data-alerts/${this.id}/executions/${executionId}`
      )
      .then((res) => res.data);
  }

  async removeExecution(executionId: string) {
    if (!executionId)
      throw new Error(
        `dataAlert.removeExecution: "executionId" parameter is required`
      );

    return await this.saasClient
      .Delete(`/data-alerts/${this.id}/executions/${executionId}`)
      .then((res) => res.status);
  }
}
