import { QlikSaaSClient } from "qlik-rest-api";
import { DiProjectTasks } from "./DiProjectTasks";

export interface IDiProject {
  id: string;
  name: string;
  ownerId: string;
  spaceId: string;
  description: string;
}

export class DiProject {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IDiProject;
  tasks: DiProjectTasks;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IDiProject) {
    if (!id) throw new Error(`diProject.get: "id" parameter is required`);

    this.details = details ?? ({} as IDiProject);
    this.#id = id;
    this.#saasClient = saasClient;
    this.tasks = new DiProjectTasks(saasClient, id);
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IDiProject>(`di-projects/${this.#id}`)
        .then((res) => res.data);
    }
  }
}
