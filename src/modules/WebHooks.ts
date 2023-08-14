import { QlikSaaSClient } from "qlik-rest-api";
import { IWebHook, WebHook } from "./WebHook";

export interface IWebHookEvenType {
  title: string;
  name: string;
  description: string;
}

export interface IWebHookCreate {
  name: string;
  /**
   * Must be top-level domain (should end with .com, .io, or similar)
   */
  url: string;
  id?: string;
  level?: "tenant" | "user";
  filter?: string;
  description?: string;
  eventTypes?: string[];
  headers?: {
    [k: string]: string;
  };
  /**
   * Default value is "false"
   */
  enabled?: boolean;
  secret?: string;
  createdByUserId?: string;
  updatedByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
  ownerId?: string;
  disabledReason?: string;
  disabledReasonCode?: string;
}

export class WebHooks {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`webhooks.get: "id" parameter is required`);
    const webHook: WebHook = new WebHook(this.saasClient, id);
    await webHook.init();

    return webHook;
  }

  async getAll() {
    return await this.saasClient
      .Get(`webhooks`)
      .then((res) => res.data as IWebHook[])
      .then((data) => data.map((t) => new WebHook(this.saasClient, t.id, t)));
  }

  async eventTypes() {
    return await this.saasClient
      .Get(`webhooks/event-types`)
      .then((res) => res.data as IWebHookEvenType[]);
  }

  async create(arg: IWebHookCreate) {
    if (!arg.name)
      throw new Error(`webHooks.create: "name" parameter is required`);
    if (!arg.url)
      throw new Error(`webHooks.create: "url" parameter is required`);

    return await this.saasClient
      .Post<IWebHook>(`webhooks`, arg)
      .then((res) => new WebHook(this.saasClient, res.data.id, res.data));
  }
}
