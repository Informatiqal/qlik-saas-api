import { QlikSaaSClient } from "qlik-rest-api";
import { DiProjectTask, IDiProjectTask } from "./DiProjectTask";

export class DiProjectTasks {
  #saasClient: QlikSaaSClient;
  #projectId: string;
  constructor(saasClient: QlikSaaSClient, projectId: string) {
    this.#saasClient = saasClient;
    this.#projectId = projectId;
  }

  /**
   * Returns instance of single data integration task
   */
  async get(arg: { id: string; projectId: string }) {
    if (!arg.id)
      throw new Error(`diProjectTasks.get: "id" parameter is required`);
    if (!arg.projectId)
      throw new Error(
        `diProjectTasks.projectId: "projectId" parameter is required`
      );

    const diTask: DiProjectTask = new DiProjectTask(
      this.#saasClient,
      arg.id,
      arg.projectId
    );
    await diTask.init();

    return diTask;
  }

  /**
   * Returns instances list of data integrations tasks
   */
  async getAll() {
    return await this.#saasClient
      .Get<IDiProjectTask[]>(`di-projects/${this.#projectId}/di-tasks?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map(
          (t) => new DiProjectTask(this.#saasClient, t.id, this.#projectId, t)
        )
      );
  }
}
