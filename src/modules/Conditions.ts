import { QlikSaaSClient } from "qlik-rest-api";
import { Condition, ICondition } from "./Condition";

export interface IConditionCreateBase {
  type: "compound" | "data";
}

export interface IConditionCreateData extends IConditionCreateBase {
  dataCondition: {
    conditionBase?: {
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
    };
    conditionData?: {};
    history?: {
      enabled: boolean;
    };
    selections?: [
      {
        field: string;
        count: number;
        selectedSummary: string[];
      }
    ];
    dimensions?: [
      {
        qLibraryId: string;
        field: string;
        title: string;
      }
    ];
    headers?: [];
    measures?: [
      {
        qLibraryId: string;
        qNumFormat?: {};
        title: string;
      }
    ];
  };
  compoundCondition: never;
}

export interface IConditionCreateComposite extends IConditionCreateBase {
  dataCondition: never;
  compoundCondition: {};
}

export type IConditionCreate = IConditionCreateData | IConditionCreateComposite;

export class Conditions {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`conditions.get: "id" parameter is required`);

    const condition: Condition = new Condition(this.saasClient, arg.id);
    await condition.init();

    return condition;
  }

  // async getAll() {
  //   return await this.saasClient
  //     .Get(`conditions`)
  //     .then((res) => res.data as ICondition[])
  //     .then((data) => data.map((t) => new Condition(this.saasClient, t.id, t)));
  // }

  async create(arg: IConditionCreate) {
    return await this.saasClient
      .Post<ICondition>(`conditions`, arg)
      .then((res) => new Condition(this.saasClient, "res.data.id", res.data));
  }
}
