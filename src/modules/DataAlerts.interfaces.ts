import { ILinks } from "../types/Common";
import { ICollection } from "./Collection";
import { IConditionCreate } from "./Conditions";

export type TDataAlertStatus = "created" | "deleting";
export type TDataAlertAccessMode = "SOURCE_ACCESS" | "TARGET_ACCESS";

export interface ITaskRecipientError {
  value:
    | "USER_IS_DELETED"
    | "USER_DISABLED_IN_QCS"
    | "NO_ACCESS_TO_APP"
    | "UNSUBSCRIBED_FROM_SHARING"
    | "USER_DISABLED_IN_SHARING_BY_OWNER"
    | "CHART_NOT_FOUND"
    | "APP_NOT_FOUND"
    | "SHEET_NOT_FOUND"
    | "ENGINE_POD_NOT_AVAILABLE"
    | "CHART_TYPE_NOT_ALLOWED"
    | "GENERIC_EXECUTION_FAILURE";
  timestamp: string;
}

export interface IAlertingTaskRecipientErrors {
  added: string;
  value:
    | "USER_IS_DELETED"
    | "USER_DISABLED_IN_QCS"
    | "NO_ACCESS_TO_APP"
    | "UNSUBSCRIBED_FROM_ALERT"
    | "CONDITION_EVAL_ERROR"
    | "USER_DISABLED_IN_ALERT_BY_OWNER"
    | "MAX_ALERTS_LIMIT_REACHED";
}

export interface IDataAlertalertingTaskError {
  added: string;
  value:
    | "OWNER_DISABLED"
    | "OWNER_ACCESS"
    | "OWNER_LICENSE"
    | "APP_DELETED"
    | "NO_RECIPIENTS"
    | "PARTIAL_ACCESS"
    | "EVAL_ERROR"
    | "ORPHAN"
    | "CONVERSION_DENIED"
    | "EXPIRED"
    | "PARTIAL_SENT";
}

export interface IUserIDRecipient {
  value: string;
  groups: string[] | null;
  enabled: boolean;
  subscribed: boolean;
  taskRecipientErrors: ITaskRecipientError[] | null;
  alertingTaskRecipientErrors: IAlertingTaskRecipientErrors[];
}

export interface IGroupIDRecipient {
  value: string;
  enabled: boolean;
  taskRecipientErrors: ITaskRecipientError[];
  alertingTaskRecipientErrors: IAlertingTaskRecipientErrors[];
}

export interface IDataAlertRecipients {
  userIds: IUserIDRecipient[];
  groupIds?: IGroupIDRecipient[];
}

export interface IDataAlertThrottlingResource {
  capacity: number;
  timezone: string;
  replenishRate: string;
  recurrenceRule: string;
  initialTokenCount: string;
  referenceTimestamp: string;
}

export interface IDataAlertTriggerStatus {
  totalScans: number;
  last10Scans: number;
  last100Scans: number;
}

export interface IDataAlertScheduleOptions {
  timezone: string;
  recurrence: string[];
  endDateTime: string;
  chronosJobId: string;
  lastExecutionTime: string;
  nextExecutionTime: string;
}

export interface IDataAlertAlertingTaskRecipientPatch_inner {
  op:
    | "add"
    | "remove"
    | "replace"
    | "enable"
    | "disable"
    | "subscribe"
    | "unsubscribe";
  value: {};
  recipientType: "userid" | "groupid";
}

export interface IDataAlertRecipientChange {
  dateTime: string;
  patchAction: IDataAlertAlertingTaskRecipientPatch_inner[];
}

export interface IDataAlert {
  id: string;
  name: string;
  appId: string;
  links: {
    self: {
      href: string;
    };
  };
  status: TDataAlertStatus;
  enabled: boolean;
  ownerId: string;
  sheetId: string;
  lastScan: string;
  tenantId: string;
  ownerName: string;
  accessMode: TDataAlertAccessMode;
  bookmarkId: string;
  recipients: IDataAlertRecipients;
  throttling: IDataAlertThrottlingResource;
  conditionId: string;
  dataCreated: string;
  description: string;
  errorStatus: "OK" | "FATAL-ERROR" | "PARTIAL-TRIGGER";
  lastTrigger: string;
  lastUpdated: string;
  triggerType: "RELOAD" | "SCHEDULED" | "MANUAL";
  triggerStatus: IDataAlertTriggerStatus;
  hideSelection: boolean;
  evaluationCount: number;
  scheduleOptions: IDataAlertScheduleOptions;
  subscriptionIds: string[];
  absoluteScan: string;
  conditionResponse: object;
  alertingTaskError: IDataAlertalertingTaskError[];
  absoluteLastTrigger: string;
  hasHistoryCondition: boolean;
  lastExecutionStatus: "OK" | "FAILED";
  recipientsChangeHistory: IDataAlertRecipientChange[];
  lastEvaluationCountUpdate: string;
}

export interface IDataAlertCreate {
  name: string;
  appId: string;
  enabled?: boolean;
  sheetId?: string;
  bookmarkId: string;
  recipients: IDataAlertRecipients;
  throttling?: IDataAlertThrottlingResource;
  conditionId: string;
  decription?: string;
  triggerType: "RELOAD" | "SCHEDULED";
  scheduleOptions?: IDataAlertScheduleOptions;
}

export interface IDataAlertCreateWithNewCondition {
  name: string;
  appId: string;
  enabled?: boolean;
  sheetId?: string;
  bookmarkId: string;
  recipients: IDataAlertRecipients;
  throttling?: IDataAlertThrottlingResource;
  condition: IConditionCreate;
  decription?: string;
  triggerType: "RELOAD" | "SCHEDULED";
  scheduleOptions?: IDataAlertScheduleOptions;
}

export interface IAlertingConditionResponse {
  hideSelections?: boolean;
  conditionResponse: ICollection;
}

export interface IAlertingRecipientStatsErrors {
  code: string;
  title: string;
  detail: string;
}

export interface IAlertingExecutionError
  extends IAlertingRecipientStatsErrors {}

export interface IAlertingRecipientStats {
  enabled: boolean;
  type?: "userid";
  value?: string;
  errors: IAlertingRecipientStatsErrors[];
  groups: string[];
  lastScan?: string;
  subscribed?: boolean;
  lastTrigger?: string;
  conditionStatus?: "OK" | "FAILED";
}

export interface IAlertingRecipientStatsResponse {
  recipientStats: IAlertingRecipientStats[];
}

export interface IDataAlertEvaluation {
  id: string;
  result: "success" | "failure" | "error";
  status: "RUNNING" | "FAILED" | "FINISHED";
  endTime: string;
  ownerId: string;
  tenantId: string;
  contextId: string;
  startTime: string;
  resultData: object;
  causalEvent: object;
  conditionId: string;
  dataConditionEvaluatorId: string;
}

export interface IAlertingExecutionPersist {
  id: string;
  errors: IAlertingExecutionError[];
  result: {
    alertTriggerStatus: string;
    throttlerTokensLeft: number;
  };
  alertId: string;
  ownerId: string;
  measures: string[];
  tenantId: string;
  accessMode: "SOURCE_ACCESS" | "TARGET_ACCESS";
  bookmarkId: string;
  dimensions: string[];
  workflowId: string;
  conditionId: string;
  triggerTime: string;
  evaluationId: string;
  executionType: "INDIVIDUAL" | "SHARED";
  conditionStatus: "FINISHED" | "FAILED";
  executionEvaluationStatus: "CONDITION_MET" | "CONDITION_NOT_MET" | "FAILED";
}

export interface IAlertingExecutionResponse {
  links: ILinks;
  evaluation: IDataAlertEvaluation;
  undefined: IAlertingExecutionPersist;
}

export interface IDataAlertUpdate {
  value: object;
  path:
    | "ownerName"
    | "ownerId"
    | "conditionId"
    | "enabledAction"
    | "bookmarkId"
    | "name"
    | "description"
    | "throttling"
    | "triggerType"
    | "scheduleOptions";
}

export interface IDataAlertTriggerActionResponse {
  workflowID: string;
}

export interface IDataAlertSettings {
  "enable-data-alerting": boolean;
  tenantId: string;
  dataAlertsLimits: number;
  dataAlertsConsumed: number;
  "data-alerting-license-status": "enabled" | "disabled";
  "max-recipients-in-target-access": number;
  "data-alerting-feature-operation-status": "none" | "enabling" | "disabling";
  "data-alerting-feature-operation-status-change": string;
}

export interface IDataAlertExecutionStatsAggregated {
  endTime: string;
  periodKey: string;
  startTime: string;
  totalExecutions: number;
  triggeredExecutions: number;
}

export interface IDataAlertExecutionStatsAggregatedResponse {
  executionsStats: IDataAlertExecutionStatsAggregated[];
}

export interface IDataAlertExecutionListResponse {
  StandardListResponseProps: {
    currentPageCount: number;
    totalCount: number;
  };
  links: ILinks;
  executions: IAlertingExecutionResponse[]; // ???
}

export interface IDataAlertExecutionStats {
  endTime: string;
  periodKey: string;
  startTime: string;
  totalExecutions: string;
  triggeredExecutions: string;
}

export interface IDataAlertTaskExecutionStatsResponse {
  StandardListResponseProps: {
    currentPageCount: number;
    totalCount: number;
  };
  links: ILinks;
  executionsStats: IDataAlertExecutionStats;
}

export interface IDataAlertEvaluationGetResponse {
  condition: object;
  evaluation: IDataAlertEvaluation;
  hideSelections: boolean;
}

export interface IDataAlertAlertingTaskValidation {
  id: string;
  type: "RECIPIENT" | "CONDITION" | "RECIPIENT_GROUP";
  error:
    | "NO_ACCESS"
    | "USER_IS_DISABLED"
    | "INVALID_CONDITION"
    | "GROUP_IS_DISABLED"
    | "GROUP_SIZE_EXCEEDED";
  description;
  string;
  validationErrors: string[];
}

export interface IDataAlertValidateActionsResponse {
  status: "FAILURE" | "SUCCESS";
  validations: IDataAlertAlertingTaskValidation[];
}
