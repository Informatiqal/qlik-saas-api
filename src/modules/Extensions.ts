import { QlikSaaSClient } from "qlik-rest-api";
import { Extension, IClassExtension, IExtension } from "./Extension";
import { FormDataCustom } from "../util/FormData";

//TODO: import extension method
export interface IClassExtensions {
  get(id: string): Promise<IClassExtension>;
  getAll(): Promise<IClassExtension[]>;
  import(file: Buffer, fileName?: string): Promise<IClassExtension>;
}

export class Extensions implements IClassExtensions {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`extensions.get: "id" parameter is required`);
    const extension: Extension = new Extension(this.saasClient, id);
    await extension.init();

    return extension;
  }

  async getAll() {
    return await this.saasClient
      .Get(`extensions`)
      .then((res) => res.data as IExtension[])
      .then((data) => data.map((t) => new Extension(this.saasClient, t.id, t)));
  }

  async import(file: Buffer, fileName?: string) {
    if (!file)
      throw new Error(`extensions.import: "file" parameter is required`);

    if (!fileName) fileName = "some-file.zip";

    const fd = new FormDataCustom();
    fd.append(
      "data",
      JSON.stringify({
        tags: [],
      })
    );

    fd.append("file", file, fileName);
    const data = fd.getData();

    return await this.saasClient
      .Post(`extensions`, data, fd.headers)
      .then((res) => new Extension(this.saasClient, res.data.id, res.data));
  }
}
