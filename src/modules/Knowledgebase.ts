import { QlikSaaSClient } from "qlik-rest-api";
import {
  Datasource,
  IKnowledgebaseDataSource,
} from "./Knowledgebase/Datasource";

export interface IKnowledgebase {
  id: string;
  name: string;
  tags: string[];
  ownerId: string;
  spaceId: string;
  tenantId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  description: string;
  lastIndexedAt: string;
  contentSummary: {
    fileSize: number;
    textSize: number;
    fileCount: number;
    effectivePages: number;
  };
  selectedErrorsCount: number;
  datasources: IKnowledgebaseDataSource[];
}

export interface IKnowledgebaseUpdate {
  path: string;
  value: string | number | boolean;
}

export interface IKnowledgebaseHistories {
  id: string;
  status: "neverIndexed" | "progress" | "completed" | "completedWithError";
  docStats: {
    added: number;
    errors: number;
    deleted: number;
    updated: number;
    deltaBytes: number;
    deltaTextSize: number;
    largestFileSize: number;
    deltaEffectivePages: number;
    totalBytesProcessed: number;
  };
  startedAt: string;
  completedAt: string;
  triggerType: string;
  connectionId: string;
  datasourceId: string;
  selectedErrors: string;
}

export class Knowledgebase {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IKnowledgebase;
  datasources: Datasource[];
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IKnowledgebase
  ) {
    if (!id) throw new Error(`knowledgebase.get: "id" parameter is required`);

    this.details = details ?? ({} as IKnowledgebase);
    this.datasources = details?.datasources
      ? details.datasources.map(
          (ds) => new Datasource(this.#saasClient, ds.id, this.#id, ds)
        )
      : ([] as Datasource[]);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IKnowledgebase>(`knowledgebases/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`knowledgebases/${this.#id}`)
      .then((res) => res.status);
  }

  async update(arg: IKnowledgebaseUpdate[]) {
    let updateStatus = 0;
    const data = arg.map((a) => ({ op: "REPLACE", ...a }));

    return await this.#saasClient
      .Put<IKnowledgebase>(`knowledgebases/${this.#id}`, data)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  async histories(): Promise<IKnowledgebaseHistories[]> {
    return await this.#saasClient
      .Get<IKnowledgebaseHistories[]>(`knowledgebases/${this.#id}/histories`)
      .then((res) => res.data);
  }
}
