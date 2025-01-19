import { QlikSaaSClient } from "qlik-rest-api";

export interface IKnowledgebaseScheduleRange {
  end: number;
  step: number;
  start: number;
}

export interface IKnowledgebaseScheduleRangeUpdate {
  end?: number;
  step?: number;
  start: number;
}

export interface IKnowledgebaseSchedule {
  ownerId: string;
  spaceId: string;
  tenantId: string;
  datasourceId: string;
  knowledgebaseId: string;
  intervals: {
    every: string;
    offset: string;
  }[];
  calendars: {
    comment: string;
    hour: IKnowledgebaseScheduleRange[];
    month: IKnowledgebaseScheduleRange[];
    minute: IKnowledgebaseScheduleRange[];
    second: IKnowledgebaseScheduleRange[];
    dayOfWeek: IKnowledgebaseScheduleRange[];
    dayOfMonth: IKnowledgebaseScheduleRange[];
  }[];
}

export class KnowledgebaseSchedule {
  #knowledgebaseId: string;
  #datasourceId: string;
  #saasClient: QlikSaaSClient;
  details: IKnowledgebaseSchedule;

  constructor(
    saasClient: QlikSaaSClient,
    knowledgebaseId: string,
    datasourceId: string,
    details?: IKnowledgebaseSchedule
  ) {
    this.#saasClient = saasClient;
    this.details = details ?? ({} as IKnowledgebaseSchedule);
    this.#knowledgebaseId = knowledgebaseId;
    this.#datasourceId = datasourceId;
  }

  async remove() {
    return await this.#saasClient
      .Delete(
        `knowledgebases/${this.#knowledgebaseId}/datasources/${
          this.#datasourceId
        }/schedules`
      )
      .then((res) => res.status);
  }
}
