import { QlikSaaSClient } from "qlik-rest-api";
import { IReportTemplate, ReportTemplate } from "./ReportTemplate";


export class SharingTasks {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  /**
   * Info about the tenant accessing the endpoint
   */
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
  // async create(arg: ICreateTemplateRequest) {
  //   if (!arg.name)
  //     throw new Error(`reportTemplates.create: "name" parameter is required`);
  //   if (!arg.temporaryContentId)
  //     throw new Error(
  //       `reportTemplates.create: "temporaryContentId" parameter is required`
  //     );

  //   return await this.#saasClient
  //     .Post<IReportTemplate>(`report-templates`, arg)
  //     .then(
  //       (res) => new ReportTemplate(this.#saasClient, res.data.id, res.data)
  //     );
  // }
}
