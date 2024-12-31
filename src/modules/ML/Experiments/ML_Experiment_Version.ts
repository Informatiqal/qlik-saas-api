import { QlikSaaSClient } from "qlik-rest-api";

export interface IML_Experiment_Version {
  id: string;
  type: "experiment-version";
  attributes: {
    id: string;
    name: string;
    errors: string;
    status: "ready" | "error" | "cancelled" | "pending";
    target: string;
    createdAt: string;
    dataSetId: string;
    profileId: string;
    updatedAt: string;
    algorithms: (
      | "catboost_classifier"
      | "catboost_regression"
      | "elasticnet_regression"
      | "gaussian_nb"
      | "kneighbors_classifier"
      | "lasso_regression"
      | "lasso"
      | "lgbm_classifier"
      | "lgbm_regression"
      | "linear_regression"
      | "logistic_regression"
      | "random_forest_classifier"
      | "random_forest_regression"
      | "sgd_regression"
      | "xgb_classifier"
      | "xgb_regression"
    )[];
    topModelId: string;
    dateIndexes: string[];
    errorMessage: string;
    experimentId: string;
    featuresList: {
      name: string;
      include: boolean;
      dataType:
        | "DATE"
        | "TIME"
        | "DATETIME"
        | "TIMESTAMP"
        | "STRING"
        | "DOUBLE"
        | "DECIMAL"
        | "INTEGER"
        | "BOOLEAN"
        | "BINARY"
        | "CUSTOM"
        | "FLOAT"
        | "OBJECT";
      changeType: "categorical" | "numeric" | "date" | "freetext";
      featureType: "categorical" | "numeric" | "date" | "freetext";
      parentFeature: string;
    }[];
    lastBatchNum: number;
    datasetOrigin: "new" | "changed" | "refreshed" | "same";
    versionNumber: number;
    experimentMode: "intelligent" | "manual" | "manual_hpo";
    experimentType: "binary" | "multiclass" | "regression";
    createdByUserId: string;
    trainingDuration: number;
    preprocessedInsights: {
      name: string;
      insights: (
        | "is_free_text"
        | "cannot_be_processed_as_free_text"
        | "is_date_engineered"
        | "has_target_leakage"
        | "feature_type_change_invalid"
        | "feature_type_change_failed"
        | "feature_type_change_successful"
      )[];
      willBeDropped: true;
    }[];
  };
}

export interface IML_Experiment_Version_Update {
  path: "name";
  value: any;
}

export class ML_Experiment_Version {
  #id: string;
  #saasClient: QlikSaaSClient;
  #experimentId: string;
  details: IML_Experiment_Version;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    experimentId: string,
    details?: IML_Experiment_Version
  ) {
    if (!id)
      throw new Error(
        `machineLearning.experiments.versions.get: "id" parameter is required`
      );

    this.details = details ?? ({} as IML_Experiment_Version);
    this.#id = id;
    this.#experimentId = experimentId;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IML_Experiment_Version>(
          `ml/experiments/${this.#experimentId}/versions/${this.#id}`
        )
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`ml/experiments/${this.#experimentId}/versions/${this.#id}`)
      .then((res) => res.status);
  }

  async cancel() {
    return await this.#saasClient
      .Delete(`ml/jobs/experiment-version/${this.#id}/actions/cancel`)
      .then((res) => res.status);
  }

  async update(arg: IML_Experiment_Version_Update[]) {
    if (!Array.isArray(arg))
      throw new Error(
        `machineLearning.experiments.versions.update: argument should be an array`
      );

    const body = arg.map((a) => ({ ...a, op: "replace" }));

    let updateStatus = 0;

    return this.#saasClient
      .Patch<number>(
        `ml/experiments/${this.#experimentId}/versions/${this.#id}`,
        body
      )
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
