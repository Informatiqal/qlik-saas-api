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

export class Condition {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: ICondition;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ICondition) {
    if (!id) throw new Error(`conditions.get: "id" parameter is required`);

    this.details = details ?? ({} as ICondition);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init() {
    if (!this.details || Object.keys(this.details).length == 0) {
      this.details = await this.#saasClient
        .Get<ICondition>(`conditions/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`conditions/${this.#id}`)
      .then((res) => res.status);
  }
}
