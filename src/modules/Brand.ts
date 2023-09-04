import { QlikFormData, QlikSaaSClient } from "qlik-rest-api";
import { BrandActions } from "./BrandActions";
import { BrandFile, IBrandFile, contentTypeMime } from "./BrandFile";

export interface IBrand {
  id: string;
  active: boolean;
  name: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  files: BrandFile[];
}

export interface IBrandResponse {
  id: string;
  active: boolean;
  name: string;
  description: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  files: IBrandFile[];
}

export interface IBrandUpdate {
  path: "name" | "description";
  value: string;
  op: "replace" | "add" | "renew";
}

export class Brand {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IBrand;
  _actions: BrandActions;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IBrand) {
    if (!id) throw new Error(`brands.get: "id" parameter is required`);

    this.details = details ?? ({} as IBrand);
    this.#id = id;
    this.#saasClient = saasClient;
    this._actions = new BrandActions(this.#saasClient, this.#id);
  }

  async init(arg?: { force: true }) {
    if (Object.keys(this.details).length == 0 || arg?.force == true) {
      this.details = await this.#saasClient
        .Get<IBrandResponse>(`brands/${this.#id}`)
        .then((res) => {
          const filesInstances = res.data.files.map(
            (f) => new BrandFile(this.#saasClient, this.#id, f.id, f)
          );

          return {
            active: res.data.active,
            createdAt: res.data.createdAt,
            createdBy: res.data.createdBy,
            description: res.data.description,
            id: res.data.id,
            name: res.data.name,
            updatedAt: res.data.updatedAt,
            updatedBy: res.data.updatedBy,
            files: filesInstances,
          };
        });
    }
  }

  /**
   * Deletes the current brand
   */
  async remove() {
    return await this.#saasClient
      .Delete(`brands/${this.#id}`)
      .then((res) => res.status);
  }

  /**
   * Updates the name or the description of the current brand
   */
  async update(arg: IBrandUpdate[]) {
    if (!arg) throw new Error(`brand.update: update arguments are missing`);

    const data = arg.map((a) => ({
      path: `/${a.path}`,
      value: a.value,
      op: a.op,
    }));

    let updateStatus = -1;
    return await this.#saasClient
      .Patch(`brands/${this.#id}`, data)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  /**
   * Adds file to the existing brand
   */
  async addFile(arg: {
    /**
     * The binary content of the file
     */
    file: Buffer | string;
    /**
     * the possible options are: logo OR styles OR favIcon
     */
    id: "logo" | "styles" | "favIcon";
  }) {
    if (arg.id != "logo" && arg.id != "styles" && arg.id != "favIcon")
      throw new Error(
        `brand.addFile: "id" parameter should be one of "logo" or "styles" or "favIcon". Provided was "${arg.id}"`
      );

    const fd = new QlikFormData();
    fd.append({
      data: arg.file,
      field: "file",
      contentType: contentTypeMime[arg.id],
    });

    let addFileStatus = 0;

    return this.#saasClient
      .Post(`brands/${this.#id}/files/${arg.id}`, fd.getData, fd.getHeaders)
      .then((res) => {
        addFileStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => addFileStatus);
  }
}
