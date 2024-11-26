import { QlikSaaSClient } from "qlik-rest-api";
import { DiProjectTasks } from "./DiProjectTasks";
import { DiProjectActions } from "./DiProjectActions";

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
  _actions: DiProjectActions;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IDiProject) {
    if (!id) throw new Error(`diProject.get: "id" parameter is required`);

    this.details = details ?? ({} as IDiProject);
    this.#id = id;
    this.#saasClient = saasClient;
    this.tasks = new DiProjectTasks(saasClient, id);
    this._actions = new DiProjectActions(this.#saasClient, this.#id);
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

  async bindings(): Promise<{
    variables: { name: string; value: string }[];
  }> {
    return await this.#saasClient
      .Get<{ variables: { name: string; value: string }[] }>(
        `di-projects/${this.#id}/bindings`
      )
      .then((res) => res.data);
  }

  async updateBindings(arg: { name: string; value: string }[]) {
    return await this.#saasClient
      .Put<{}>(`di-projects/${this.#id}/bindings`, { variables: [...arg] })
      .then((res) => res.data);
  }
}
