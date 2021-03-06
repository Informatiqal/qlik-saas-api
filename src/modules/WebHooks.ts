import { QlikSaaSClient } from "qlik-rest-api";
import { IClassWebHook, IWebHook, WebHook } from "./WebHook";

export interface IWebHookEvenType {
  title: string;
  name: string;
  description: string;
}

export interface IWebHookCreate {
  name: string;
  url: string;
  id?: string;
  description?: string;
  eventTypes?: IWebHookEvenType[];
  headers?: {
    [k: string]: string;
  };
  enabled?: boolean;
  secret?: string;
  createdByUserId?: string;
  updatedByUserId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IClassWebHooks {
  get(id: string): Promise<IClassWebHook>;
  getAll(): Promise<IClassWebHook[]>;
  eventTypes(): Promise<IWebHookEvenType[]>;
  create(arg: IWebHookCreate): Promise<IClassWebHook>;
}

export class WebHooks implements IClassWebHooks {
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

  // TODO: 400 when called?
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
      .Post(`webhooks`, arg)
      .then((res) => new WebHook(this.saasClient, res.data.id, res.data));
  }
}
