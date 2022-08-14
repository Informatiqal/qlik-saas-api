import { QlikSaaSClient } from "qlik-rest-api";

export interface INotificationItem {
  notificationNamePattern: string;
  transports: string[];
  isSubscribable: boolean;
  presentationInfo?: {
    scopes: string[];
    friendlyName: string;
    scopeFriendlyNames: object;
  };
  subscriptionInfo?: {
    action: string;
    target?: string;
    resourceId?: string;
    resourceType: string;
    resourceSubType?: string;
  };
}

export interface IClassNotification {
  details: INotificationItem;
}

export class Notification implements IClassNotification {
  private saasClient: QlikSaaSClient;
  details: INotificationItem;
  constructor(saasClient: QlikSaaSClient, details?: INotificationItem) {
    this.saasClient = saasClient;
    if (details) this.details = details;
  }
}
