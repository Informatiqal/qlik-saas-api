import { QlikSaaSClient } from "qlik-rest-api";

export interface IAutomationConnection {
  /**
   * The unique identifier of an automation connection.
   */
  id: string;
  /**
   * The name of an automation connection.
   */
  name: string;
  /**
   * The unique identifier of the owner of the automation connection.
   */
  ownerId: string;
  /**
   * The timestamp when the automation connection is created.
   */
  createdAt: string;
  /**
   * The timestamp when the automation connection is updated.
   */
  updatedAt: string;
  /**
   * The unique identifier of the connector the automation connection is created from.
   */
  connectorId: string;
  /**
   * Returns true if the automation connection is connected.
   */
  isConnected: boolean;
}

export class AutomationConnection {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IAutomationConnection;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IAutomationConnection
  ) {
    if (!id)
      throw new Error(`automationConnection.get: "id" parameter is required`);

    this.details = details ?? ({} as IAutomationConnection);
    this.#id = id;
    this.#saasClient = saasClient;
  }
}
