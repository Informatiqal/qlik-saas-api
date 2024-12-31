import { QlikSaaSClient } from "qlik-rest-api";
import { ML_Experiment_Models } from "./ML_Experiment_Models";
import { ML_Experiment_Versions } from "./ML_Experiment_Versions";

export interface IML_Experiment {
  id: string;
  type: "experiment";
  attributes: {
    id: string;
    name: string;
    ownerId: string;
    spaceId: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    description: string;
  };
}

export interface IML_Experiment_Update {
  path: "name" | "description" | "spaceId";
  value: any;
}

export class ML_Experiment {
  #id: string;
  #saasClient: QlikSaaSClient;
  models: ML_Experiment_Models;
  versions: ML_Experiment_Versions;
  details: IML_Experiment;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IML_Experiment
  ) {
    if (!id)
      throw new Error(
        `machineLearning.experiments.get: "id" parameter is required`
      );

    this.details = details ?? ({} as IML_Experiment);
    this.#id = id;
    this.#saasClient = saasClient;
    this.models = new ML_Experiment_Models(this.#saasClient, this.#id);
    this.versions = new ML_Experiment_Versions(this.#saasClient, this.#id);
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IML_Experiment>(`ml/experiments/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`ml/experiments/${this.#id}`)
      .then((res) => res.status);
  }

  async update(arg: IML_Experiment_Update[]) {
    if (!Array.isArray(arg))
      throw new Error(
        `machineLearning.experiments.update: argument should be an array`
      );

    const body = arg.map((a) => ({ ...a, op: "replace" }));

    let updateStatus = 0;

    return this.#saasClient
      .Patch<number>(`ml/experiments/${this.#id}`, body)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
