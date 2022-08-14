import { QlikSaaSClient } from "qlik-rest-api";

export interface INotificationDigest {
  id: string;
  enabled: boolean;
  ownerId: string;
  tenantId: string;
  timezone: string;
  frequency: string;
  startTime: string;
  chronosJobId: string;
  currentWorkflowId: string;
}

export interface IClassNotificationDigest {
  details: INotificationDigest;
}

export class NotificationDigest implements IClassNotificationDigest {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: INotificationDigest;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: INotificationDigest
  ) {
    if (!id)
      throw new Error(`notificationDigest.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`notification-digests/${this.id}`)
        .then((res) => res.data as INotificationDigest);
    }
  }
}
