import { QlikSaaSClient } from "qlik-rest-api";
import {
  CollectionItem,
  IClassCollectionItem,
  ICollectionItem,
} from "./CollectionItem";

export interface ICollectionUpdate {
  name: string;
  description?: string;
}

export interface ICollection {
  createdAt: string;
  creatorId: string;
  description: string;
  id: string;
  itemCount: number;
  links: {
    items: {
      href: string;
    };
    self: {
      href: string;
    };
  };
  meta: {
    items: {
      data: ICollectionItem[];
      links: {
        collection: {
          href: string;
        };
        next: {
          href: string;
        };
        prev: {
          href: string;
        };
        self: {
          href: string;
        };
      };
    };
  };
  name: string;
  tenantId: string;
  type: "public" | "private" | "favorite" | string;
  updatedAt: string;
  updaterId: string;
}

export interface IClassCollection {
  details: ICollection;
  remove(): Promise<number>;
  update(arg: ICollectionUpdate): Promise<number>;
  items(): Promise<CollectionItem[]>;
  addItem(id: string): Promise<CollectionItem>;
}

export class Collection implements IClassCollection {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: ICollection;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ICollection) {
    if (!id) throw new Error(`collection.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<ICollection>(`collections/${this.id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`collections/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: ICollectionUpdate) {
    if (!arg.name)
      throw new Error(`collections.create: "name" parameter is required`);

    return this.saasClient
      .Put(`collections/${this.id}`, arg)
      .then((res) => res.status);
  }

  async items() {
    return await this.saasClient
      .Get<ICollectionItem[]>(`collections/${this.id}/items`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new CollectionItem(this.saasClient, t.id, this.id, t))
      );
  }

  async addItem(id: string) {
    if (!id) throw new Error(`collection.addItem: "id" parameter is required`);

    return await this.saasClient
      .Post<ICollectionItem>(`collections/${this.id}/items`, { id })
      .then(
        (res) =>
          new CollectionItem(this.saasClient, res.data.id, this.id, res.data)
      );
  }
}
