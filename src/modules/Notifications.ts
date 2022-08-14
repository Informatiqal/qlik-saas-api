import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";

import {
  IClassNotification,
  INotificationItem,
  Notification,
} from "./Notification";

export interface IClassNotifications {
  getAll(): Promise<IClassNotification[]>;
}

export class Notifications implements IClassNotifications {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async getAll(locale?: string, subscribable?: "true" | "false") {
    const urlBuild = new URLBuild(`notifications`);
    urlBuild.addParam("locale", locale);
    urlBuild.addParam("subscribable", subscribable);

    return await this.saasClient
      .Get(urlBuild.getUrl())
      .then((res) => res.data.notifications as INotificationItem[])
      .then((data) => data.map((t) => new Notification(this.saasClient, t)));
  }
}
