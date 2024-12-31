import { QlikSaaSClient } from "qlik-rest-api";

export class ML_DeploymentActions {
  #id: string;
  #saasClient: QlikSaaSClient;

  constructor(saasClient: QlikSaaSClient, id: string) {
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async activateModels() {
    return this.#saasClient
      .Post(`ml/deployments/${this.#id}/actions/activate-models`, {})
      .then((res) => res.status);
  }

  async deactivateModels() {
    return this.#saasClient
      .Post(`ml/deployments/${this.#id}/actions/deactivate-models`, {})
      .then((res) => res.status);
  }
}
