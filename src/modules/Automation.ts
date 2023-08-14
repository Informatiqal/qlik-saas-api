import { QlikSaaSClient } from "qlik-rest-api";
import { IAutomation } from "./Automation.interfaces";
import { IRun, Run } from "./Run";

export class Automation {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IAutomation;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IAutomation) {
    if (!id) throw new Error(`automation.get: "id" parameter is required`);

    this.details = details ?? ({} as IAutomation);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`automations/${this.id}`)
        .then((res) => res.data as IAutomation);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`automations/${this.id}`)
      .then((res) => res.status);
  }

  async copy(name: string) {
    if (!name) throw new Error(`automation.copy: "name" parameter is required`);

    const copyResponse = await this.saasClient
      .Post(`automations/${this.id}/actions/copy`, { name })
      .then((res) => res.data as IAutomation);

    const newAutomation = new Automation(
      this.saasClient,
      (copyResponse as any).id
    );
    await newAutomation.init();

    return newAutomation;
  }

  async enable() {
    return await this.saasClient
      .Post(`automations/${this.id}/actions/enable`, {})
      .then((res) => res.status);
  }

  async disable() {
    return await this.saasClient
      .Post(`automations/${this.id}/actions/disable`, {})
      .then((res) => res.status);
  }

  async move() {
    return await this.saasClient
      .Post(`automations/${this.id}/actions/move`, {})
      .then((res) => res.status);
  }

  async getRuns() {
    return await this.saasClient
      .Get<IRun[]>(`automations/automations/${this.id}/runs`)
      .then((res) => {
        return res.data.map((t) => new Run(this.saasClient, t.id, this.id, t));
      });
  }

  async getRun(runId: string) {
    if (!runId)
      throw new Error(`automation.getRun: "runId" parameter is required`);

    return await this.saasClient
      .Get<IRun[]>(`automations/automations/${this.id}/runs`)
      .then((res) => {
        const runData = res.data.filter((r) => r.id == runId);

        if (runData.length == 0)
          throw new Error(
            `automation.getRun: run with id "${runId}" was not found`
          );

        if (runData.length > 1)
          throw new Error(
            `automation.getRun: found more than one run with id "${runId}"`
          );

        return new Run(this.saasClient, runData[0].id, this.id, runData[0]);
      });
  }
}
