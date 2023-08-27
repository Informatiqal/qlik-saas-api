import { QlikSaaSClient } from "qlik-rest-api";
import { IWebHookEvenType } from "./WebHooks";

export interface IWebHook {
  /**
   * The webhook's unique identifier
   */
  id: string;
  /**
   * Target URL for webhook HTTPS requests
   */
  url: string;
  /**
   * The name for the webhook
   */
  name: string;
  /**
   * Defines at what level the webhook should operate: for all resources belonging to a tenant
   * or restricted to only those accessible by the webhook-creator.
   *
   * @default tenant
   */
  level: "tenant" | "user";
  /**
   * Filter that should match for a webhook to be triggered.
   * Supported common attribute names are 'id', 'spaceId' and 'topLevelResourceId',
   * beside the common attributes the "com.qlik.v1.app.reload.finished" event
   * also supports "data.status" that could be either "ok" or "error"
   * but can't be used together with other event types.
   * Supported attribute operators are 'eq' and 'ne'.
   * Supported logical operators are 'and' and 'or'.
   * Note that attribute values must be valid JSON strings,
   * hence they're enclosed with double quotes
   * For more detailed information regarding the SCIM filter syntax (RFC7644) used
   * please follow the link to external documentation.
   */
  filter: string;
  /**
   * String used as secret for calculating HMAC hash sent as header
   */
  secret: string;
  /**
   * Whether the webhook is active and sending requests
   *
   * @default false
   */
  enabled: boolean;
  /**
   * Additional headers in the post request
   */
  headers: {
    [k: string]: string;
  };
  /**
   * The id of the user that owns the webhook, only applicable for user level webhooks
   */
  ownerId: string;
  /**
   * The UTC timestamp when the webhook was created
   */
  createdAt: string;
  /**
   * The UTC timestamp when the webhook was last updated
   */
  updatedAt: string;
  /**
   * Types of events for which the webhook should trigger.
   */
  eventTypes: IWebHookEvenType[];
  /**
   * The reason for creating the webhook
   */
  description: string;
  /**
   * The reason for the webhook to be disabled
   */
  disabledReason: string;
  /**
   * The id of the user that created the webhook
   */
  createdByUserId: string;
  /**
   * The id of the user that last updated the webhook
   */
  updatedByUserId: string;
  /**
   * The unique code for the reason
   */
  disabledReasonCode: string;
}

// remove id property and make all the rest optional
export type IWebHookUpdate = Partial<Omit<IWebHook, "id">>;

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
    body: object;
  };
  response: {
    statusCode: number;
    headers: {
      [k: string]: string;
    };
    body: string;
  };
}

export interface IWebHookPatch {
  op: "add" | "remove" | "replace";
  path:
    | "name"
    | "description"
    | "url"
    | "evenTypes"
    | "headers"
    | "enabled"
    | "secret";
  value?: string | number | object | boolean;
}

export class WebHook {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IWebHook;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IWebHook) {
    if (!id) throw new Error(`webHooks.get: "id" parameter is required`);

    this.details = details ?? ({} as IWebHook);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init() {
    if (!this.details || Object.keys(this.details).length == 0) {
      this.details = await this.saasClient
        .Get<IWebHook>(`webhooks/${this.id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`webhooks/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: IWebHookUpdate) {
    this.details = { ...this.details, ...arg };

    return await this.saasClient
      .Put(`webhooks/${this.id}`, this.details)
      .then((res) => res.status);
  }

  async patch(arg: IWebHookPatch[]) {
    return await this.saasClient
      .Patch(
        `/webhooks/${this.id}`,
        arg.map((a) => {
          const o: any = {
            op: a.op,
            path: `/${a.path}`,
          };

          if (a.value) o.value = a.value;

          return o;
        })
      )
      .then((res) => res.status);
  }

  async deliveries() {
    return await this.saasClient
      .Get<IWebHookDelivery[]>(`webhooks/${this.id}/deliveries`)
      .then((res) => res.data);
  }

  async delivery(arg: { id: string }) {
    if (!arg.id)
      throw new Error(`webHook.delivery: "id" parameter is required`);

    return await this.saasClient
      .Get<IWebHookDelivery>(`webhooks/${this.id}/deliveries/${arg.id}`)
      .then((res) => res.data);
  }

  async deliveryResend(arg: { id: string }) {
    if (!arg.id)
      throw new Error(`webHook.deliveryResend: "id" parameter is required`);

    return await this.saasClient
      .Post<IWebHookDelivery>(
        `webhooks/${this.id}/deliveries/${arg.id}/actions/resend`,
        {}
      )
      .then((res) => res.data);
  }
}
