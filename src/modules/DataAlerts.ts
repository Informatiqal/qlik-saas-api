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
import { parseFilter } from "../util/filter";

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

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`dataAlerts.get: "id" parameter is required`);

    const da: DataAlert = new DataAlert(this.saasClient, arg.id);
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

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`dataAlerts.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }

  async create(arg: IDataAlertCreate) {
    return await this.saasClient
      .Post("data-alerts", { ...arg })
      .then((res) => res.data as IDataAlert);
  }

  async triggerAction(arg: { alertingTaskId: string }) {
    if (!arg.alertingTaskId)
      throw new Error(
        `dataAlert.triggerAction: "alertingTaskId" parameter is required`
      );

    return await this.saasClient
      .Post("data-alerts/actions/trigger", {
        alertingTaskID: arg.alertingTaskId,
      })
      .then((res) => res.data as IDataAlertTriggerActionResponse);
  }

  async getSettings() {
    return await this.saasClient
      .Get("data-alerts/settings")
      .then((res) => res.data as IDataAlertSettings);
  }

  async updateSettings(arg: { enableDataAlerting: boolean }) {
    if (!arg.enableDataAlerting)
      throw new Error(
        `dataAlert.updateSettings: "enableDataAlerting" parameter is required`
      );

    return await this.saasClient
      .Put("data-alerts/settings", {
        "enable-data-alerting": arg.enableDataAlerting,
      })
      .then((res) => res.status);
  }

  async getTaskIdStats(arg: { taskId: string }) {
    if (!arg.taskId)
      throw new Error(
        `dataAlert.getTaskIdStats: "taskId" parameter is required`
      );

    return await this.saasClient
      .Get(`data-alerts/${arg.taskId}/stats`)
      .then((res) => res.data as IDataAlertExecutionStatsAggregatedResponse);
  }

  async getTaskIdExecutions(arg: {
    taskId: string;
    filter?: IGetTaskExecutionsFilter;
  }) {
    if (!arg.taskId)
      throw new Error(
        `dataAlert.getTaskIdExecutions: "taskId" parameter is required`
      );

    const urlBuild = new URLBuild(`data-alerts/${arg.taskId}/executions`);

    if (arg.filter) {
      urlBuild.addParam("conditionId", arg.filter.conditionId);
      urlBuild.addParam("conditionStatus", arg.filter.conditionStatus);
      urlBuild.addParam("daysOfMonth", arg.filter.daysOfMonth);
      urlBuild.addParam("daysOfWeek", arg.filter.daysOfWeek);
      urlBuild.addParam("fields", arg.filter.fields);
      urlBuild.addParam("includeEvaluation", arg.filter.includeEvaluation);
      urlBuild.addParam("lastEachDay", arg.filter.lastEachDay);
      urlBuild.addParam("limit", arg.filter.limit);
      urlBuild.addParam("minimumGapDays", arg.filter.minimumGapDays);
      urlBuild.addParam("next", arg.filter.next);
      urlBuild.addParam("offset", arg.filter.offset);
      urlBuild.addParam("prev", arg.filter.prev);
      urlBuild.addParam("searchResultsLimit", arg.filter.searchResultsLimit);
      urlBuild.addParam("since", arg.filter.since);
      urlBuild.addParam("sort", arg.filter.sort);
      urlBuild.addParam("timezone", arg.filter.timezone);
      urlBuild.addParam("triggered", arg.filter.triggered);
      urlBuild.addParam("until", arg.filter.until);
    }

    return await this.saasClient
      .Get(urlBuild.getUrl())
      .then((res) => res.data as IDataAlertExecutionStatsAggregatedResponse);
  }

  async getTaskIdExecutionsStats(arg: { taskId: string; period: string }) {
    if (!arg.taskId)
      throw new Error(
        `dataAlert.getTaskIdExecutionsStats: "taskId" parameter is required`
      );

    if (!arg.period)
      throw new Error(
        `dataAlert.getTaskIdExecutionsStats: "period" parameter is required`
      );

    return await this.saasClient
      .Get(`data-alerts/${arg.taskId}/executions?period=${arg.period}`)
      .then((res) => res.data as IDataAlertTaskExecutionStatsResponse);
  }

  async getTaskIdExecutionIdEvaluation(arg: {
    taskId: string;
    executionId: string;
  }) {
    if (!arg.taskId)
      throw new Error(
        `dataAlert.getTaskIdExecutionIdEvaluation: "taskId" parameter is required`
      );

    if (!arg.executionId)
      throw new Error(
        `dataAlert.getTaskIdExecutionIdEvaluation: "executionId" parameter is required`
      );

    return await this.saasClient
      .Get(
        `data-alerts/${arg.taskId}/executions/${arg.executionId}/evaluations`
      )
      .then((res) => res.data as IDataAlertEvaluationGetResponse);
  }

  async validateActions(arg: IDataAlertCreate) {
    return await this.saasClient
      .Post(`data-alerts/actions/validate`, { ...arg })
      .then((res) => res.data as IDataAlertValidateActionsResponse);
  }
}
