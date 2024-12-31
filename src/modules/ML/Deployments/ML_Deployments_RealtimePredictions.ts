import { QlikSaaSClient } from "qlik-rest-api";
import { ML_Deployment_RealtimePredictionsActions } from "./ML_Deployments_RealtimePredictionsActions";

export class ML_DeploymentRealtimePredictions {
  #id: string;
  #saasClient: QlikSaaSClient;
  _actions: ML_Deployment_RealtimePredictionsActions;

  constructor(saasClient: QlikSaaSClient, id: string) {
    this.#id = id;
    this.#saasClient = saasClient;
    this._actions = new ML_Deployment_RealtimePredictionsActions(
      this.#saasClient,
      this.#id
    );
  }
}
