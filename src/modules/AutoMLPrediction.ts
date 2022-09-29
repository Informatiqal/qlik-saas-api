import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { IItem } from "./Item";

export interface IAutoLMPredictionJob {
  id: string;
  corrId: string;
  status: "pending" | "completed" | "cancelled";
  jobType:
    | "preprocess_dataset"
    | "dataset_conversion"
    | "train_model"
    | "predict_dataset"
    | "prediction"
    | "data_sync";
  corrType:
    | "experiment_version"
    | "model"
    | "prediction"
    | "deployment"
    | "realtime_prediction";
  tenantId: string;
  createdAt: string;
  createdBy: string;
  deletedAt: string;
  updatedAt: string;
  parentJobId: string;
}

export interface IAutoMLPrediction extends IItem {}

export interface IClassAutoMLPrediction {
  details: IAutoMLPrediction;
  /**
   * Return a file containing the shapley values in coordinate form that are associated with a predictionId.
   */
  coordinateShap(arg?: { refId?: string }): Promise<string>;
  /**
   * Retrieve jobs that are associated with a prediction. Job with correlation type "prediction"
   */
  jobs(): Promise<IAutoLMPredictionJob>;
  /**
   * Return a file containing any rows in a prediction operation where a prediction was unable to be produced.
   */
  notPredictedReasons(arg?: { refId?: string }): Promise<string>;
  /**
   * Return a file containing the predicted values that are associated with a predictionId.
   */
  predictions(arg?: { refId?: string }): Promise<string>;
  /**
   * Return a file containing the shapley values that are associated with a predictionId.
   */
  shap(arg?: { refId?: string }): Promise<string>;
  /**
   * Return a file containing the source values and an index field that are associated with a predictionId .
   */
  source(arg?: { refId?: string }): Promise<string>;
}

export class AutoMLPrediction implements IClassAutoMLPrediction {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IAutoMLPrediction;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IAutoMLPrediction
  ) {
    if (!id)
      throw new Error(`autoML.predictions.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<IAutoMLPrediction>(`items/${this.id}`)
        .then((res) => res.data);
    }
  }

  async coordinateShap(arg?: { refId?: string }) {
    const urlBuild = new URLBuild(
      `automl-predictions/${this.id}/coordinate-shap`
    );
    urlBuild.addParam("refId", arg?.refId);

    return await this.saasClient
      .Get<string>(`${urlBuild.getUrl()}`)
      .then((res) => res.data);
  }

  async jobs() {
    return await this.saasClient
      .Post<IAutoLMPredictionJob>(`automl-predictions/${this.id}/jobs}`, {})
      .then((res) => res.data);
  }

  async notPredictedReasons(arg?: { refId?: string }) {
    const urlBuild = new URLBuild(
      `automl-predictions/${this.id}/not-predicted-reasons}`
    );
    urlBuild.addParam("refId", arg?.refId);

    return await this.saasClient
      .Get<string>(`${urlBuild.getUrl()}`)
      .then((res) => res.data);
  }

  async predictions(arg?: { refId?: string }) {
    const urlBuild = new URLBuild(`automl-predictions/${this.id}/predictions}`);
    urlBuild.addParam("refId", arg?.refId);

    return await this.saasClient
      .Get<string>(`${urlBuild.getUrl()}`)
      .then((res) => res.data);
  }

  async shap(arg?: { refId?: string }) {
    const urlBuild = new URLBuild(`automl-predictions/${this.id}/shap}`);
    urlBuild.addParam("refId", arg?.refId);

    return await this.saasClient
      .Get<string>(`${urlBuild.getUrl()}`)
      .then((res) => res.data);
  }

  async source(arg?: { refId?: string }) {
    const urlBuild = new URLBuild(`automl-predictions/${this.id}/source}`);
    urlBuild.addParam("refId", arg?.refId);

    return await this.saasClient
      .Get<string>(`${urlBuild.getUrl()}`)
      .then((res) => res.data);
  }
}
