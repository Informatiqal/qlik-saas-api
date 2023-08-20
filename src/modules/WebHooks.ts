import { QlikSaaSClient } from "qlik-rest-api";
import { IWebHook, WebHook } from "./WebHook";
import { parseFilter } from "../util/filter";

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

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`webhooks.get: "id" parameter is required`);

    const webHook: WebHook = new WebHook(this.saasClient, arg.id);
    await webHook.init();

    return webHook;
  }

  async getAll() {
    return await this.saasClient
      .Get<IWebHook[]>(`webhooks`)
      .then((res) => res.data)
      .then((data) => data.map((t) => new WebHook(this.saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`webHooks.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as WebHook[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`webHooks.removeFilter: "filter" parameter is required`);

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async eventTypes() {
    return await this.saasClient
      .Get<IWebHookEvenType[]>(`webhooks/event-types`)
      .then((res) => res.data);
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
