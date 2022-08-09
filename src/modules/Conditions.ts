import { QlikSaaSClient } from "qlik-rest-api";
import { Condition, IClassCondition, ICondition } from "./Condition";

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

export interface IClassConditions {
  get(id: string): Promise<IClassCondition>;
  create(arg: IConditionCreate): Promise<IClassCondition>;
  // getAll(): Promise<IClassCondition[]>;
}

export class Conditions implements IClassConditions {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`conditions.get: "id" parameter is required`);
    const condition: Condition = new Condition(this.saasClient, id);
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
      .Post(`conditions`, arg)
      .then((res) => new Condition(this.saasClient, res.data.id, res.data));
  }
}
