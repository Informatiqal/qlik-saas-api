import { QlikSaaSClient } from "qlik-rest-api";
import { IAutomation, IAutomationCreate } from "./Automation.interfaces";
import { URLBuild } from "../util/UrlBuild";
import { Automation, IClassAutomation } from "./Automation";

export interface IClassAutomations {
  /**
   * Get single automation
   * @param id
   */
  get(id: string): Promise<IClassAutomation>;
  /**
   * Get all automations
   */
  getAll(): Promise<IClassAutomation[]>;
  /**
   * Create new automation
   * @param arg
   */
  create(arg: IAutomationCreate): Promise<IClassAutomation>;
  // getFilter(filter: string): Promise<IClassApp[]>;
  // removeFilter(filter: string): Promise<IEntityRemove[]>;
  // import(arg: IAppImport): Promise<IClassApp>;
  // privileges(): Promise<{ [key: string]: string }>;
}

export class Automations implements IClassAutomations {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`automation.get: "id" parameter is required`);
    const automation: Automation = new Automation(this.saasClient, id);
    await automation.init();

    return automation;
  }

  async getAll() {
    return await this.saasClient
      .Get(`automations`)
      .then((res) => {
        let a = 1;
        return res.data as IAutomation[];
      })
      .then((data) => {
        return data.map((t) => new Automation(this.saasClient, t.guid));
      });
  }

  async create(arg: IAutomationCreate) {
    if (!arg.name)
      throw new Error(`automation.create: "name" parameter is required`);
    if (!arg.schedule)
      throw new Error(`automation.schedule: "name" parameter is required`);

    if (!arg.workspace) arg.workspace = {};
    if (!arg.state) arg.state = "available";

    return this.saasClient
      .Post("automations", arg)
      .then(
        (a) =>
          new Automation(
            this.saasClient,
            (a.data as IAutomation).guid,
            a.data as IAutomation
          )
      );
  }
}
