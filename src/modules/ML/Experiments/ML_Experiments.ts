import { QlikSaaSClient } from "qlik-rest-api";
import { IML_Experiment, ML_Experiment } from "./ML_Experiment";
import { parseFilter } from "../../../util/filter";

export class ML_Experiments {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(
        `machineLearning.experiments.get: "id" parameter is required`
      );

    const app: ML_Experiment = new ML_Experiment(this.#saasClient, arg.id);
    await app.init();

    return app;
  }

  async getAll(): Promise<ML_Experiment[]> {
    return await this.#saasClient
      .Get<IML_Experiment[]>(`ml/experiments?limit=50`)
      .then((res) => res.data)
      .then((data) => {
        return data.map(
          (t) => new ML_Experiment(this.#saasClient, t.resourceId, t)
        );
      });
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `machineLearning.experiments.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as ML_Experiment[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `machineLearning.experiments.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async create(arg: { name: string; spaceId: string; description?: string }) {
    if (!arg.name)
      throw new Error(
        `machineLearning.experiments.create: "name" parameter is required`
      );

    if (!arg.spaceId)
      throw new Error(
        `machineLearning.experiments.create: "spaceId" parameter is required`
      );

    return await this.#saasClient
      .Post<IML_Experiment>(`ml/experiments`, {
        data: { type: "experiment", ...arg },
      })
      .then(
        (res) => new ML_Experiment(this.#saasClient, res.data.id, res.data)
      );
  }
}
