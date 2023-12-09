import { QlikSaaSClient } from "qlik-rest-api";
import {
  AutomationConnection,
  IAutomationConnection,
} from "./AutomationConnection";

export class AutomationConnections {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async getAll(
    /**
     * One of (default is "id"):
     * 
     * id
     * 
     * name
     * 
     * createdAt
     * 
     * updatedAt
     * 
     * +id
     * 
     * +name
     * 
     * +createdAt
     * 
     * +updatedAt
     * 
     * -id
     * 
     * -name
     * 
     * -createdAt
     * 
     * -updatedAt
     */
    sortBy?: string
  ) {
    const sortByUrlParam = sortBy ? `&sort=${sortBy}` : "";

    return await this.#saasClient
      .Get<IAutomationConnection[]>(
        `automation-connections?limit=50${sortByUrlParam}`
      )
      .then((res) => res.data)
      .then((data) => {
        return data.map(
          (t) => new AutomationConnection(this.#saasClient, t.id, t)
        );
      });
  }
}
