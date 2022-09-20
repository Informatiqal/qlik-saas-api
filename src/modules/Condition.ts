import { QlikSaaSClient } from "qlik-rest-api";

export interface IConditionInternalBase {
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

export interface IConditionBase {
  type: "compound" | "data";
}

export interface IConditionData extends IConditionBase {
  compoundCondition: never;
  dataCondition: {
    conditionBase: IConditionInternalBase;
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

export interface IConditionComposite extends IConditionBase {
  dataCondition: never;
  compoundCondition: {
    conditionBase: IConditionInternalBase;
    data: {
      history: {
        enabled: boolean;
      };
      conditions: string[];
      expression: string;
    };
  };
}

export type ICondition = IConditionData | IConditionComposite;

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
        .Get<ICondition>(`conditions/${this.id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`conditions/${this.id}`)
      .then((res) => res.status);
  }
}
