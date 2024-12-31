import { QlikSaaSClient } from "qlik-rest-api";

export interface IML_DeploymentBatchPrediction_Actions_Predict {
  id: string;
  type: "job";
  attributes: {
    id: string;
    name: string;
    corrId: string;
    status: "pending" | "completed" | "cancelled" | "error";
    details: {
      isScheduled: boolean;
      outputFiles: {
        key: string;
        path: string;
        spaceId: string;
        fileName: string;
        fileType: string;
      }[];
      lineageSchemaUpdated: boolean;
    };
    jobType: "prediction";
    modelId: string;
    success: boolean;
    trigger: string;
    corrType: "batch-prediction" | "experiment-version";
    tenantId: string;
    createdAt: string;
    createdBy: string;
    deletedAt: string;
    updatedAt: string;
    parentName: string;
    parentJobId: string;
    deploymentId: string;
    rowsPredicted: number;
    experimentVersionNumber: string;
  };
}

export class ML_DeploymentBatchPrediction_Actions {
  #id: string;
  #deploymentId: string;
  #saasClient: QlikSaaSClient;

  constructor(saasClient: QlikSaaSClient, id: string, deploymentId: string) {
    this.#id = id;
    this.#deploymentId = deploymentId;
    this.#saasClient = saasClient;
  }

  async predict(): Promise<IML_DeploymentBatchPrediction_Actions_Predict> {
    return await this.#saasClient
      .Post<IML_DeploymentBatchPrediction_Actions_Predict>(
        `ml/deployments/${this.#deploymentId}/batch-predictions/${
          this.#id
        }/actions/predict`,
        {}
      )
      .then((res) => res.data);
  }
}
