import { QlikSaaSClient } from "qlik-rest-api";
import { IWebIntegration, WebIntegration } from "./WebIntegration";

export interface IWebIntegrationCreate {
  name: string;
  /**
   * Include protocol as well. For example: http://localhost and not only localhost
   */
  validOrigins?: string[];
}

export interface IClassWebIntegrations {
  get(id: string): Promise<WebIntegration>;
  getAll(): Promise<WebIntegration[]>;
  create(arg: IWebIntegrationCreate): Promise<IWebIntegration>;
}

export class WebIntegrations implements IClassWebIntegrations {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`webIntegrations.get: "id" parameter is required`);
    const wi: WebIntegration = new WebIntegration(this.saasClient, id);
    await wi.init();

    return wi;
  }

  async getAll() {
    return await this.saasClient
      .Get<IWebIntegration[]>(`web-integrations`)
      .then((res) => res.data)
      .then((data) => {
        return data.map((t) => new WebIntegration(this.saasClient, t.id, t));
      });
  }

  async create(arg: IWebIntegrationCreate) {
    if (!arg.name)
      throw new Error(`webIntegrations.create: "name" parameter is required`);

    return await this.saasClient
      .Post<IWebIntegration>("web-integrations", { ...arg })
      .then((res) => res.data);
  }
}
