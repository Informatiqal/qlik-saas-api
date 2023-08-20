import { QlikSaaSClient } from "qlik-rest-api";
// import { Readable } from "stream";
// import { FormData } from "form-data";
// const FormData = require("form-data");

export interface ITheme {
  id: string;
  tenantId: string;
  userId: string;
  type: string;
  name: string;
  qextFilename: string;
  qextVersion: string;
  description: string;
  version: string;
  author: string;
  supplier: string;
  homepage: string;
  keywords: string;
  license: string;
  repository: string;
  dependencies: {};
  icon: string;
  tags: [];
  file: {};
  createdAt: string;
  updateAt: string;
}

export class Theme {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: ITheme;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ITheme) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details || ({} as ITheme);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<ITheme>(`themes/${this.id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`themes/${this.id}`)
      .then((res) => res.status);
  }

  async file(arg: { fileName: string }) {
    return await this.saasClient
      .Get<string>(`themes/${this.id}/file/${arg.fileName}`)
      .then((res) => res.data);
  }

  async download() {
    return await this.saasClient
      .Get<string>(
        `themes/${this.id}/file`,
        "application/x-zip-compressed",
        "arraybuffer"
      )
      .then((res) => res.data);
  }

  // async update(file: Buffer) {
  //   // let buffer = Buffer.from(file);
  //   // let arraybuffer = Uint8Array.from(buffer).buffer;
  //   // file.buffer;

  //   let stream = new Readable();
  //   stream.push(file);
  //   stream.push(null);

  //   const formData = new FormData();
  //   // ts-ignore
  //   formData.append("file", stream);
  //   formData.append("data", { name: "test" });
  //   return await this.saasClient
  //     .Patch(`themes/${this.id}/file`, formData, "multipart/form-data")
  //     .then((res) => res.data);
  // }
}
