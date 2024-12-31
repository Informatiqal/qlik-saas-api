import { QlikSaaSClient } from "qlik-rest-api";
import { IML_Profile_Insight, ML_Profile_Insight } from "./ML_Profile_Insight";

export class ML_Profile_Insights {
  #saasClient: QlikSaaSClient;

  constructor(saasClient: QlikSaaSClient, id: string) {
    this.#saasClient = saasClient;
  }

  async create(arg: { dataSetId: string }) {
    if (!arg.dataSetId)
      throw new Error(
        `machineLearning.profileInsights.create: "dataSetId" parameter is required`
      );

    return await this.#saasClient
      .Post<IML_Profile_Insight>(`ml/profile-insights`, {
        data: {
          type: "profile-insights",
          attributes: {
            dataSetId: arg.dataSetId,
          },
        },
      })
      .then(
        (res) => new ML_Profile_Insight(this.#saasClient, res.data.id, res.data)
      );
  }
}
