import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { Automation } from "./Automation";
import {
  IAutomation,
  IAutomationCreate,
  IAutomationsSettings,
  IAutomationUsage,
} from "./Automation.interfaces";
import { parseFilter } from "../util/filter";

export class Automations {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`automations.get: "id" parameter is required`);
    const a: Automation = new Automation(this.saasClient, arg.id);
    await a.init();

    return a;
  }

  async getAll() {
    return await this.saasClient
      .Get<IAutomation[]>(`automations`)
      .then((res) => res.data)
      .then((data) => {
        return data.map((t) => new Automation(this.saasClient, t.id, t));
      });
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`automations.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as Automation[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `automations.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async create(arg: IAutomationCreate) {
    return await this.saasClient
      .Post<IAutomation>("automations", { ...arg })
      .then((res) => res.data);
  }

  async usage(arg: { filter: string; breakdown?: string }) {
    const urlBuild = new URLBuild(`automations/automations/usage`);

    urlBuild.addParam("filter", arg.filter);
    urlBuild.addParam("breakdown", arg.breakdown);

    return await this.saasClient
      .Get<IAutomationUsage[]>(urlBuild.getUrl())
      .then((res) => res.data);
  }

  async getSettings() {
    return await this.saasClient
      .Get<IAutomationsSettings>(`automations/automations/settings`)
      .then((res) => res.data);
  }

  async setSettings(arg: { automationsEnabled: boolean }) {
    if (!arg.automationsEnabled)
      throw new Error(
        `automations.setSettings: "automationsEnabled" parameter is required`
      );

    return await this.saasClient
      .Put<IAutomationsSettings>(`automations/automations/settings`, {
        automationsEnabled: arg.automationsEnabled,
      })
      .then((res) => res.data);
  }
}
