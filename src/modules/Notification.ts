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

export class Notification {
  private saasClient: QlikSaaSClient;
  details: INotificationItem;
  constructor(saasClient: QlikSaaSClient, details?: INotificationItem) {
    this.saasClient = saasClient;
    this.details = details ?? ({} as INotificationItem);
  }
}
