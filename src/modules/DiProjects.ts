import { QlikSaaSClient } from "qlik-rest-api";
import { DiProject, IDiProject } from "./DiProject";

export interface IDiCreate {
  /**
   * The name of the project
   */
  name: string;
  /**
   * The type of the project
   */
  type: string;
  /**
   * The ID of the space where the project will be created
   */
  space: string;
  /**
   * A description of the project
   */
  description: string;
  /**
   * The platform type of the project
   */
  platformType: string;
  /**
   * The platform connection string
   */
  platformConnection: string;
  /**
   * The landing storage connection string
   */
  landingStorageConnection: string;
}

export class DiProjects {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  /**
   * Returns instance of single data integration project
   */
  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`diProjects.get: "id" parameter is required`);

    const di: DiProject = new DiProject(this.#saasClient, arg.id);
    await di.init();

    return di;
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

  async create(arg: IDiCreate) {
    if (!arg.name)
      throw new Error(`diProjects.create: "name" parameter is required`);
    if (!arg.type)
      throw new Error(`diProjects.create: "type" parameter is required`);
    if (!arg.space)
      throw new Error(`diProjects.create: "space" parameter is required`);
    if (!arg.description)
      throw new Error(`diProjects.create: "description" parameter is required`);
    if (!arg.platformType)
      throw new Error(
        `diProjects.create: "platformType" parameter is required`
      );
    if (!arg.platformConnection)
      throw new Error(
        `diProjects.create: "platformConnection" parameter is required`
      );
    if (!arg.landingStorageConnection)
      throw new Error(
        `diProjects.create: "landingStorageConnection" parameter is required`
      );

    return await this.#saasClient
      .Post<IDiProject>(`di-projects`, arg)
      .then((res) => new DiProject(this.#saasClient, res.data.id, res.data));
  }
}
