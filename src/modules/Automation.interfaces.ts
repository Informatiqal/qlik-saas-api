export interface IAutomationRunDetailResponseObject {
  data: object; //???
  guid: string;
  error: object; //???
  title: string;
  inputs: object; //???
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
  expectedInputs: object; //???
  scheduledStartTime: string;
}

export interface IAutomationScheduleBase {
  stopAt: string;
  startAt: string;
  interval: number;
  timezone: string;
}

export interface IAutomationScheduleResponseObject
  extends IAutomationScheduleBase {
  id: number;
  guid: string;
  lastStartedAt: string;
}

export interface IAutomation {
  guid: string;
  state: "available" | "unavailable" | "disabled";
  title: string;
  lastRun: IAutomationRunDetailResponseObject;
  ownerId: string;
  runMode: "manual" | "scheduled" | "triggered" | "webhook";
  createdAt: string;
  lastRunAt: string;
  schedules: IAutomationScheduleResponseObject[];
  updatedAt: string;
  workspace: object; //???
  description: string;
  snippetGuids: string[];
  endpointGuids: string[];
  lastRunStatus:
    | "failed"
    | "finished"
    | "finished with warnings"
    | "must stop"
    | "not started"
    | "paused"
    | "running"
    | "starting"
    | "stopped";
  connectorGuids: string[];
  executionToken: string[];
}

export interface IAutomationCreate {
  name: string;
  state: "available" | "unavailable" | "disabled";
  schedules: IAutomationScheduleBase[];
  workspace: object; // ???
  description: string;
}

export interface IAutomationUsage {
  data: {
    name:
      | "runs"
      | "scheduledRun"
      | "triggeredRun"
      | "webhookRuns"
      | "duration"
      | "bandwidthIn"
      | "bandwidthOut";
    date: string;
    value: number;
    automation: {
      guid: string;
      name: string;
      ownerId: string;
    };
  };
}

export interface IAutomationsSettings {
  automationsEnabled: boolean;
}
