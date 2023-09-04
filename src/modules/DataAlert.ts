import { QlikSaaSClient } from "qlik-rest-api";
import {
  IDataAlert,
  IAlertingConditionResponse,
  IAlertingRecipientStatsResponse,
  IAlertingExecutionResponse,
  IDataAlertUpdate,
} from "./DataAlerts.interfaces";

export class DataAlert {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IDataAlert;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IDataAlert) {
    if (!id) throw new Error(`dataAlert.get: "id" parameter is required`);

    this.details = details ?? ({} as IDataAlert);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init() {
    if (!this.details || Object.keys(this.details).length == 0) {
      this.details = await this.#saasClient
        .Get<IDataAlert>(`data-alerts/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`data-alerts/${this.#id}`)
      .then((res) => res.status);
  }

  async update(arg: IDataAlertUpdate[]) {
    return await this.#saasClient
      .Patch(
        `data-alerts/${this.#id}`,
        arg.map((a) => ({
          op: "replace",
          path: `/${a.path}`,
          value: a.value,
        }))
      )
      .then((res) => res.status);
  }

  async getConditions() {
    return await this.#saasClient
      .Get<IAlertingConditionResponse>(`data-alerts/${this.#id}/condition`)
      .then((res) => res.data);
  }

  async getRecipientStats() {
    return await this.#saasClient
      .Get<IAlertingRecipientStatsResponse>(
        `data-alerts/${this.#id}/recipient-stats`
      )
      .then((res) => res.data);
  }

  async getExecution(arg: { executionId: string }) {
    if (!arg.executionId)
      throw new Error(
        `dataAlert.getExecution: "executionId" parameter is required`
      );

    return await this.#saasClient
      .Get<IAlertingExecutionResponse>(
        `/data-alerts/${this.#id}/executions/${arg.executionId}`
      )
      .then((res) => res.data);
  }

  async removeExecution(arg: { executionId: string }) {
    if (!arg.executionId)
      throw new Error(
        `dataAlert.removeExecution: "executionId" parameter is required`
      );

    return await this.#saasClient
      .Delete(`/data-alerts/${this.#id}/executions/${arg.executionId}`)
      .then((res) => res.status);
  }
}
