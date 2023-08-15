import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";

import { INotificationItem, Notification } from "./Notification";

export class Notifications {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async getAll(arg?: { locale?: string; subscribable?: "true" | "false" }) {
    const urlBuild = new URLBuild(`notifications`);
    urlBuild.addParam("locale", arg?.locale);
    urlBuild.addParam("subscribable", arg?.subscribable);

    return await this.saasClient
      .Get<{ notifications: INotificationItem[] }>(urlBuild.getUrl())
      .then((res) => res.data.notifications as INotificationItem[])
      .then((data) => data.map((t) => new Notification(this.saasClient, t)));
  }
}
