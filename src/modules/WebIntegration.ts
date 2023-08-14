import { QlikSaaSClient } from "qlik-rest-api";

export interface IWebIntegrationUpdate {
  value: string;
  path: "name" | "validOrigins";
}

export interface IWebIntegration {
  id: string;
  name: string;
  created: string;
  createdBy: string;
  lastUpdated: string;
  validOrigins: string[];
}

export class WebIntegration {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IWebIntegration;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IWebIntegration
  ) {
    if (!id) throw new Error(`webIntegration.get: "id" parameter is required`);

    this.details = details ?? ({} as IWebIntegration);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`web-integrations/${this.id}`)
        .then((res) => res.data as IWebIntegration);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`web-integrations/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: IWebIntegrationUpdate[]) {
    return await this.saasClient
      .Patch(
        `web-integrations/${this.id}`,
        arg.map((a) => ({
          op: "replace",
          path: `/${a.path}`,
          value: a.value,
        }))
      )
      .then((res) => res.status);
  }
}
