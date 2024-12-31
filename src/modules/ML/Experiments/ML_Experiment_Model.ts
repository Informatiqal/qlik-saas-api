import { QlikSaaSClient } from "qlik-rest-api";

export interface IML_Experiment_Model {
  id: string;
  type: "model";
  attributes: {
    id: string;
    name: string;
    errors: string;
    hpoNum: number;
    seqNum: number;
    status:
      | "pending"
      | "training_requested"
      | "training_done"
      | "ready"
      | "error";
    columns: string[];
    metrics: {
      binary: {
        f1: number;
        auc: number;
        mcc: number;
        npv: number;
        f1Test: number;
        recall: number;
        aucTest: number;
        fallout: number;
        logLoss: number;
        mccTest: number;
        npvTest: number;
        accuracy: number;
        missRate: number;
        precision: number;
        threshold: number;
        recallTest: number;
        falloutTest: number;
        logLossTest: number;
        specificity: number;
        accuracyTest: number;
        missRateTest: number;
        trueNegative: number;
        truePositive: number;
        falseNegative: number;
        falsePositive: number;
        precisionTest: number;
        thresholdTest: number;
        specificityTest: number;
        trueNegativeTest: number;
        truePositiveTest: number;
        falseNegativeTest: number;
        falsePositiveTest: number;
      };
      multiclass: {
        f1Macro: number;
        f1Micro: number;
        accuracy: number;
        f1Weighted: number;
        f1MacroTest: number;
        f1MicroTest: number;
        accuracyTest: number;
        f1WeightedTest: number;
        confusionMatrix: string;
        confusionMatrixTest: string;
      };
      regression: {
        r2: number;
        mae: number;
        mse: number;
        rmse: number;
        r2Test: number;
        maeTest: number;
        mseTest: number;
        rmseTest: number;
      };
    };
    batchNum: number;
    algoAbbrv:
      | "CATBC"
      | "CATBR"
      | "ELNC"
      | "GNBC"
      | "LGBMC"
      | "LGBMR"
      | "LINR"
      | "LOGC"
      | "LSOC"
      | "RAFC"
      | "RAFR"
      | "SGDR"
      | "XGBC"
      | "XGBR";
    algorithm: string;
    createdAt: string;
    updatedAt: string;
    modelState: "pending" | "enabled" | "disabled" | "inactive";
    description: string;
    anomalyRatio: number;
    errorMessage: string;
    samplingRatio: number;
    binningFeatures: string[];
    droppedFeatures: [
      {
        name: string;
        reason:
          | "highly_correlated"
          | "has_target_leakage"
          | "is_date_engineered"
          | "feature_with_low_importance";
      }
    ];
    experimentVersionId: string;
    powerTransformFeatures: string[];
    binaryImbalanceSampling: {
      sampleClass: string;
      sampleRatio: number;
      sampleDirection: "up" | "down";
    };
  };
}

export class ML_Experiment_Model {
  #id: string;
  #saasClient: QlikSaaSClient;
  #experimentId: string;
  details: IML_Experiment_Model;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    experimentId: string,
    details?: IML_Experiment_Model
  ) {
    if (!id)
      throw new Error(
        `machineLearning.experiments.get: "id" parameter is required`
      );

    this.details = details ?? ({} as IML_Experiment_Model);
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
        .Get<IML_Experiment_Model>(
          `ml/experiments/${this.#experimentId}/models/${this.#id}`
        )
        .then((res) => res.data);
    }
  }
}
