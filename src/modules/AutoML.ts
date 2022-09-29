import { QlikSaaSClient } from "qlik-rest-api";
import { AutoMLDeployments } from "./AutoMLDeployments";
import { AutoMLPredictions } from "./AutoMLPredictions";

export interface IClassAutoML {
  predictions: AutoMLPredictions;
  deployments: AutoMLDeployments;
}

export class AutoML implements IClassAutoML {
  private saasClient: QlikSaaSClient;
  predictions: AutoMLPredictions;
  deployments: AutoMLDeployments;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
    this.predictions = new AutoMLPredictions(this.saasClient);
    this.deployments = new AutoMLDeployments(this.saasClient);
  }
}
