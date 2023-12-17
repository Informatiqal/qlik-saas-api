import { QlikSaaSClient } from "qlik-rest-api";
import {
  ISharingTask,
  ISharingTaskRecurringRecipients,
  ITemplateResult,
  SharingTask,
} from "./SharingTask";
import { SharingTasksSettings } from "./SharingTasksSettings";

export interface ISharingTaskRecurringCreateRequest {
  name: string;
  type:
    | "chart-monitoring"
    | "chart-sharing"
    | "sheet-sharing"
    | "template-sharing";
  state: {
    fields: {}[];
    queryItems: {}[];
    selections: {
      name: string;
      values: string[];
      isNumeric: boolean;
      stateName: string;
      displayName?: string;
      displayValues?: string[];
    }[];
  };
  appName: string;
  enabled?: boolean;
  message?: string;
  subType?: string;
  tags?: string[];
  trigger?: {
    recurrence: string[];
    chronosJobID?: string;
    executeOnAppReload?: boolean;
    executionHistoryInterval?: string;
  };
  startTime?: string;
  templates: ITemplateResult[];
  expiration?: string;
  recipients?: ISharingTaskRecurringRecipients;
  description?: string;
  emailContent?: {
    body: string;
    subject: string;
  };
  retentionPolicy?: {
    historySize: number;
    overrideInterval: string;
  };
  scheduleOptions?: {
    timezone: string;
    recurrence: string[];
    endDateTime: string;
    chronosJobID: string;
    startDateTime: string;
    lastExecutionTime: string;
    nextExecutionTime: string;
  };
  dataConnectionID?: string;
  sharePointFolder?: string;
  executeOnCreation?: boolean;
  transportChannels?: string[];
  distributionListId: string;
}

export class SharingTasks {
  #saasClient: QlikSaaSClient;
  settings: SharingTasksSettings;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
    this.settings = new SharingTasksSettings(this.#saasClient);
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`sharingTask.get: "id" parameter is required`);

    const st: SharingTask = new SharingTask(this.#saasClient, arg.id);
    await st.init();

    return st;
  }

  /**
   * Returns a list of sharing tasks as an instance
   */
  async getAll() {
    return await this.#saasClient
      .Get<ISharingTask[]>(`sharing-tasks?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new SharingTask(this.#saasClient, t.id, t))
      );
  }

  // async getFilter(arg: { filter: string }) {
  //   if (!arg.filter)
  //     throw new Error(`users.getFilter: "filter" parameter is required`);

  //   return await this.getAll().then((entities) => {
  //     const anonFunction = Function(
  //       "entities",
  //       `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
  //     );

  //     return anonFunction(entities) as User[];
  //   });
  // }

  // async removeFilter(arg: { filter: string }) {
  //   if (!arg.filter)
  //     throw new Error(`users.removeFilter: "filter" parameter is required`);

  //   return await this.getFilter(arg).then((entities) =>
  //     Promise.all(
  //       entities.map((entity) =>
  //         entity.remove().then((s) => ({ id: entity.details.id, status: s }))
  //       )
  //     )
  //   );
  // }

  /**
   * Creates a new recurring sharing task
   */
  async create(arg: ISharingTaskRecurringCreateRequest) {
    return await this.#saasClient
      .Post<ISharingTask>(`shared-tasks`, arg)
      .then((res) => new SharingTask(this.#saasClient, res.data.id, res.data));
  }
}
