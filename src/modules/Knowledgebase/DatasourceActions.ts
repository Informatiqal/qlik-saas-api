import { QlikSaaSClient } from "qlik-rest-api";

export interface IKnowledgebaseDatasourceFile {
  url: string;
  name: string;
  spaceId: string;
  fileSize: string;
  mimeType: string;
  lastUpdatedAt: string;
}

export class DatasourceActions {
  #id: string;
  #knowledgebaseId: string;
  #saasClient: QlikSaaSClient;

  constructor(saasClient: QlikSaaSClient, id: string, knowledgebaseId: string) {
    this.#id = id;
    this.#knowledgebaseId = knowledgebaseId;
    this.#saasClient = saasClient;
  }

  async cancel() {
    return this.#saasClient
      .Post<{ id: string }>(
        `knowledgebases/${this.#knowledgebaseId}/datasources/${
          this.#id
        }/actions/cancel`,
        {}
      )
      .then((res) => res.data);
  }

  //TODO: add option to actually download the file itself
  async download(arg: { path: string }) {
    return this.#saasClient
      .Post<IKnowledgebaseDatasourceFile>(
        `knowledgebases/${this.#knowledgebaseId}/datasources/${
          this.#id
        }/actions/download`,
        arg
      )
      .then((res) => res.data);
  }

  async sync() {
    return this.#saasClient
      .Post<{ id: string }>(
        `knowledgebases/${this.#knowledgebaseId}/datasources/${
          this.#id
        }/actions/sync`,
        {}
      )
      .then((res) => res.data);
  }
}
