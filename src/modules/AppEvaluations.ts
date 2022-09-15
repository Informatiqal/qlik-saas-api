import { QlikSaaSClient } from "qlik-rest-api";
import {
  AppEvaluation,
  IClassAppEvaluation,
  IAppEvaluation,
} from "./AppEvaluation";

export interface IClassAppEvaluations {
  getAll(): Promise<IClassAppEvaluation[]>;
  create(): Promise<IClassAppEvaluation>;
}

export class AppEvaluations implements IClassAppEvaluations {
  private saasClient: QlikSaaSClient;
  private appId: string;
  constructor(saasClient: QlikSaaSClient, appId: string) {
    this.saasClient = saasClient;
    this.appId = appId;
  }

  async getAll() {
    return await this.saasClient
      .Get(`/apps/${this.appId}/evaluations?all=true`)
      .then((res) => res.data as IAppEvaluation[])
      .then((data) =>
        data.map((t) => new AppEvaluation(this.saasClient, t.id || t.ID, t))
      );
  }

  async create() {
    return await this.saasClient
      .Post(`/apps/${this.appId}/evaluations`, {})
      .then((res) => new AppEvaluation(this.saasClient, res.data.id, res.data));
  }
}
