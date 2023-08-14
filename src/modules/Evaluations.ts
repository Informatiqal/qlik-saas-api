import { QlikSaaSClient } from "qlik-rest-api";
import { Evaluation, IEvaluation } from "./Evaluation";

export interface IEvaluationGetAll {
  itemid?: string;
  appid?: string;
  filemode?: boolean;
}

export class Evaluations {
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
      .Get(`evaluations`)
      .then((res) => res.data as IEvaluation[])
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
