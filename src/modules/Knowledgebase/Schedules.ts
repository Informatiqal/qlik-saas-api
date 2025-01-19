import { QlikSaaSClient } from "qlik-rest-api";
import {
  IKnowledgebaseSchedule,
  IKnowledgebaseScheduleRangeUpdate,
  KnowledgebaseSchedule,
} from "./Schedule";

export interface IKnowledgebaseSchedule_UpdateCreate {
  calendars: {
    comment: string;
    hour: IKnowledgebaseScheduleRangeUpdate[];
    month: IKnowledgebaseScheduleRangeUpdate[];
    minute: IKnowledgebaseScheduleRangeUpdate[];
    second: IKnowledgebaseScheduleRangeUpdate[];
    dayOfWeek: IKnowledgebaseScheduleRangeUpdate[];
    dayOfMonth: IKnowledgebaseScheduleRangeUpdate[];
  }[];
  intervals: {
    every: string;
    offset?: string;
  }[];
}

export class KnowledgebaseSchedules {
  #saasClient: QlikSaaSClient;
  knowledgebaseId: string;
  datasourceId: string;
  constructor(
    saasClient: QlikSaaSClient,
    knowledgebaseId: string,
    datasourceId: string
  ) {
    this.#saasClient = saasClient;
    this.datasourceId = datasourceId;
    this.knowledgebaseId = knowledgebaseId;
  }

  async getAll(): Promise<KnowledgebaseSchedule[]> {
    return await this.#saasClient
      .Get<IKnowledgebaseSchedule[]>(
        `knowledgebases/${this.knowledgebaseId}/datasources/${this.datasourceId}?limit=50`
      )
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new KnowledgebaseSchedule(this.#saasClient, t.id, t))
      );
  }

  async createOrUpdate(arg: IKnowledgebaseSchedule_UpdateCreate) {
    return this.#saasClient
      .Patch<number>(
        `knowledgebases/${this.knowledgebaseId}/datasources/${this.datasourceId}`,
        arg
      )
      .then((res) => res.status);
  }
}
