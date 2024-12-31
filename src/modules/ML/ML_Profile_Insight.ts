import { QlikSaaSClient } from "qlik-rest-api";

export interface IML_Profile_Insight {
  id: string;
  type: "profile-insights";
  attributes: {
    status: "pending" | "error" | "ready";
    ownerId: string;
    insights: {
      name: string;
      insights: (
        | "constant"
        | "high_cardinality"
        | "high_cardinality_integer"
        | "too_many_nulls"
        | "will_be_impact_encoded"
        | "will_be_one_hot_encoded"
        | "possible_free_text_encoded"
        | "valid_index"
        | "underrepresented_class"
        | "invalid_column_name"
        | "will_be_date_engineered"
      )[];
      willBeDropped: boolean;
      cannotBeTarget: boolean;
      experimentTypes: ("binary" | "multiclass" | "regression")[];
      engineeredFeatures: string[];
    }[];
    tenantId: string;
    defaultVersionConfig: {
      name: string;
      dataSetId: string;
      featuresList: {
        name: string;
        include: boolean;
        dataType:
          | "DATE"
          | "TIME"
          | "DATETIME"
          | "TIMESTAMP"
          | "STRING"
          | "DOUBLE"
          | "DECIMAL"
          | "INTEGER"
          | "BOOLEAN"
          | "BINARY"
          | "CUSTOM"
          | "FLOAT"
          | "OBJECT";
        changeType: "categorical" | "numeric" | "date" | "freetext";
        featureType: "categorical" | "numeric" | "date" | "freetext";
        parentFeature: string;
      }[];
      datasetOrigin: "new" | "changed" | "refreshed" | "same";
      experimentMode: "intelligent" | "manual" | "manual_hpo";
    };
  };
}

export class ML_Profile_Insight {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IML_Profile_Insight;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IML_Profile_Insight
  ) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as IML_Profile_Insight);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IML_Profile_Insight>(`spaces/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async refreshDetails(): Promise<number> {
    return await this.#saasClient
      .Get<IML_Profile_Insight>(
        `ml/profile-insights/${this.details.attributes.defaultVersionConfig.dataSetId}`
      )
      .then((res) => {
        this.details = res.data;
        return res.status;
      });
  }
}
