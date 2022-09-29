import { QlikSaaSClient } from "qlik-rest-api";
import { IItem } from "./Item";

export interface IAutoMLDeployment extends IItem {}

export interface IAutoMLDeploymentPredictions {
  schema: {
    rows: string[];
    schema: {
      name: string;
    }[];
  };
}

export interface IRealtimePredictionsArguments {
  /**
   * If true, will include a column with the reason why a prediction was not produced.
   */
  includeNotPredictedReason?: boolean;
  /**
   * If true, the shapley values will be included in the response.
   */
  includeShap?: boolean;
  /**
   * If true, the source data will be included in the response
   */
  includeSource?: boolean;
  /**
   * The name of the feature in the source data to use as an index in the response data. The column will be included with its original name and values. This is intended to allow the caller to join results with source data.
   */
  index?: string;
}

export interface IClassAutoMLDeployment {
  realtimePredictions(arg: IRealtimePredictionsArguments): Promise<{}>;
}

export class AutoMLDeployment implements IClassAutoMLDeployment {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IAutoMLDeployment;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IAutoMLDeployment
  ) {
    if (!id)
      throw new Error(`autoML.deployments.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<IAutoMLDeployment>(`items/${this.id}`)
        .then((res) => res.data);
    }
  }

  async realtimePredictions(arg?: IRealtimePredictionsArguments) {
    return await this.saasClient
      .Post<{}>(
        `automl-deployments/${this.id}/realtime-predictions}`,
        arg || {}
      )
      .then((res) => res.data);
  }
}
