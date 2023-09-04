import { QlikSaaSClient } from "qlik-rest-api";
import { IWebHook, WebHook } from "./WebHook";
import { parseFilter } from "../util/filter";

export interface IWebHookEvenType {
  title: string;
  name: string;
  description: string;
}

// make all props optional, apart from id, url and name
// remove id in general (cant be passed to create method anyway)
// add url and name props again but this time as mandatory/required
export type IWebHookCreate = Partial<
  Omit<IWebHook, "id" | "url" | "name" | "createdAt" | "updatedAt">
> & {
  /**
   * Target URL for webhook HTTPS requests
   */
  url: string;
  /**
   * The name for the webhook
   */
  name: string;
};

export class WebHooks {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`webhooks.get: "id" parameter is required`);

    const webHook: WebHook = new WebHook(this.#saasClient, arg.id);
    await webHook.init();

    return webHook;
  }

  async getAll() {
    return await this.#saasClient
      .Get<IWebHook[]>(`webhooks?limit=50`)
      .then((res) => res.data)
      .then((data) => data.map((t) => new WebHook(this.#saasClient, t.id, t)));
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
    return await this.#saasClient
      .Get<IWebHookEvenType[]>(`webhooks/event-types`)
      .then((res) => res.data);
  }

  async create(arg: IWebHookCreate) {
    if (!arg.name)
      throw new Error(`webHooks.create: "name" parameter is required`);
    if (!arg.url)
      throw new Error(`webHooks.create: "url" parameter is required`);

    return await this.#saasClient
      .Post<IWebHook>(`webhooks`, arg)
      .then((res) => new WebHook(this.#saasClient, res.data.id, res.data));
  }
}
