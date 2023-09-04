import { QlikSaaSClient } from "qlik-rest-api";
import { Origin, IOrigin } from "./Origin";
import { parseFilter } from "../util/filter";

export interface IOriginCreate {
  origin: string;
  name?: string;
  description?: string;
  childSrc?: boolean;
  connectSrc?: boolean;
  connectSrcWSS?: boolean;
  fontSrc?: boolean;
  formAction?: boolean;
  frameAncestors?: boolean;
  frameSrc?: boolean;
  imgSrc?: boolean;
  mediaSrc?: boolean;
  objectSrc?: boolean;
  scriptSrc?: boolean;
  styleSrc?: boolean;
  workerSrc?: boolean;
  createdDate?: string;
  modifiedDate?: string;
}

export class Origins {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`origins.get: "id" parameter is required`);
    const origin: Origin = new Origin(this.#saasClient, arg.id);
    await origin.init();

    return origin;
  }

  // TODO: 400 when called?
  async getAll() {
    return await this.#saasClient
      .Get<IOrigin[]>(`csp-origins?limit=50`)
      .then((res) => res.data)
      .then((data) => data.map((t) => new Origin(this.#saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`origins.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as Origin[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`origins.removeFilter: "filter" parameter is required`);

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async generateHeader() {
    return await this.#saasClient
      .Get<{ [k: string]: any }>(`csp-origins/actions/generate-header`)
      .then((res) => res.data);
  }

  async create(arg: IOriginCreate) {
    if (!arg.origin)
      throw new Error(`origins.create: "origin" parameter is required`);

    return await this.#saasClient
      .Post<IOrigin>(`csp-origins`, arg)
      .then((res) => new Origin(this.#saasClient, res.data.id, res.data));
  }
}
