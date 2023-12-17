import { QlikSaaSClient } from "qlik-rest-api";

export interface IReportTemplate {
  /**
   * The template ID
   */
  id: string;
  /**
   * Template name
   */
  name: string;
  /**
   * The user that this template is scoped to
   */
  ownerId: string;
  /**
   * The data and time when the template was created
   */
  createdAt: string;
  /**
   * The id of the user who created the template
   */
  createdBy: string;
  /**
   * The date and time when the template was last updated
   */
  updatedAt: string;
  /**
   * The id of the user who last updated the template
   */
  updatedBy: string;
  /**
   * Template description
   */
  description: string;
  /**
   * The id of the app that this template is using as data source
   */
  sourceAppId: string;
  /**
   * The name of the app that this template is using as data source
   */
  sourceAppName: string;
  /**
   * THe template metadata version
   */
  metadataVersion: number;
}

export interface IReportTemplatePatch {
  op: string;
  from: string;
  path: string;
  value: {};
}

export interface IReportTemplateUpdate {
  /**
   * Template name
   */
  name?: string;
  /**
   * Template description
   */
  description?: string;
  /**
   * The ID of a previous uploaded temporary content file
   */
  temporaryContentId: string;
}

export class ReportTemplate {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IReportTemplate;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IReportTemplate
  ) {
    if (!id) throw new Error(`reportTemplate.get: "id" parameter is required`);

    this.details = details ?? ({} as IReportTemplate);
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
        .Get<IReportTemplate>(`report-templates/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`report-templates/${this.#id}`)
      .then((res) => res.status);
  }

  async download() {
    return await this.#saasClient
      .Post<string>(`report-templates/${this.#id}/actions/download`, {})
      .then((res) => res.data);
  }

  async patch(arg: IReportTemplatePatch[]) {
    let updateStatus = 0;

    return await this.#saasClient
      .Patch(`report-templates/${this.#id}`, arg)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  async update(arg: IReportTemplateUpdate) {
    if (!arg.temporaryContentId)
      throw new Error(
        `reportTemplate.update: "temporaryContentId" parameter is required`
      );

    if (!arg.name) arg.name = this.details.name;

    let updateStatus = 0;

    return await this.#saasClient
      .Post<string>(`report-templates/${this.#id}/actions/download`, arg)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
