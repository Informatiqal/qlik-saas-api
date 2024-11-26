import { QlikFormData, QlikSaaSClient } from "qlik-rest-api";

export class DiProjectActions {
  #id: string;
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient, id: string) {
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async export(arg?: { includeBindings: boolean }) {
    return this.#saasClient
      .Post(
        `di-projects/${this.#id}/actions/export`,
        {
          includeBindings: false,
          ...(arg || {}),
        },
        "arraybuffer"
      )
      .then((a) => a.data as Buffer);
  }

  async import(arg: {
    /**
     * The binary content of the file
     */
    file: Buffer | string;
  }) {
    const fd = new QlikFormData();
    fd.append({
      data: arg.file,
      field: "zip",
    });

    return this.#saasClient
      .Post(`di-projects/${this.#id}/actions/import`, fd.getData, fd.getHeaders)
      .then((res) => res.status);
  }
}
