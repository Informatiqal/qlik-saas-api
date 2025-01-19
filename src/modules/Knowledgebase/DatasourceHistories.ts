import { QlikSaaSClient } from "qlik-rest-api";

export interface IKnowledgebaseDatasourceHistory {
  id: string;
  status: "neverIndexed" | "progress" | "completed" | "completedWithErrors";
  startedAt: string;
  completedAt: string;
  triggerType: string;
  connectionId: string;
  datasourceId: string;
  selectedErrors: string[];
  docStats: {
    added: number;
    errors: number;
    deleted: number;
    updated: number;
    deltaBytes: number;
    deltaTextSize: number;
    largestFileSize: number;
    totalBytesProcessed: number;
    deltaEffectivePages: number;
  };
}

export interface IKnowledgebaseDatasourceSyncHistory {
  id: string;
  error: string;
  action: "add" | "delete" | "update";
  chunks: number;
  source: string;
  syncId: string;
  fileSize: string;
  syncedAt: string;
  chunkSize: number;
  explicitPages: number;
  fileStartedAt: string;
  fileCompletedAt: string;
  fileLastModified: string;
  duration: {
    chunk: number;
    embed: number;
    parse: number;
    store: number;
    download: number;
  };
}

export class DatasourceHistories {
  #id: string;
  #knowledgebaseId: string;
  #saasClient: QlikSaaSClient;

  constructor(saasClient: QlikSaaSClient, id: string, knowledgebaseId: string) {
    this.#id = id;
    this.#knowledgebaseId = knowledgebaseId;
    this.#saasClient = saasClient;
  }

  async histories(): Promise<IKnowledgebaseDatasourceHistory[]> {
    return this.#saasClient
      .Get<IKnowledgebaseDatasourceHistory[]>(
        `knowledgebases/${this.#knowledgebaseId}/datasources/${
          this.#id
        }/histories`
      )
      .then((res) => res.data);
  }

  async syncHistories(arg: {
    syncId: string;
  }): Promise<IKnowledgebaseDatasourceSyncHistory> {
    return this.#saasClient
      .Post<IKnowledgebaseDatasourceSyncHistory>(
        `knowledgebases/${this.#knowledgebaseId}/datasources/${
          this.#id
        }/histories/${arg.syncId}`,
        arg
      )
      .then((res) => res.data);
  }
}
