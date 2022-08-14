import { QlikSaaSClient } from "qlik-rest-api";
import {
  IClassNotificationDigest,
  INotificationDigest,
  NotificationDigest,
} from "./NotificationDigest";

export interface IClassNotificationDigests {
  get(id: string): Promise<IClassNotificationDigest>;
  getAll(): Promise<IClassNotificationDigest[]>;
}

export class NotificationDigests implements IClassNotificationDigests {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id)
      throw new Error(`notificationDigests.get: "id" parameter is required`);
    const nd: NotificationDigest = new NotificationDigest(this.saasClient, id);
    await nd.init();

    return nd;
  }

  async getAll() {
    return await this.saasClient
      .Get(`notification-digests`)
      .then((res) => res.data as INotificationDigest[])
      .then((data) => {
        let a = 1;
        return data.map(
          (t) => new NotificationDigest(this.saasClient, t.id, t)
        );
      });
  }
}
