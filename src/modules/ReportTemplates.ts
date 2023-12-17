import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { parseFilter } from "../util/filter";
import { IReportTemplate, ReportTemplate } from "./ReportTemplate";

export interface ICreateTemplateRequest {
  /**
   * Template name
   */
  name: string;
  /**
   * Template description
   */
  description?: string;
  /**
   * The ID of the app that this template is using as data source. The id stored in the template file metadata is used if no value is specified
   */
  sourceAppId?: string;
  /**
   * Specifies the action to perform with the given source app id. Use "validate" to verify that the template source app matches the provided value. Use "replace" to migrate the template to a different app by replacing the source app id
   */
  sourceAppAction?: "validate" | "replace";
  /**
   * The ID of a previously uploaded temporary content file
   */
  temporaryContentId: string;
}

export class ReportTemplates {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(`reportTemplates.get: "id" parameter is required`);

    const rt: ReportTemplate = new ReportTemplate(this.#saasClient, arg.id);
    await rt.init();

    return rt;
  }

  /**
   * Returns a list of report templates as an instance
   */
  async getAll() {
    return await this.#saasClient
      .Get<IReportTemplate[]>(`report-templates?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new ReportTemplate(this.#saasClient, t.id, t))
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
   * Creates a new report template
   */
  async create(arg: ICreateTemplateRequest) {
    if (!arg.name)
      throw new Error(`reportTemplates.create: "name" parameter is required`);
    if (!arg.temporaryContentId)
      throw new Error(
        `reportTemplates.create: "temporaryContentId" parameter is required`
      );

    return await this.#saasClient
      .Post<IReportTemplate>(`report-templates`, arg)
      .then(
        (res) => new ReportTemplate(this.#saasClient, res.data.id, res.data)
      );
  }
}
