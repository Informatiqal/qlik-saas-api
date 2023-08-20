import { QlikSaaSClient } from "qlik-rest-api";
import { IWebIntegration, WebIntegration } from "./WebIntegration";
import { parseFilter } from "../util/filter";

export interface IWebIntegrationCreate {
  name: string;
  /**
   * Include protocol as well. For example: http://localhost and not only localhost
   */
  validOrigins?: string[];
}

export class WebIntegrations {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(`webIntegrations.get: "id" parameter is required`);

    const wi: WebIntegration = new WebIntegration(this.saasClient, arg.id);
    await wi.init();

    return wi;
  }

  async getAll() {
    return await this.saasClient
      .Get(`web-integrations`)
      .then((res) => res.data as IWebIntegration[])
      .then((data) => {
        return data.map((t) => new WebIntegration(this.saasClient, t.id, t));
      });
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `webIntegrations.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `webIntegrations.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async create(arg: IWebIntegrationCreate) {
    if (!arg.name)
      throw new Error(`webIntegrations.create: "name" parameter is required`);

    return await this.saasClient
      .Post("web-integrations", { ...arg })
      .then((res) => res.data as IWebIntegration);
  }
}
