import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { DataAlert } from "./DataAlert";
import {
  IDataAlert,
  IDataAlertCreate,
  IDataAlertEvaluationGetResponse,
  IDataAlertExecutionStatsAggregatedResponse,
  IDataAlertSettings,
  IDataAlertTaskExecutionStatsResponse,
  IDataAlertTriggerActionResponse,
  IDataAlertValidateActionsResponse,
} from "./DataAlerts.interfaces";

export type TDaysOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type TFields =
  | "evaluationId"
  | "triggerTime"
  | "conditionStatus"
  | "executionEvaluationStatus"
  | "evaluation"
  | "evaluation.endTime"
  | "evaluation.resultData"
  | "evaluation.resultData.count"
  | "evaluation.resultData.headers"
  | "evaluation.resultData.positive"
  | "evaluation.resultData.negative"
  | "evaluation.resultData.dimensions"
  | "evaluation.resultData.measures";

export interface IGetTaskExecutionsFilter {
  conditionId?: string;
  conditionStatus?: "FINISHED" | "FAILED" | "ALL";
  daysOfMonth?: number[];
  daysOfWeek?: TDaysOfWeek[];
  fields?: TFields[];
  includeEvaluation?: boolean;
  lastEachDay?: boolean;
  limit?: number;
  minimumGapDays?: number;
  next?: string;
  offset?: number;
  prev?: string;
  searchResultsLimit?: number;
  since?: string;
  sort?: "triggertime" | "-triggertime" | "+triggertime";
  timezone?: string;
  triggered?: boolean;
  until?: string;
}

export class DataAlerts {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`dataAlerts.get: "id" parameter is required`);
    const da: DataAlert = new DataAlert(this.saasClient, id);
    await da.init();

    return da;
  }

  // TODO: why is Qlik returning the meaningful data under "tasks" property???
  // https://community.qlik.com/t5/Integration-Extension-APIs/Inconsistencies-in-SaaS-REST-API/m-p/1958356#M17079
  async getAll() {
    return await this.saasClient
      .Get(`data-alerts`)
      .then((res) => res.data as IDataAlert[])
      .then((data: any) => {
        return data.tasks.map((t) => new DataAlert(this.saasClient, t.id, t));
      });
  }

  async create(arg: IDataAlertCreate) {
    return await this.saasClient
      .Post("data-alerts", { ...arg })
      .then((res) => res.data as IDataAlert);
  }

  async triggerAction(alertingTaskId: string) {
    if (!alertingTaskId)
      throw new Error(
        `dataAlert.triggerAction: "alertingTaskId" parameter is required`
      );

    return await this.saasClient
      .Post("data-alerts/actions/trigger", { alertingTaskID: alertingTaskId })
      .then((res) => res.data as IDataAlertTriggerActionResponse);
  }

  async getSettings() {
    return await this.saasClient
      .Get("data-alerts/settings")
      .then((res) => res.data as IDataAlertSettings);
  }

  async updateSettings(enableDataAlerting: boolean) {
    if (!enableDataAlerting)
      throw new Error(
        `dataAlert.updateSettings: "enableDataAlerting" parameter is required`
      );

    return await this.saasClient
      .Put("data-alerts/settings", {
        "enable-data-alerting": enableDataAlerting,
      })
      .then((res) => res.status);
  }

  async getTaskIdStats(taskId: string) {
    if (!taskId)
      throw new Error(
        `dataAlert.getTaskIdStats: "taskId" parameter is required`
      );

    return await this.saasClient
      .Get(`data-alerts/${taskId}/stats`)
      .then((res) => res.data as IDataAlertExecutionStatsAggregatedResponse);
  }

  async getTaskIdExecutions(taskId: string, filter?: IGetTaskExecutionsFilter) {
    if (!taskId)
      throw new Error(
        `dataAlert.getTaskIdExecutions: "taskId" parameter is required`
      );

    const urlBuild = new URLBuild(`data-alerts/${taskId}/executions`);

    if (filter) {
      urlBuild.addParam("conditionId", filter.conditionId);
      urlBuild.addParam("conditionStatus", filter.conditionStatus);
      urlBuild.addParam("daysOfMonth", filter.daysOfMonth);
      urlBuild.addParam("daysOfWeek", filter.daysOfWeek);
      urlBuild.addParam("fields", filter.fields);
      urlBuild.addParam("includeEvaluation", filter.includeEvaluation);
      urlBuild.addParam("lastEachDay", filter.lastEachDay);
      urlBuild.addParam("limit", filter.limit);
      urlBuild.addParam("minimumGapDays", filter.minimumGapDays);
      urlBuild.addParam("next", filter.next);
      urlBuild.addParam("offset", filter.offset);
      urlBuild.addParam("prev", filter.prev);
      urlBuild.addParam("searchResultsLimit", filter.searchResultsLimit);
      urlBuild.addParam("since", filter.since);
      urlBuild.addParam("sort", filter.sort);
      urlBuild.addParam("timezone", filter.timezone);
      urlBuild.addParam("triggered", filter.triggered);
      urlBuild.addParam("until", filter.until);
    }

    return await this.saasClient
      .Get(urlBuild.getUrl())
      .then((res) => res.data as IDataAlertExecutionStatsAggregatedResponse);
  }

  async getTaskIdExecutionsStats(taskId: string, period: string) {
    if (!taskId)
      throw new Error(
        `dataAlert.getTaskIdExecutionsStats: "taskId" parameter is required`
      );

    if (!period)
      throw new Error(
        `dataAlert.getTaskIdExecutionsStats: "period" parameter is required`
      );

    return await this.saasClient
      .Get(`data-alerts/${taskId}/executions?period=${period}`)
      .then((res) => res.data as IDataAlertTaskExecutionStatsResponse);
  }

  async getTaskIdExecutionIdEvaluation(taskId: string, executionId: string) {
    if (!taskId)
      throw new Error(
        `dataAlert.getTaskIdExecutionIdEvaluation: "taskId" parameter is required`
      );

    if (!executionId)
      throw new Error(
        `dataAlert.getTaskIdExecutionIdEvaluation: "executionId" parameter is required`
      );

    return await this.saasClient
      .Get(`data-alerts/${taskId}/executions/${executionId}/evaluations`)
      .then((res) => res.data as IDataAlertEvaluationGetResponse);
  }

  async validateActions(arg: IDataAlertCreate) {
    return await this.saasClient
      .Post(`data-alerts/actions/validate`, { ...arg })
      .then((res) => res.data as IDataAlertValidateActionsResponse);
  }
}
