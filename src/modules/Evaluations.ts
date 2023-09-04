import { QlikSaaSClient } from "qlik-rest-api";
import { Evaluation, IEvaluation } from "./Evaluation";

export interface IEvaluationGetAll {
  itemid?: string;
  appid?: string;
  filemode?: boolean;
}

export class Evaluations {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`evaluations.get: "id" parameter is required`);
    const evaluation: Evaluation = new Evaluation(this.#saasClient, arg.id);
    await evaluation.init();

    return evaluation;
  }

  async getAll(arg: IEvaluationGetAll) {
    if (!arg.appid && !arg.itemid)
      throw new Error(
        `evaluations.getAll: "appid" or/and "itemid" parameters are required`
      );

    return await this.#saasClient
      .Get<IEvaluation[]>(`evaluations`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new Evaluation(this.#saasClient, t.id, t))
      );
  }

  async create(arg: { appid: string; itemid: string }) {
    if (!arg.appid)
      throw new Error(`evaluations.getAll: "appid" parameter is required`);
    if (!arg.itemid)
      throw new Error(`evaluations.getAll: "itemid" parameters is required`);

    return await this.#saasClient
      .Post<IEvaluation>(`evaluations`, {
        appid: arg.appid,
        itemid: arg.itemid,
      })
      .then((res) => new Evaluation(this.#saasClient, res.data.id, res.data));
  }
}
