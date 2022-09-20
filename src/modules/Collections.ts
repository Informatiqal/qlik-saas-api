import { QlikSaaSClient } from "qlik-rest-api";
import { Collection, IClassCollection, ICollection } from "./Collection";

export interface ICollectionCreate {
  name: string;
  type: "public" | "private" | "favorite" | string;
  description?: string;
}

export interface IClassCollections {
  get(id: string): Promise<Collection>;
  getAll(): Promise<Collection[]>;
  favorites(): Promise<Collection>;
  create(arg: ICollectionCreate): Promise<Collection>;
}

export class Collections implements IClassCollections {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`collections.get: "id" parameter is required`);
    const collection: Collection = new Collection(this.saasClient, id);
    await collection.init();

    return collection;
  }

  async getAll() {
    return await this.saasClient
      .Get<ICollection[]>(`collections`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new Collection(this.saasClient, t.id, t))
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
