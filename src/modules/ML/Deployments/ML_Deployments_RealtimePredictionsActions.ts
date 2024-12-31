import { QlikSaaSClient } from "qlik-rest-api";

export type TRealTimePredictions_Run_ContentTypes =
  | "application/json"
  | "text/json"
  | "text/csv"
  | "application/parquet"
  | "application/vnd.apache.parquet";

export interface IRealTimePredictions_Run_Options {
  includeNotPredictedReason?: boolean;
  includeShap?: boolean;
  includeSource?: boolean;
  index?: string;
}

export interface IRealTimePredictions_Run_InputValues {
  rows: string[][];
  schema: {
    name: string;
  }[];
}

export interface IRealTimePredictions_Run_Response {
  type: "realtime-prediction";
  attributes: {
    rows: [string[]];
    schema: {
      name: string;
    }[];
  };
}

export class ML_Deployment_RealtimePredictionsActions {
  #id: string;
  #saasClient: QlikSaaSClient;

  constructor(saasClient: QlikSaaSClient, id: string) {
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async run(arg: {
    inputValues: IRealTimePredictions_Run_InputValues;
    options?: IRealTimePredictions_Run_Options;
    contentType: TRealTimePredictions_Run_ContentTypes;
  }): Promise<IRealTimePredictions_Run_Response> {
    if (!arg.hasOwnProperty("inputValues"))
      throw new Error(
        `machineLearning.deployments.realtimePredictions.actions.run: "inputValues" parameter is required`
      );

    if (!arg.hasOwnProperty("contentType"))
      throw new Error(
        `machineLearning.deployments.realtimePredictions.actions.run: "contentType" parameter is required`
      );

    return this.#saasClient
      .Post<IRealTimePredictions_Run_Response>(
        `ml/deployments/${this.#id}/realtime-predictions/actions/run `,
        arg
      )
      .then((res) => res.data);
  }
}
