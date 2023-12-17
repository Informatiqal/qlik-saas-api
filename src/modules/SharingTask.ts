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
  templates: string; //???
  thumbnail: string;
  updatedBy: string;
  expiration: string;
  recipients: string; //???
  statusCode: string;
  taskErrors: string; //???
  templateId: string;
  dateCreated: string;
  description: string;
  lastUpdated: string;
  statusLabel: string;
  emailContent: string; //???
  enabledByUser: boolean;
  encryptedState: string; //???
  byokMigrationId: string;
  enabledBySystem: boolean;
  retentionPolicy: string; //???
  scheduleOptions: string; //???
  selectionErrors: {};
  dataConnectionID: string;
  hasSectionAccess: string;
  insightDirectURL: string;
  multiInsightURLs: string; //???
  nextScheduledRun: string;
  reportProperties: {};
  sharePointFolder: string;
  executeOnCreation: boolean;
  lastExecutionDate: string;
  transportChannels: string[];
  distributionList: string;
  encryptedTemplates: string; //???
  insightFallbackURL: string;
  encryptedEmailContent: string; //???
  failedExecutionsCount: number;
  failedVerificationCount: number;
  isCandidateForVerification: number;
  links: string; //???
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
