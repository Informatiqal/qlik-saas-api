import { QlikSaaSClient } from "qlik-rest-api";
// import { ML_Deployment_RealtimePredictionsActions } from "./ML_Deployments_RealtimePredictionsActions";
import {
  IML_DeploymentBatchPrediction,
  ML_DeploymentBatchPrediction,
} from "./BatchPredictions/ML_Deployments_BatchPrediction";

export interface IML_DeploymentBatchPredictionCreate {
  attributes: {
    name: string;
    schedule: {
      timezone: string;
      startDateTime: string;
      recurrence?: string[];
      endDateTime?: string;
      applyDatasetChangeOnly?: boolean;
    };
    dataSetId: string;
    writeback: {
      format: "csv" | "parquet" | "qvd";
      spaceId: string;
      dstName?: string;
      dstShapName?: string;
      dstSourceName?: string;
      dstCoordShapName?: string;
      dstNotPredictedName?: string;
    };
    description: string;
    indexColumn: string;
    deploymentId: string;
  };
}

export class ML_DeploymentBatchPredictions {
  #id: string;
  #saasClient: QlikSaaSClient;

  constructor(saasClient: QlikSaaSClient, id: string) {
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(
        `machineLearning.deployments.batchPredictions.get: "id" parameter is required`
      );

    const batchPrediction: ML_DeploymentBatchPrediction =
      new ML_DeploymentBatchPrediction(this.#saasClient, arg.id, this.#id);
    await batchPrediction.init();

    return batchPrediction;
  }

  async getAll(): Promise<ML_DeploymentBatchPrediction[]> {
    return await this.#saasClient
      .Get<IML_DeploymentBatchPrediction[]>(
        `ml/deployments/${this.#id}/batch-predictions?limit=50`
      )
      .then((res) => res.data)
      .then((data) =>
        data.map(
          (t) => new ML_DeploymentBatchPrediction(this.#saasClient, t.id, t)
        )
      );
  }

  async getFilter(arg: {
    filter: string;
  }): Promise<ML_DeploymentBatchPrediction[]> {
    if (!arg.filter)
      throw new Error(
        `machineLearning.deployments.batchPredictions.getFilter: "filter" parameter is required`
      );

    return await this.#saasClient
      .Get<IML_DeploymentBatchPrediction[]>(
        `ml/deployments/${this.#id}/batch-predictions?limit=50&filter=${
          arg.filter
        }`
      )
      .then((res) => res.data)
      .then((data) =>
        data.map(
          (t) => new ML_DeploymentBatchPrediction(this.#saasClient, t.id, t)
        )
      );
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `machineLearning.deployments.batchPredictions.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async create(arg: IML_DeploymentBatchPredictionCreate) {
    if (!arg.attributes)
      throw new Error(
        `ml_deployments.create: "attributes" parameter is required`
      );

    return await this.#saasClient
      .Post<IML_DeploymentBatchPrediction>(
        `ml/deployments/${this.#id}/batch-predictions`,
        {
          data: { type: "batch-prediction", ...arg },
        }
      )
      .then(
        (res) =>
          new ML_DeploymentBatchPrediction(
            this.#saasClient,
            res.data.id,
            res.data
          )
      );
  }
}
