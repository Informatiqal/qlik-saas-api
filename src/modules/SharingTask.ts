import { QlikSaaSClient } from "qlik-rest-api";

export interface ISelections {
  name: string;
  values: string[];
  isNumeric: boolean;
  stateName: string;
  displayName: string;
  displayValues: string[];
}

export interface IState {
  fields: {}[];
  queryItems: {}[];
  selections: ISelections[];
}

export interface ITrigger {
  recurrence: string[];
  chronJobID: string;
  executeOnAppReload: boolean;
  executionHistoryInterval:
    | "minutely"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "quarterly"
    | "yearly";
}

export interface SharingTaskRecurringPersist_encryptedEmailContent {
  body: {
    cipher: string;
  };
  subject: {
    cipher: string;
  };
}

export interface IScheduleOptions {
  timezone: string;
  recurrence: string[];
  endDateTime: string;
  cronJobID: string;
  lastExecutionTime: string;
  nextExecutionTime: string;
}

export interface ISharingTask {
  id: string;
  name: string;
  tags: string[];
  type:
    | "chart-monitoring"
    | "chart-sharing"
    | "sheet-sharing"
    | "template-sharing";
  appId: string;
  owner: string;
  state: IState;
  tenant: string;
  appName: string;
  lastRun: string;
  message: string;
  spaceId: string;
  subType: "pdf" | "pptx" | "xlsx";
  trigger: ITrigger;
  createdBy: string;
  insightID: string;
  ownerName: string;
  startTime: string;
  templates: {
    type: string;
    subType: string;
    fileName: string;
    chartData: {
      appId: string;
      jsOpts: {};
      outDpi: number;
      outZoom: null;
      patches: {}[];
      sheetId: string;
      widthPx: number;
      heightPx: number;
      objectId: string;
      objectDef: {};
    };
    fileAlias: string;
    storyData: {
      appId: string;
      storyId: string;
    };
    fileTimeStamp: string;
    multiSheetData: {
      appId: string;
      jsOpts: {};
      sheetId: string;
      widthPx: number;
      heightPx: number;
      isPrivate: boolean;
      sheetName: string;
      jsOptsById: {};
      resizeType: string;
      patchesById: {};
    };
  }[];
  thumbnail: string;
  updatedBy: string;
  expiration: string;
  recipients: {
    DLUsers: {}[];
    userIds: {
      value: string;
      groups: string[];
      subscribed: boolean;
      enabledByUser: boolean;
      enabledBySystem: boolean;
      taskGroupRecipientErrors: {
        value: string;
        timestamp: string;
      }[];
      alertingTaskGroupRecipientErrors: {
        added: string;
        value: string;
      }[];
    }[];
    DLGroups: {}[];
    groupIds: {
      value: string;
      enabledBySystem: boolean;
      taskGroupRecipientErrors: {
        value: string;
        timestamp: string;
      }[];
      alertingTaskGroupRecipientErrors: {
        added: string;
        value: string;
      }[];
    }[];
    emailAddresses: {
      value: string;
      enabled: boolean;
      taskRecipientErrors: {
        value: string;
        timestamp: string;
      }[];
    }[];
  };
  statusCode: string;
  taskErrors: {
    value: string;
    timestamp: string;
  }[];
  templateId: string;
  dateCreated: string;
  description: string;
  lastUpdated: string;
  statusLabel: string;
  emailContent: {
    body: string;
    subject: string;
  };
  enabledByUser: boolean;
  encryptedState: {
    cipher: string;
  };
  byokMigrationId: string;
  enabledBySystem: boolean;
  retentionPolicy: {
    historySize: number;
    overrideInterval: string;
  };
  scheduleOptions: IScheduleOptions;
  selectionErrors: {};
  dataConnectionID: string;
  hasSectionAccess: string;
  insightDirectURL: string;
  multiInsightURLs: {
    status: "successful" | "failed";
    directURL: string;
    resourceID: string;
    /**
     * @deprecated
     */
    templateID: string;
    fallbackURL: string;
  };
  nextScheduledRun: string;
  reportProperties: {};
  sharePointFolder: string;
  executeOnCreation: boolean;
  lastExecutionDate: string;
  transportChannels: string[];
  distributionList: string;
  encryptedTemplates: {
    cipher: string;
  };
  insightFallbackURL: string;
  encryptedEmailContent: SharingTaskRecurringPersist_encryptedEmailContent;
  failedExecutionsCount: number;
  failedVerificationCount: number;
  isCandidateForVerification: number;
  links: {
    self: {
      href: string;
    };
  };
  enabled: boolean;
  lastExecutionURL: string;
  lastExecutionFilesURL: string;
}

export class SharingTask {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: ISharingTask;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ISharingTask) {
    if (!id) throw new Error(`sharingTask.get: "id" parameter is required`);

    this.details = details ?? ({} as ISharingTask);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<ISharingTask>(`sharing-tasks/${this.#id}`)
        .then((res) => res.data);
    }
  }

  // async remove() {
  //   return await this.#saasClient
  //     .Delete(`report-templates/${this.#id}`)
  //     .then((res) => res.status);
  // }

  // async download() {
  //   return await this.#saasClient
  //     .Post<string>(`report-templates/${this.#id}/actions/download`, {})
  //     .then((res) => res.data);
  // }

  // async patch(arg: IReportTemplatePatch[]) {
  //   let updateStatus = 0;

  //   return await this.#saasClient
  //     .Patch(`report-templates/${this.#id}`, arg)
  //     .then((res) => {
  //       updateStatus = res.status;
  //       return this.init({ force: true });
  //     })
  //     .then(() => updateStatus);
  // }

  // async update(arg: IReportTemplateUpdate) {
  //   if (!arg.temporaryContentId)
  //     throw new Error(
  //       `reportTemplate.update: "temporaryContentId" parameter is required`
  //     );

  //   if (!arg.name) arg.name = this.details.name;

  //   let updateStatus = 0;

  //   return await this.#saasClient
  //     .Post<string>(`report-templates/${this.#id}/actions/download`, arg)
  //     .then((res) => {
  //       updateStatus = res.status;
  //       return this.init({ force: true });
  //     })
  //     .then(() => updateStatus);
  // }
}
