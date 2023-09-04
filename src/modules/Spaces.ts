import { QlikSaaSClient } from "qlik-rest-api";
import { Space, ISpace } from "./Space";
import { parseFilter } from "../util/filter";

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

export class Spaces {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`spaces.get: "id" parameter is required`);

    const space: Space = new Space(this.#saasClient, arg.id);
    await space.init();

    return space;
  }

  async getAll() {
    return await this.#saasClient
      .Get<ISpace[]>(`spaces?limit=50`)
      .then((res) => res.data)
      .then((data) => data.map((t) => new Space(this.#saasClient, t.id, t)));
  }

  async getFilterNative(arg: ISpaceFilter) {
    if (!arg.ids && !arg.names)
      throw new Error(
        `spaces.getFilterNative: "ids" or "names" parameter is required`
      );

    const filter = {
      ids: arg.ids || [],
      names: arg.names || [],
    };
    return await this.#saasClient
      .Post<ISpace[]>(`spaces/filter`, filter)
      .then((res) => res.data)
      .then((data) => data.map((t) => new Space(this.#saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`spaces.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as Space[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`spaces.removeFilter: "filter" parameter is required`);

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async removeFilterNative(arg: ISpaceFilter) {
    const spaces = await this.getFilterNative(arg);

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

    return await this.#saasClient
      .Post<ISpace>(`spaces`, arg)
      .then((res) => new Space(this.#saasClient, res.data.id, res.data));
  }
}
