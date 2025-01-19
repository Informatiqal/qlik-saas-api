import { QlikSaaSClient } from "qlik-rest-api";
import { Knowledgebase, IKnowledgebase } from "./Knowledgebase";
import { parseFilter } from "../util/filter";

export interface IKnowledgebaseCreate {
  name: string;
  tags: string[];
  spaceId: string;
  description: string;
  selectedErrorsCount?: number;
}

export class Knowledgebases {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id)
      throw new Error(`knowledgebases.get: "id" parameter is required`);

    const kb: Knowledgebase = new Knowledgebase(this.#saasClient, arg.id);
    await kb.init();

    return kb;
  }

  async getAll() {
    return await this.#saasClient
      .Get<IKnowledgebase[]>(`knowledgebases?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new Knowledgebase(this.#saasClient, t.id, t))
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `knowledgebases.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as Knowledgebase[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `knowledgebases.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async create(arg: IKnowledgebaseCreate) {
    if (!arg.name)
      throw new Error(`knowledgebases.create: "name" parameter is required`);
    if (!arg.tags)
      throw new Error(`knowledgebases.create: "tags" parameter is required`);
    if (!arg.spaceId)
      throw new Error(`knowledgebases.spaceId: "name" parameter is required`);
    if (!arg.description)
      throw new Error(
        `knowledgebases.description: "name" parameter is required`
      );

    return await this.#saasClient
      .Post<IKnowledgebase>(`knowledgebases`, arg)
      .then(
        (res) => new Knowledgebase(this.#saasClient, res.data.id, res.data)
      );
  }
}
