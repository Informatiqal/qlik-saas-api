import { QlikSaaSClient } from "qlik-rest-api";
import { IWebHookEvenType } from "./WebHooks";

export interface IWebHook {
  id: string;
  name: string;
  description: string;
  url: string;
  eventTypes: IWebHookEvenType[];
  headers: {
    [k: string]: string;
  };
  enabled: boolean;
  secret: string;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWebHookUpdate {
  name?: string;
  description?: string;
  url?: string;
  eventTypes: IWebHookEvenType[];
  headers: {
    [k: string]: string;
  };
  enabled: boolean;
  secret: string;
  createdByUserId: string;
  updatedByUserId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IWebHookDelivery {
  id: string;
  webhookId: string;
  triggeredAt: string;
  status: "success";
  statusMessage: string;
  eventType: string;
  request: {
    url: string;
    headers: {
      [k: string]: string;
    };
    body: {};
  };
  response: {
    statusCode: number;
    headers: {
      [k: string]: string;
    };
    body: string;
  };
}

//TODO: whats the difference between the PUT and the PATCH methods
export interface IClassWebHook {
  details: IWebHook;
  remove(): Promise<number>;
  update(arg: IWebHookUpdate): Promise<number>;
  delivery(id: string): Promise<IWebHookDelivery>;
  deliveryResend(id: string): Promise<IWebHookDelivery>;
  deliveries(): Promise<IWebHookDelivery[]>;
}

export class WebHook implements IClassWebHook {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IWebHook;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IWebHook) {
    if (!id) throw new Error(`webHooks.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`webhooks/${this.id}`)
        .then((res) => res.data as IWebHook);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`webhooks/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: IWebHookUpdate) {
    if (arg.name) this.details.name = arg.name;
    if (arg.description) this.details.name = arg.name;
    if (arg.url) this.details.url = arg.url;
    if (arg.enabled) this.details.enabled = arg.enabled;
    if (arg.secret) this.details.secret = arg.secret;
    if (arg.createdByUserId) this.details.createdByUserId = arg.createdByUserId;
    if (arg.createdAt) this.details.createdAt = arg.createdAt;
    if (arg.updatedByUserId) this.details.updatedByUserId = arg.updatedByUserId;
    if (arg.updatedAt) this.details.updatedAt = arg.updatedAt;
    if (arg.eventTypes) this.details.eventTypes = arg.eventTypes;
    if (arg.headers) this.details.headers = arg.headers;

    return await this.saasClient
      .Put(`webhooks/${this.id}`, this.details)
      .then((res) => res.status);
  }

  async deliveries() {
    return await this.saasClient
      .Get(`webhooks/${this.id}/deliveries`)
      .then((res) => res.data as IWebHookDelivery[]);
  }

  async delivery(id: string) {
    if (!id) throw new Error(`webHook.delivery: "id" parameter is required`);

    return await this.saasClient
      .Get(`webhooks/${this.id}/deliveries/${id}`)
      .then((res) => res.data as IWebHookDelivery);
  }

  async deliveryResend(id: string) {
    if (!id)
      throw new Error(`webHook.deliveryResend: "id" parameter is required`);

    return await this.saasClient
      .Post(`webhooks/${this.id}/deliveries/${id}/actions/resend`, {})
      .then((res) => res.data as IWebHookDelivery);
  }
}
