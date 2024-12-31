import { QlikSaaSClient } from "qlik-rest-api";
import {
  IML_Experiment_Model,
  ML_Experiment_Model,
} from "./ML_Experiment_Model";

export class ML_Experiment_Models {
  #saasClient: QlikSaaSClient;
  #experimentId: string;
  constructor(saasClient: QlikSaaSClient, experimentId: string) {
    this.#saasClient = saasClient;
    this.#experimentId = experimentId;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(
        `machineLearning.experiments.models.get: "id" parameter is required`
      );

    const model: ML_Experiment_Model = new ML_Experiment_Model(
      this.#saasClient,
      arg.id,
      this.#experimentId
    );
    await model.init();

    return model;
  }

  async getAll(): Promise<ML_Experiment_Model[]> {
    return await this.#saasClient
      .Get<IML_Experiment_Model[]>(`ml/experiments?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map(
          (t) =>
            new ML_Experiment_Model(
              this.#saasClient,
              t.id,
              this.#experimentId,
              t
            )
        )
      );
  }
}
