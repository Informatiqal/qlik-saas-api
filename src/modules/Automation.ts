import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { IAutomation } from "./Automation.interfaces";

export interface IClassAutomation {
  details: IAutomation;
}

export class Automation implements IClassAutomation {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IAutomation;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IAutomation) {
    if (!id) throw new Error(`automation.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`automations/${this.id}`)
        .then((res) => res.data as IAutomation);
    }
  }
}
