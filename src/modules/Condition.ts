import { QlikSaaSClient } from "qlik-rest-api";

export interface IConditionBase {
  created: string;
  createdById: string;
  description: string;
  id: string;
  ownerId: string;
  tenantId: string;
  appId: string;
  bookmarkId: string;
  type: "compound" | "data";
  updated: string;
  lastReloadTime: string;
}

export interface ICondition {
  type: "compound" | "data";
  compoundCondition: {
    conditionBase: IConditionBase;
    data: {
      history: {
        enabled: boolean;
      };
      conditions: string[];
      expression: string;
    };
  };
  dataCondition: {
    conditionBase: IConditionBase;
    conditionData: {};
    history: {
      enabled: boolean;
    };
    selections: {
      field: string;
      count: number;
      selectedSummary: string[];
    }[];
    dimensions: {
      qLibraryId: string;
      field: string;
      title: string;
    }[];
    headers: [];
    measures: {
      qLibraryId: string;
      qNumFormat: {};
      title: string;
    }[];
  };
}

export interface IClassCondition {
  details: ICondition;
  remove(): Promise<number>;
}

export class Condition implements IClassCondition {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: ICondition;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ICondition) {
    if (!id) throw new Error(`conditions.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`conditions/${this.id}`)
        .then((res) => res.data as ICondition);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`conditions/${this.id}`)
      .then((res) => res.status);
  }
}
