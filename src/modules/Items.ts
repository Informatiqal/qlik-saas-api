import { QlikSaaSClient } from "qlik-rest-api";
import { ResourceType } from "../types/types";
import { IClassItem, IItem, Item } from "./Item";

export interface IItemCreate {
  name: string;
  resourceType: ResourceType;
  description?: string;
  resourceId?: string;
  resourceLink?: string;
  resourceSubType?: string;
  spaceId?: string;
  thumbnailId?: string;

  resourceAttributes?: {};
  resourceCustomAttributes?: {};

  resourceUpdatedAt?: string;
  resourceCreatedAt?: string;
}
export interface IClassItems {
  get(id: string): Promise<IClassItem>;
  getAll(): Promise<IClassItem[]>;
  // create(arg: IItemCreate): Promise<any>;
}

export class Items implements IClassItems {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`items.get: "id" parameter is required`);
    const item: Item = new Item(this.saasClient, id);
    await item.init();

    return item;
  }

  async getAll() {
    return await this.saasClient
      .Get(`items`)
      .then((res) => res.data as IItem[])
      .then((data) => {
        return data.map((t) => new Item(this.saasClient, t.id, t));
      });
  }

  // async create(arg: IItemCreate) {
  //   if (!arg.name)
  //     throw new Error(`items.create: "name" parameter is required`);
  //   if (!arg.resourceType)
  //     throw new Error(`items.create: "resourceType" parameter is required`);

  //   if (!arg.resourceCreatedAt) {
  //     const d = new Date();
  //     arg.resourceCreatedAt = d.toISOString();
  //   }

  //   return await this.saasClient.Post(`items`, arg).then((res) => res.data);
  // }
}
