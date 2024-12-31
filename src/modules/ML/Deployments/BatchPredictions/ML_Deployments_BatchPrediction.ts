import { QlikSaaSClient } from "qlik-rest-api";
import { ML_DeploymentBatchPrediction_Actions } from "./ML_Deployments_BatchPrediction_Actions";
import { ML_DeploymentBatchPrediction_Schedules } from "./ML_Deployments_BatchPrediction_Schedules";

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

export class ML_DeploymentBatchPrediction {
  #id: string;
  #deploymentId: string;
  #saasClient: QlikSaaSClient;
  details: IML_DeploymentBatchPrediction;
  _actions: ML_DeploymentBatchPrediction_Actions;
  _schedules: ML_DeploymentBatchPrediction_Schedules;

  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    deploymentId: string,
    details?: IML_DeploymentBatchPrediction
  ) {
    if (!id)
      throw new Error(
        `machineLearning.deployments.get: "id" parameter is required`
      );

    this.details = details ?? ({} as IML_DeploymentBatchPrediction);
    this.#id = id;
    this.#deploymentId = deploymentId;
    this.#saasClient = saasClient;
    this._actions = new ML_DeploymentBatchPrediction_Actions(
      this.#saasClient,
      this.#id,
      this.#deploymentId
    );
    this._schedules = new ML_DeploymentBatchPrediction_Schedules(
      this.#saasClient,
      this.#id,
      this.#deploymentId
    );
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IML_DeploymentBatchPrediction>(
          `ml/deployments/${this.#deploymentId}/batch-predictions/${this.#id}`
        )
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(
        `ml/deployments/${this.#deploymentId}/batch-predictions/${this.#id}`
      )
      .then((res) => res.status);
  }

  async update(arg: IML_BatchPrediction_Update[]) {
    if (!Array.isArray(arg))
      throw new Error(
        `machineLearning.deployments.batchPrediction.update: argument should be an array`
      );

    const body = arg.map((a) => ({ ...a, op: "replace" }));

    let updateStatus = 0;

    return this.#saasClient
      .Patch<number>(
        `ml/deployments/${this.#deploymentId}/batch-predictions/${this.#id}`,
        body
      )
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  async cancel() {
    return await this.#saasClient
      .Delete(`ml/jobs/batch-prediction/${this.#id}/actions/cancel`)
      .then((res) => res.status);
  }
}
