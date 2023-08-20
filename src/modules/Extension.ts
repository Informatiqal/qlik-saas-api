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

export class Extension {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IExtension;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IExtension) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as IExtension);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<IExtension>(`extensions/${this.id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`extensions/${this.id}`)
      .then((res) => res.status);
  }

  async file(arg: { fileName: string }) {
    return await this.saasClient
      .Get<string>(`extensions/${this.id}/file/${arg.fileName}`)
      .then((res) => res.data);
  }

  async download() {
    return await this.saasClient
      .Get<string>(
        `extensions/${this.id}/file`,
        "application/x-zip-compressed",
        "arraybuffer"
      )
      .then((res) => res.data);
  }
}
