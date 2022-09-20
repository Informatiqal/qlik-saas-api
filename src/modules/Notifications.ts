import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";

import {
  INotificationItem,
  INotificationItems,
  Notification,
} from "./Notification";

export interface IClassNotifications {
  getAll(): Promise<Notification[]>;
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
      .Get<INotificationItems>(urlBuild.getUrl())
      .then((res) => res.data.notifications)
      .then((data) => data.map((t) => new Notification(this.saasClient, t)));
  }
}
