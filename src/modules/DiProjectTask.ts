import { QlikSaaSClient } from "qlik-rest-api";

export interface IDiProjectTask {
  id: string;
  name: string;
  type:
    | "LANDING"
    | "STORAGE"
    | "QVD_STORAGE"
    | "TRANSFORM"
    | "DATAMART"
    | "REGISTERED_DATA"
    | "REPLICATION"
    | "DISTRIBUTION"
    | "LAKE_LANDING"
    | string;
  ownerId: string;
  spaceId: string;
  description: string;
}

export interface IDataTaskInstanceState {
  lastRun: {
    state: "STARTING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELED";
    message: string;
  };
  runReadiness: {
    state: "READY_TO_RUN" | "ALREADY_RUNNING" | "NOT_RUNNABLE";
    message: string;
  };
}

export class DiProjectTask {
  #id: string;
  #projectId: string;
  #saasClient: QlikSaaSClient;
  details: IDiProjectTask;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    projectId: string,
    details?: IDiProjectTask
  ) {
    if (!id) throw new Error(`diProjectTask.get: "id" parameter is required`);
    if (!projectId)
      throw new Error(`diProjectTask.projectId: "id" parameter is required`);

    this.details = details ?? ({} as IDiProjectTask);
    this.#id = id;
    this.#projectId = projectId;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IDiProjectTask>(
          `di-projects/${this.#projectId}/di-tasks/${this.#id}`
        )
        .then((res) => res.data);
    }
  }

  async start() {
    return await this.#saasClient
      .Post<IDiProjectTask>(
        `di-projects/${this.#projectId}/di-tasks/${this.#id}/start`,
        {}
      )
      .then((res) => res.status);
  }

  async stop() {
    return await this.#saasClient
      .Post<IDiProjectTask>(
        `di-projects/${this.#projectId}/di-tasks/${this.#id}/stop`,
        {}
      )
      .then((res) => res.status);
  }

  async state() {
    return await this.#saasClient
      .Get<IDataTaskInstanceState>(
        `di-projects/${this.#projectId}/di-tasks/${this.#id}/state`
      )
      .then((res) => res.status);
  }
}
