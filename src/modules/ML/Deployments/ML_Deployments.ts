import { QlikSaaSClient } from "qlik-rest-api";
import { IML_Deployment, ML_Deployment } from "./ML_Deployment";

export interface IML_DeploymentCreate {
  attributes: {
    name: string;
    modelId: string;
    spaceId: string;
    deprecated?: boolean;
    description?: string;
    enablePredictions?: boolean;
  };
}

export class ML_Deployments {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(
        `machineLearning.deployments.get: "id" parameter is required`
      );

    const deployment: ML_Deployment = new ML_Deployment(
      this.#saasClient,
      arg.id
    );
    await deployment.init();

    return deployment;
  }

  async getAll(): Promise<ML_Deployment[]> {
    return await this.#saasClient
      .Get<IML_Deployment[]>(`ml/deployments?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new ML_Deployment(this.#saasClient, t.id, t))
      );
  }

  async getFilter(arg: { filter: string }): Promise<ML_Deployment[]> {
    if (!arg.filter)
      throw new Error(
        `machineLearning.deployments.getFilter: "filter" parameter is required`
      );

    return await this.#saasClient
      .Get<IML_Deployment[]>(`ml/deployments?limit=50&filter=${arg.filter}`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new ML_Deployment(this.#saasClient, t.id, t))
      );
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `machineLearning.deployments.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async create(arg: IML_DeploymentCreate) {
    if (!arg.attributes)
      throw new Error(
        `machineLearning.deployments.create: "attributes" parameter is required`
      );
    if (!arg.attributes.name)
      throw new Error(
        `machineLearning.deployments.create: "attributes.name" parameter is required`
      );
    if (!arg.attributes.modelId)
      throw new Error(
        `machineLearning.deployments.create: "attributes.modelId" parameter is required`
      );
    if (!arg.attributes.spaceId)
      throw new Error(
        `machineLearning.deployments.create: "attributes.spaceId" parameter is required`
      );

    return await this.#saasClient
      .Post<IML_Deployment>(`ml/deployments`, { data: { type: "deployment", ...arg } })
      .then(
        (res) => new ML_Deployment(this.#saasClient, res.data.id, res.data)
      );
  }
}
