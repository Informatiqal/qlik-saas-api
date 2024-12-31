import { QlikSaaSClient } from "qlik-rest-api";
import {
  IML_DeploymentBatchPrediction_Schedule,
  ML_DeploymentBatchPrediction_Schedule,
} from "./ML_Deployments_BatchPrediction_Schedule";

export interface IML_DeploymentBatchPrediction {
  id: string;
  type: string;
  attributes: {
    id: string;
    name: string;
    errors: string;
    status: "modified" | "ready" | "error" | "cancelled" | "pending";
    ownerId: string;
    schedule: {
      status:
        | "pending"
        | "active"
        | "error"
        | "error_scheduler_unreachable"
        | "error_scheduler_callback_error"
        | "licence_advanced_features_required"
        | "failing_schedule_permission";
      timezone: string;
      recurrence: string[][];
      endDateTime: string;
      chronosJobId: string;
      startDateTime: string;
      failureAttempts: number;
      applyDatasetChangeOnly: boolean;
      lastSuccessfulDateTime: string;
    };
    createdAt: string;
    createdBy: string;
    dataSetId: string;
    datasetId: string;
    updatedAt: string;
    writeback: {
      format: "csv" | "parquet" | "qvd";
      dstName: string;
      spaceId: string;
      dstShapName: string;
      dstSourceName: string;
      dstCoordShapName: string;
      dstNotPredictedName: string;
    };
    indexColumn: string;
    deploymentId: string;
    errorMessage: string;
    outputDataset: string;
  };
}

export interface IML_BatchPrediction_Update {
  path:
    | "name"
    | "description"
    | "dataSetId"
    | "outputDataset"
    | "indexColumn"
    | "applyDatasetChangeOnly"
    | "ownerId"
    | "/writeback/spaceId"
    | "/writeback/format"
    | "/writeback/dstName"
    | "/writeback/dstShapName"
    | "/writeback/dstCoordShapName"
    | "/writeback/dstNotPredictedName"
    | "/writeback/dstSourceName";
  value: any;
}

export interface IML_DeploymentBatchPrediction_Schedule_Create {
  timezone: string;
  recurrence: string[];
  endDateTime: string;
  startDateTime: string;
  applyDatasetChangeOnly: boolean;
}

export class ML_DeploymentBatchPrediction_Schedules {
  #id: string;
  #deploymentId: string;
  #saasClient: QlikSaaSClient;

  constructor(saasClient: QlikSaaSClient, id: string, deploymentId: string) {
    if (!id)
      throw new Error(
        `machineLearning.deployments.batchPredictions.schedules.get: "id" parameter is required`
      );

    this.#id = id;
    this.#deploymentId = deploymentId;
    this.#saasClient = saasClient;
  }

  async get() {
    const ml_schedule: ML_DeploymentBatchPrediction_Schedule =
      new ML_DeploymentBatchPrediction_Schedule(
        this.#saasClient,
        this.#deploymentId,
        this.#id
      );
    await ml_schedule.init();

    return ml_schedule;
  }

  async create(arg: IML_DeploymentBatchPrediction_Schedule_Create) {
    if (!arg.timezone)
      throw new Error(
        `machineLearning.deployments.batchPredictions.schedules.create: "timezone" parameter is required`
      );
    if (!arg.startDateTime)
      throw new Error(
        `machineLearning.deployments.batchPredictions.schedules.type: "startDateTime" parameter is required`
      );

    return await this.#saasClient
      .Post<IML_DeploymentBatchPrediction_Schedule>(
        `ml/deployments/${this.#deploymentId}/batch-predictions/${
          this.#id
        }/schedule`,
        arg
      )
      .then(
        (res) =>
          new ML_DeploymentBatchPrediction_Schedule(
            this.#saasClient,
            this.#deploymentId,
            this.#id,
            res.data
          )
      );
  }
}
