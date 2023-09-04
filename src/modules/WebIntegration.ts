import { QlikSaaSClient } from "qlik-rest-api";

export interface IWebIntegrationUpdate {
  value: string;
  path: "name" | "validOrigins";
}

export interface IWebIntegration {
  /**
   * The unique web integration identifier.
   */
  id: string;
  /**
   * The name of the web integration.
   */
  name: string;
  /**
   * The time the web integration was created.
   */
  created: string;
  /**
   * The tenant that the web integration belongs to.
   */
  tenantId: string;
  /**
   * The user that created the web integration.
   */
  createdBy: string;
  /**
   * The time the web integration was last updated.
   */
  lastUpdated: string;
  /**
   * The origins that are allowed to make requests to the tenant.
   *
   * Include protocol as well. For example: http://localhost and not only localhost
   */
  validOrigins: string[];
}

export class WebIntegration {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IWebIntegration;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IWebIntegration
  ) {
    if (!id) throw new Error(`webIntegration.get: "id" parameter is required`);

    this.details = details ?? ({} as IWebIntegration);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: true }) {
    if (Object.keys(this.details).length == 0 || arg?.force == true) {
      this.details = await this.#saasClient
        .Get<IWebIntegration>(`web-integrations/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`web-integrations/${this.#id}`)
      .then((res) => res.status);
  }

  async update(arg: IWebIntegrationUpdate[]) {
    let updateStatus = 0;

    return await this.#saasClient
      .Patch(
        `web-integrations/${this.#id}`,
        arg.map((a) => ({
          op: "replace",
          path: `/${a.path}`,
          value: a.value,
        }))
      )
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
