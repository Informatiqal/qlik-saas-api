import { QlikSaaSClient } from "qlik-rest-api";
import { IAutomation } from "./Automation.interfaces";
import { IRun, Run } from "./Run";

export class Automation {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IAutomation;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IAutomation) {
    if (!id) throw new Error(`automation.get: "id" parameter is required`);

    this.details = details ?? ({} as IAutomation);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IAutomation>(`automations/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`automations/${this.#id}`)
      .then((res) => res.status);
  }

  async copy(arg: { name: string }) {
    if (!arg.name)
      throw new Error(`automation.copy: "name" parameter is required`);

    const copyResponse = await this.#saasClient
      .Post<IAutomation>(`automations/${this.#id}/actions/copy`, {
        name: arg.name,
      })
      .then((res) => res.data);

    const newAutomation = new Automation(
      this.#saasClient,
      (copyResponse as any).id
    );
    await newAutomation.init();

    return newAutomation;
  }

  async enable() {
    let updateStatus = 0;

    return await this.#saasClient
      .Post(`automations/${this.#id}/actions/enable`, {})
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  async disable() {
    let updateStatus = 0;

    return await this.#saasClient
      .Post(`automations/${this.#id}/actions/disable`, {})
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  async move() {
    let updateStatus = 0;

    return await this.#saasClient
      .Post(`automations/${this.#id}/actions/move`, {})
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  async getRuns() {
    return await this.#saasClient
      .Get<IRun[]>(`automations/automations/${this.#id}/runs`)
      .then((res) => {
        return res.data.map((t) => new Run(this.#saasClient, t.id, this.#id, t));
      });
  }

  async getRun(arg: { runId: string }) {
    if (!arg.runId)
      throw new Error(`automation.getRun: "runId" parameter is required`);

    return await this.#saasClient
      .Get<IRun[]>(`automations/automations/${this.#id}/runs`)
      .then((res) => {
        const runData = res.data.filter((r) => r.id == arg.runId);

        if (runData.length == 0)
          throw new Error(
            `automation.getRun: run with id "${arg.runId}" was not found`
          );

        if (runData.length > 1)
          throw new Error(
            `automation.getRun: found more than one run with id "${arg.runId}"`
          );

        return new Run(this.#saasClient, runData[0].id, this.#id, runData[0]);
      });
  }
}
