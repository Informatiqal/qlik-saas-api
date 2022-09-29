import { QlikSaaSClient } from "qlik-rest-api";
import { AutoMLDeployment, IAutoMLDeployment } from "./AutoMLDeployment";

export interface IClassAutoMLDeployments {
  get(id: string): Promise<AutoMLDeployment>;
  getAll(): Promise<AutoMLDeployment[]>;
}

export class AutoMLDeployments implements IClassAutoMLDeployments {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id)
      throw new Error(`autoML.deployments.get: "id" parameter is required`);
    const deployment: AutoMLDeployment = new AutoMLDeployment(
      this.saasClient,
      id
    );
    await deployment.init();

    return deployment;
  }

  async getAll() {
    return await this.saasClient
      .Get<IAutoMLDeployment[]>(`items?resourceType=automl-deployment`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new AutoMLDeployment(this.saasClient, t.id, t))
      );
  }
}
