import { QlikSaaSClient } from "qlik-rest-api";
import { Evaluation, IClassEvaluation, IEvaluation } from "./Evaluation";

export interface IEvaluationGetAll {
  itemid?: string;
  appid?: string;
  filemode?: boolean;
}

export interface IClassEvaluations {
  get(id: string): Promise<Evaluation>;
  getAll(arg: IEvaluationGetAll): Promise<Evaluation[]>;
  create(appid: string, itemid: string): Promise<Evaluation>;
}

export class Evaluations implements IClassEvaluations {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`evaluations.get: "id" parameter is required`);
    const evaluation: Evaluation = new Evaluation(this.saasClient, id);
    await evaluation.init();

    return evaluation;
  }

  async getAll(arg: IEvaluationGetAll) {
    if (!arg.appid && !arg.itemid)
      throw new Error(
        `evaluations.getAll: "appid" or/and "itemid" parameters are required`
      );

    return await this.saasClient
      .Get<IEvaluation[]>(`evaluations`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new Evaluation(this.saasClient, t.id, t))
      );
  }

  async create(appid: string, itemid: string) {
    if (!appid)
      throw new Error(`evaluations.getAll: "appid" parameter is required`);
    if (!itemid)
      throw new Error(`evaluations.getAll: "itemid" parameters is required`);

    return await this.saasClient
      .Post<IEvaluation>(`evaluations`, { appid, itemid })
      .then((res) => new Evaluation(this.saasClient, res.data.id, res.data));
  }
}
