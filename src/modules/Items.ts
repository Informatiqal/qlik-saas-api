import { QlikSaaSClient } from "qlik-rest-api";
import { ResourceType } from "../types/types";
import { IItem, Item } from "./Item";
import { parseFilter } from "../util/filter";

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

export class Items {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`items.get: "id" parameter is required`);
    const item: Item = new Item(this.saasClient, arg.id);
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

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`items.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
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
