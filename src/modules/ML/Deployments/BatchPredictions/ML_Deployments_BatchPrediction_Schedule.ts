import { QlikSaaSClient } from "qlik-rest-api";

export interface IML_DeploymentBatchPrediction_Schedule {
  id: string;
  type: "batch-prediction-schedule";
  attributes: {
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
}

export interface IML_DeploymentBatchPrediction_Schedule_Update {
  path:
    | "startDateTime"
    | "endDateTime"
    | "timezone"
    | "recurrence"
    | "applyDatasetChangeOnly";
  value: any;
}

export class ML_DeploymentBatchPrediction_Schedule {
  #batchPredictionId: string;
  #deploymentId: string;
  #saasClient: QlikSaaSClient;
  details: IML_DeploymentBatchPrediction_Schedule;

  constructor(
    saasClient: QlikSaaSClient,
    deploymentId: string,
    batchPredictionId: string,
    details?: IML_DeploymentBatchPrediction_Schedule
  ) {
    this.details = details ?? ({} as IML_DeploymentBatchPrediction_Schedule);
    this.#deploymentId = deploymentId;
    this.#batchPredictionId = batchPredictionId;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IML_DeploymentBatchPrediction_Schedule>(
          `ml/deployments/${this.#deploymentId}/batch-predictions/${
            this.#batchPredictionId
          }/schedule`
        )
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(
        `ml/deployments/${this.#deploymentId}/batch-predictions/${
          this.#batchPredictionId
        }/schedule`
      )
      .then((res) => res.status);
  }

  async update(arg: IML_DeploymentBatchPrediction_Schedule_Update[]) {
    if (!Array.isArray(arg))
      throw new Error(
        `machineLearning.deployments.batchPredictions.schedules.update: argument should be an array`
      );

    const body = arg.map((a) => ({ ...a, op: "replace" }));

    let updateStatus = 0;

    return this.#saasClient
      .Patch<number>(
        `ml/deployments/${this.#deploymentId}/batch-predictions/${
          this.#batchPredictionId
        }/schedule`,
        body
      )
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
