import { QlikSaaSClient } from "qlik-rest-api";
import { AutoMLPrediction, IAutoMLPrediction } from "./AutoMLPrediction";

export interface IClassAutoMLPredictions {
  get(id: string): Promise<AutoMLPrediction>;
  getAll(): Promise<AutoMLPrediction[]>;
}

export class AutoMLPredictions implements IClassAutoMLPredictions {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id)
      throw new Error(`autoML.predictions.get: "id" parameter is required`);
    const prediction: AutoMLPrediction = new AutoMLPrediction(
      this.saasClient,
      id
    );
    await prediction.init();

    return prediction;
  }

  async getAll() {
    return await this.saasClient
      .Get<IAutoMLPrediction[]>(`items?resourceType=automl-experiment`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new AutoMLPrediction(this.saasClient, t.id, t))
      );
  }
}
