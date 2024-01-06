import { QlikSaaSClient } from "qlik-rest-api";
import { DiProject, IDiProject } from "./DiProject";

export class DiProjects {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`diProject.get: "id" parameter is required`);

    const st: DiProject = new DiProject(this.#saasClient, arg.id);
    await st.init();

    return st;
  }

  /**
   * Returns a list of data integrations as an instance
   */
  async getAll() {
    return await this.#saasClient
      .Get<IDiProject[]>(`di-projects?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new DiProject(this.#saasClient, t.id, t))
      );
  }
}
