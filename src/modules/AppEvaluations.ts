import { QlikSaaSClient } from "qlik-rest-api";
import { AppEvaluation, IAppEvaluation } from "./AppEvaluation";
import { parseFilter } from "../util/filter";

export class AppEvaluations {
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
        data.map((t) => new AppEvaluation(this.saasClient, t.id ?? t.ID, t))
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`evaluations.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }

  async create() {
    return await this.saasClient
      .Post<IAppEvaluation>(`/apps/${this.appId}/evaluations`, {})
      .then(
        (res) =>
          new AppEvaluation(
            this.saasClient,
            res.data.id ?? res.data.ID,
            res.data
          )
      );
  }
}
