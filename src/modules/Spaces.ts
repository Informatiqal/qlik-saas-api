import { QlikSaaSClient } from "qlik-rest-api";
import { IEntityRemove } from "../types/types";
import { Space, IClassSpace, ISpace } from "./Space";

export interface ISpacesExt {
  data: ISpace[];
  meta: {
    count: number;
  };
  links: {
    self: {
      href: string;
    };
    prev: {
      href: string;
    };
    next: {
      href: string;
    };
  };
}

export interface ISpaceFilter {
  ids?: string[];
  names?: string[];
}

export interface ISpaceCreate {
  name: string;
  description?: string;
  type: "shared" | "managed" | "data";
}

export interface IClassSpaces {
  get(id: string): Promise<IClassSpace>;
  getAll(): Promise<IClassSpace[]>;
  getFilter(arg: ISpaceFilter): Promise<IClassSpace[]>;
  removeFilter(arg: ISpaceFilter): Promise<IEntityRemove[]>;
  create(arg: ISpaceCreate): Promise<IClassSpace>;
}

export class Spaces implements IClassSpaces {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`spaces.get: "id" parameter is required`);
    const space: Space = new Space(this.saasClient, id);
    await space.init();

    return space;
  }

  async getAll() {
    return await this.saasClient
      .Get(`spaces`)
      .then((res) => res.data as ISpace[])
      .then((data) => data.map((t) => new Space(this.saasClient, t.id, t)));
  }

  async getFilter(arg: ISpaceFilter) {
    const filter = {
      ids: arg.ids || [],
      names: arg.names || [],
    };
    return await this.saasClient
      .Post(`spaces/filter`, filter)
      .then((res) => res.data as ISpace[])
      .then((data) => data.map((t) => new Space(this.saasClient, t.id, t)));
  }

  async removeFilter(arg: ISpaceFilter) {
    const spaces = await this.getFilter(arg);

    return Promise.all(
      spaces.map((space) =>
        space.remove().then((s) => ({ id: space.details.id, status: s }))
      )
    );
  }

  async create(arg: ISpaceCreate) {
    if (!arg.name)
      throw new Error(`spaces.create: "name" parameter is required`);
    if (!arg.type) throw new Error(`spaces.type: "type" parameter is required`);

    return await this.saasClient
      .Post<ISpace>(`spaces`, arg)
      .then((res) => new Space(this.saasClient, res.data.id, res.data));
  }
}
