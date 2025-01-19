import { QlikSaaSClient } from "qlik-rest-api";
import { DatasourceHistories } from "./DatasourceHistories";

export interface IKnowledgebaseDataSource {
  id: string;
  name: string;
  type: "file" | "web" | "database";
  chunking: {
    size: number;
    type: string;
    overlap: number;
    separators: string[];
    keepSeparator: boolean;
  };
  syncInfo: {
    status: "neverIndexed" | "progress" | "completed" | "completedWithError";
    startedAt: string;
    lastSyncId: string;
    completedAt: string;
  };
  fileConfig: {
    files: string[];
    scope: {
      depth: number;
      maxSize: number;
      extensions: string[];
      maxFilesTotal: number;
      modifiedAfter: string;
      maxFilesPerFolder: number;
    };
    folder: string;
    userId: string;
    connectionId: string;
    crawlPatterns: {
      type: "include" | "exclude";
      pattern: string;
    }[];
  };
  sourceCount: number;
  crawlerConfig: {
    url: string;
    scope: {
      depth: number;
      scope: "all" | "domain" | "subdomain";
      maxSize: number;
      maxLinks: number;
      downloadFiles: string;
    };
    crawlPatterns: {
      type: "include" | "exclude";
      pattern: string;
    }[];
    indexPatterns: {
      type: "include" | "exclude";
      pattern: string;
    }[];
  };
  contentSummary: {
    fileSize: number;
    textSize: number;
    fileCount: number;
    effectivePages: number;
  };
}

export interface IKnowledgebaseDataSourceUpdate {
  id: string;
  name?: string;
  type: "file" | "web" | "database";
  spaceId: string;
  chunking?: {
    size: number;
    type: string;
    overlap: number;
    separators: string[];
    keepSeparator: boolean;
  };
  syncInfo?: {
    lastSyncId: string;
  };
  fileConfig: {
    files?: string[];
    scope?: {
      depth: number;
      maxSize?: number;
      extensions?: string[];
      maxFilesTotal?: number;
      modifiedAfter?: string;
      maxFilesPerFolder?: number;
    };
    folder?: string;
    userId: string;
    connectionId: string;
    crawlPatterns?: {
      type: "include" | "exclude";
      pattern: string;
    }[];
  };
  crawlerConfig?: {
    url: string;
    scope: {
      depth: number;
      scope: "all" | "domain" | "subdomain";
      maxSize?: number;
      maxLinks?: number;
      downloadFiles?: string;
    };
    crawlPatterns?: {
      type: "include" | "exclude";
      pattern: string;
    }[];
    indexPatterns?: {
      type: "include" | "exclude";
      pattern: string;
    }[];
  };
  contentSummary: {
    fileSize: number;
    textSize: number;
    fileCount: number;
    effectivePages: number;
  };
  sourceCount?: number;
}

export class Datasource {
  #id: string;
  #knowledgebaseId: string;
  #saasClient: QlikSaaSClient;
  histories: DatasourceHistories;
  details: IKnowledgebaseDataSource;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    knowledgebaseId: string,
    details?: IKnowledgebaseDataSource
  ) {
    if (!id) throw new Error(`knowledgebase.get: "id" parameter is required`);

    this.details = details ?? ({} as IKnowledgebaseDataSource);
    this.#id = id;
    this.#knowledgebaseId = knowledgebaseId;
    this.#saasClient = saasClient;
    this.histories = new DatasourceHistories(
      this.#saasClient,
      this.#id,
      this.#knowledgebaseId
    );
  }

  async remove() {
    return await this.#saasClient
      .Delete(`knowledgebases/${this.#knowledgebaseId}/datasources/${this.#id}`)
      .then((res) => res.status);
  }

  async update(arg: IKnowledgebaseDataSourceUpdate[]) {
    return await this.#saasClient
      .Put<IKnowledgebaseDataSource>(
        `knowledgebases/${this.#knowledgebaseId}/datasources/${this.#id}`,
        arg
      )
      .then((res) => {
        this.details = res.data;
        return res.status;
      });
  }
}
