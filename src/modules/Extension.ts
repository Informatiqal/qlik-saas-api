import { QlikSaaSClient } from "qlik-rest-api";

export interface IExtension {
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
  tags: string[];
  preview: string;
  checksum: string;
  bundled: boolean;
  deprecated: string;
  bundle: {
    id: string;
    name: string;
    description: string;
  };
  supernova: boolean;
  file: {};
  createdAt: string;
  updateAt: string;
}

export interface IClassExtension {
  details: IExtension;
  remove(): Promise<number>;
  file(fileName: string): Promise<string>;
  download(): Promise<string>;
}

export class Extension implements IClassExtension {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IExtension;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IExtension) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`extensions/${this.id}`)
        .then((res) => res.data as IExtension);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`extensions/${this.id}`)
      .then((res) => res.status);
  }

  async file(fileName: string) {
    return await this.saasClient
      .Get(`extensions/${this.id}/file/${fileName}`)
      .then((res) => res.data as string);
  }

  async download() {
    return await this.saasClient
      .Get(
        `extensions/${this.id}/file`,
        "application/x-zip-compressed",
        "arraybuffer"
      )
      .then((res) => res.data as string);
  }
}
