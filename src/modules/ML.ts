import { QlikSaaSClient } from "qlik-rest-api";
import { ML_Deployments } from "./ML/Deployments/ML_Deployments";
import { ML_Experiments } from "./ML/Experiments/ML_Experiments";
import { ML_Profile_Insights } from "./ML/ML_Profile_Insights";
import { ML_Jobs } from "./ML/ML_Jobs";

export class ML {
  #saasClient: QlikSaaSClient;
  deployments: ML_Deployments;
  experiments: ML_Experiments;
  profileInsights: ML_Profile_Insights;
  jobs: ML_Jobs;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
    this.deployments = new ML_Deployments(saasClient);
    this.experiments = new ML_Experiments(saasClient);
    this.profileInsights = new ML_Profile_Insights(saasClient, "");
    this.jobs = new ML_Jobs(saasClient, "");
  }
}
