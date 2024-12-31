import { QlikSaaSClient } from "qlik-rest-api";
import { ML_DeploymentActions } from "./ML_DeploymentActions";
import { ML_DeploymentRealtimePredictions } from "./ML_Deployments_RealtimePredictions";
import { ML_DeploymentBatchPredictions } from "./ML_Deployments_BatchPredictions";

export interface IML_Deployment {
  id: string;
  type: string;
  attributes: {
    id: string;
    name: string;
    modelId: string;
    ownerId: string;
    spaceId: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    deprecated: boolean;
    description: string;
    errorMessage: string;
    enabledPredictions: boolean;
    errors: string;
  };
}

export interface IML_Update {
  path: "name" | "description" | "spaceId";
  value: any;
}

export class ML_Deployment {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IML_Deployment;
  _actions: ML_DeploymentActions;
  realTimePredictions: ML_DeploymentRealtimePredictions;
  batchPredictions: ML_DeploymentBatchPredictions;

  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IML_Deployment
  ) {
    if (!id)
      throw new Error(
        `machineLearning.deployments.get: "id" parameter is required`
      );

    this.details = details ?? ({} as IML_Deployment);
    this.#id = id;
    this.#saasClient = saasClient;
    this._actions = new ML_DeploymentActions(this.#saasClient, this.#id);
    this.realTimePredictions = new ML_DeploymentRealtimePredictions(
      this.#saasClient,
      this.#id
    );
    this.batchPredictions = new ML_DeploymentBatchPredictions(
      this.#saasClient,
      this.#id
    );    
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IML_Deployment>(`ml/deployments/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`ml/deployments/${this.#id}`)
      .then((res) => res.status);
  }

  async update(arg: IML_Update[]) {
    if (!Array.isArray(arg))
      throw new Error(
        `machineLearning.deployments.update: argument should be an array`
      );

    const body = arg.map((a) => ({ ...a, op: "replace" }));

    let updateStatus = 0;

    return this.#saasClient
      .Patch<number>(`ml/deployments/${this.#id}`, body)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
