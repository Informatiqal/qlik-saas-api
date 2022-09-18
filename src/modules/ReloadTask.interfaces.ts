import { ILinksShort, MakeOptional } from "../types/Common";

export interface IReloadTaskBase {
  /**
   * The ID of the app.
   */
  appId: string;
  /**
   * The task is partial reload or not
   *
   * @default false
   */
  partial: boolean;
  /**
   * The time zone in which the time is specified. (Formatted as an IANA Time Zone Database name, e.g. Europe/Zurich.) This field specifies the time zone in which the event start/end are expanded. If missing the start/end fields must specify a UTC offset in RFC3339 format.
   *
   * @default Europe/London
   */
  timeZone: string;
  /**
   * A flag that indicates whether a reload is triggered when data of the app is changed
   * @default false
   */
  autoReload: boolean;
  /**
   * List of RECUR lines for a recurring event, as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this field; event start and end times are specified in the start and end fields. This field is omitted for single events or instances of recurring events
   *
   * @example
   * "RRULE:FREQ=DAILY;BYHOUR=8;BYMINUTE=0;BYSECOND=0",
   * "RRULE:FREQ=WEEKLY;BYHOUR=10;BYMINUTE=0;BYSECOND=0"
   */
  recurrence: string[];
  /**
   * The time that the task will stop recurring.
   * @default empty string
   * @example 2022-09-18T14:45:00
   */
  endDateTime: string;
  /**
   * The time that the task execution start recurring. Note that the empty string value with the empty recurrence array indicates the scheduled job is not set.
   * @example 2022-09-18T14:45:00
   */
  startDateTime: string;
  /**
   * A flag that indicates whether it is a partial reload or not for the auto reload
   * @default false
   */
  autoReloadPartial: boolean;
  /**
   * @deprecated
   * type of task being created - deprecated
   */
  type: string;
}

export interface IReloadTask extends IReloadTaskBase {
  /**
   * The ID of the task.
   */
  id: string;
  /**
   * The reason why the task was disabled.
   */
  log: string;
  /**
   * Toggle for enabling and disabling the reload task
   */
  state: "Enabled" | "Disabled";
  /**
   * The ID of the user who owns the task.
   */
  userId: string;
  /**
   * The space ID of the application
   */
  spaceId: string;
  /**
   * The ID of the tenant who owns the task.
   */
  tenantId: string;
  /**
   * The fortress ID of the application
   */
  fortressId: string;
  /**
   * The last time the task executed.
   */
  lastExecutionTime: string;
  /**
   * The next time the task will execute.
   */
  nextExecutionTime: string;
  links: ILinksShort;
}

export type IReloadTaskCreate = MakeOptional<
  IReloadTaskBase,
  | "partial"
  | "autoReload"
  | "autoReloadPartial"
  | "endDateTime"
  | "type"
  | "timeZone"
>;

export interface IReloadTaskUpdatePartial extends Partial<IReloadTaskBase> {
  state?: "Enabled" | "Disabled";
  log?: string;
}

export interface IReloadTaskUpdate
  extends Omit<IReloadTaskUpdatePartial, "appId" | "log"> {}
