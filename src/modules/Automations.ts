import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { Automation } from "./Automation";
import {
  IAutomation,
  IAutomationCreate,
  IAutomationsSettings,
  IAutomationUsage,
} from "./Automation.interfaces";

export interface IClassAutomations {
  get(id: string): Promise<Automation>;
  getAll(): Promise<Automation[]>;
  usage(filter: string, breakdown?: string): Promise<IAutomationUsage[]>;
  getSettings(): Promise<IAutomationsSettings>;
  setSettings(automationsEnabled: boolean): Promise<IAutomationsSettings>;
}

export class Automations implements IClassAutomations {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`automations.get: "id" parameter is required`);
    const a: Automation = new Automation(this.saasClient, id);
    await a.init();

    return a;
  }

  async getAll() {
    return await this.saasClient
      .Get<IAutomation[]>(`automations`)
      .then((res) => res.data)
      .then((data: any) => {
        return data.map((t) => new Automation(this.saasClient, t.id, t));
      });
  }

  async create(arg: IAutomationCreate) {
    return await this.saasClient
      .Post<IAutomation>("automations", { ...arg })
      .then((res) => res.data);
  }

  async usage(filter: string, breakdown?: string) {
    const urlBuild = new URLBuild(`automations/automations/usage`);

    urlBuild.addParam("filter", filter);
    urlBuild.addParam("breakdown", breakdown);

    return await this.saasClient
      .Get<IAutomationUsage[]>(urlBuild.getUrl())
      .then((res) => res.data);
  }

  async getSettings() {
    return await this.saasClient
      .Get<IAutomationsSettings>(`automations/automations/settings`)
      .then((res) => res.data);
  }

  async setSettings(automationsEnabled: boolean) {
    if (!automationsEnabled)
      throw new Error(
        `automations.setSettings: "automationsEnabled" parameter is required`
      );

    return await this.saasClient
      .Put<IAutomationsSettings>(`automations/automations/settings`, {
        automationsEnabled,
      })
      .then((res) => res.data);
  }
}
