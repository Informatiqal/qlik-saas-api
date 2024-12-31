import { QlikSaaSClient } from "qlik-rest-api";
import {
  IML_Experiment_Version,
  ML_Experiment_Version,
} from "./ML_Experiment_Version";

export interface IML_ExperimentVersionCreate {
  attributes: {
    name: string;
    target: string;
    dataSetId: string;
    algorithms?: (
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
    dateIndexes: string[];
    featuresList?: {
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
    datasetOrigin: "new" | "changed" | "refreshed" | "same";
    experimentMode: "intelligent" | "manual" | "manual_hpo";
    experimentType: "binary" | "multiclass" | "regression";
    trainingDuration?: number;
  };
}

export class ML_Experiment_Versions {
  #saasClient: QlikSaaSClient;
  #experimentId: string;
  constructor(saasClient: QlikSaaSClient, experimentId: string) {
    this.#saasClient = saasClient;
    this.#experimentId = experimentId;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(
        `machineLearning.experiments.versions.get: "id" parameter is required`
      );

    const version: ML_Experiment_Version = new ML_Experiment_Version(
      this.#saasClient,
      arg.id,
      this.#experimentId
    );
    await version.init();

    return version;
  }

  async getAll(): Promise<ML_Experiment_Version[]> {
    return await this.#saasClient
      .Get<IML_Experiment_Version[]>(
        `ml/experiments/${this.#experimentId}/versions?limit=50`
      )
      .then((res) => res.data)
      .then((data) =>
        data.map(
          (t) =>
            new ML_Experiment_Version(
              this.#saasClient,
              t.id,
              this.#experimentId,
              t
            )
        )
      );
  }

  async getFilter(arg: { filter: string }): Promise<ML_Experiment_Version[]> {
    if (!arg.filter)
      throw new Error(
        `machineLearning.experiments.versions.getFilter: "filter" parameter is required`
      );

    return await this.#saasClient
      .Get<IML_Experiment_Version[]>(
        `ml/experiments/${this.#experimentId}/versions?limit=50&filter=${
          arg.filter
        }`
      )
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new ML_Experiment_Version(this.#saasClient, t.id, t))
      );
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `machineLearning.experiments.versions.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async create(arg: IML_ExperimentVersionCreate) {
    if (!arg.attributes)
      throw new Error(
        `machineLearning.experiments.versions.create: "attributes" parameter is required`
      );

    if (!arg.attributes.name)
      throw new Error(
        `machineLearning.experiments.versions.create: "attributes.name" parameter is required`
      );
    if (!arg.attributes.target)
      throw new Error(
        `machineLearning.experiments.versions.create: "attributes.target" parameter is required`
      );

    if (!arg.attributes.dataSetId)
      throw new Error(
        `machineLearning.experiments.versions.create: "attributes.dataSetId" parameter is required`
      );

    if (!arg.attributes.featuresList)
      throw new Error(
        `machineLearning.experiments.versions.create: "attributes.featuresList" parameter is required`
      );

    if (!arg.attributes.experimentMode)
      throw new Error(
        `machineLearning.experiments.versions.create: "attributes.experimentMode" parameter is required`
      );
    if (!arg.attributes.experimentType)
      throw new Error(
        `machineLearning.experiments.versions.create: "attributes.experimentType" parameter is required`
      );

    return await this.#saasClient
      .Post<IML_Experiment_Version>(
        `ml/experiments/${this.#experimentId}/versions`,
        {
          data: { type: "experiment-version", ...arg },
        }
      )
      .then(
        (res) =>
          new ML_Experiment_Version(this.#saasClient, res.data.id, res.data)
      );
  }
}
