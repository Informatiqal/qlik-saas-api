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
      .Get<ICollection[]>(`collections?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new Collection(this.saasClient, t.id, t))
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`collections.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as Collection[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `collections.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
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
