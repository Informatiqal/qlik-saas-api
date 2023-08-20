import { QlikSaaSClient } from "qlik-rest-api";
import { Collection, ICollection } from "./Collection";
import { parseFilter } from "../util/filter";

export interface ICollectionCreate {
  name: string;
  type: "public" | "private" | "favorite" | string;
  description?: string;
}

export class Collections {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`collections.get: "id" parameter is required`);

    const collection: Collection = new Collection(this.saasClient, arg.id);
    await collection.init();

    return collection;
  }

  async getAll() {
    return await this.saasClient
      .Get(`collections`)
      .then((res) => res.data as ICollection[])
      .then((data) =>
        data.map((t) => new Collection(this.saasClient, t.id, t))
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`collections.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }

  async favorites() {
    return await this.saasClient
      .Get<ICollection>(`collections/favorites`)
      .then((res) => new Collection(this.saasClient, res.data.id, res.data));
  }

  async create(arg: ICollectionCreate) {
    if (!arg.name)
      throw new Error(`collections.create: "name" parameter is required`);
    if (!arg.type)
      throw new Error(`collections.create: "type" parameter is required`);

    return await this.saasClient
      .Post<ICollection>(`collections`, arg)
      .then((res) => new Collection(this.saasClient, res.data.id, res.data));
  }
}
