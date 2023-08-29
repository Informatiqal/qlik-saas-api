import { QlikFormData, QlikSaaSClient } from "qlik-rest-api";
import { IExtensionImportData } from "./Extensions";

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

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
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

  /**
   * **WARNING!** 
   * 
   * At this point (2023-08-29) not all "data" properties can be updated.
   * Qlik will reply with status 200 ("OK. Extension has been updated.") but the extension
   * is not updated. For example: if we pass new value for "name" property the update request
   * will be ok but the extension name is not updated in Qlik.
   *
   * Although the documentation states that all properties can be passed that is not
   * reflecting the reality. From my experience the only things that can be updates
   * at the moment are the "file" and "data.tags"
   *
   * This method will anyway accept all "data" properties and when one day Qlik enable
   * all properties on their end then this method will not require any updating
   */
  async update(
    arg:
      | {
          file: string | Buffer;
          data: Partial<IExtensionImportData>;
        }
      | {
          file?: undefined;
          data: Partial<IExtensionImportData>;
        }
      | {
          file: string | Buffer;
          data?: undefined;
        }
  ) {
    if (!arg) throw new Error(`extensions.update: no arguments were provided`);
    if (!arg.file && !arg.data)
      throw new Error(
        `extensions.update: "file" and "data" arguments are missing`
      );

    const fd = new QlikFormData();

    if (arg.file)
      fd.append({
        field: "file",
        data: arg.file,
        contentType: "application/x-zip-compressed",
      });

    if (arg.data)
      fd.append({
        field: "data",
        data: JSON.stringify(arg.data),
      });

    let updateStatus = 0;
    return await this.saasClient
      .Patch<IExtension>(`extensions/${this.id}`, fd.getData, fd.getHeaders)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
