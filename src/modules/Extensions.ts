import { QlikFormData, QlikSaaSClient } from "qlik-rest-api";
import { Extension, IExtension } from "./Extension";
import { parseFilter } from "../util/filter";

export interface IExtensionImportData {
  /**
   * The display name of this extension.
   */
  name: string;
  /**
   * The type of this extension (visualization, etc.).
   */
  type: string;
  /**
   * Icon to show in the client.
   */
  icon?: string;
  /**
   * List of tags.
   */
  tags?: string[];
  /**
   * Author of the extension.
   */
  author?: string;
  /**
   * Object containing meta data regarding the bundle the extension belongs to.
   * If it does not belong to a bundle, this object is not defined.
   */
  bundle?: {
    /**
     * Unique identifier of the bundle.
     */
    id: string;
    /**
     * Name of the bundle.
     */
    name: string;
    /**
     * Description of the bundle.
     */
    description?: string;
  };
  userId?: string;
  /**
   * If the extension is part of an extension bundle.
   */
  bundled?: boolean;
  /**
   * Under which license this extension is published.
   */
  license?: string;
  /**
   * An image that enables users to preview the extension.
   */
  preview?: string;
  /**
   * Version of the extension.
   */
  version?: string;
  /**
   * Checksum of the extension contents.
   */
  checksum?: string;
  /**
   * Home page of the extension.
   */
  homepage?: string;
  /**
   * Keywords for the extension.
   */
  keywords?: string;
  /**
   * Relative path to the extension's entry file, defaults to filename from the qext file.
   */
  loadpath?: string;
  /**
   * Supplier of the extension.
   */
  supplier?: string;
  tenantId?: string;
  /**
   * If the extension is a supernova extension or not.
   */
  supernova?: boolean;
  /**
   * A date noting when the extension was deprecated.
   */
  deprecated?: string;
  /**
   * Link to the extension source code.
   */
  repository?: string;
  /**
   * Description of the extension.
   */
  description?: string;
  /**
   * The version from the qext file that was uploaded with this extension.
   */
  qextVersion?: string;
  /**
   * Map of dependencies describing version of the component it requires.
   */
  dependencies?: {};
  /**
   * The name of the qext file that was uploaded with this extension.
   */
  qextFilename?: string;
}

//TODO: import extension method
export class Extensions {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`extensions.get: "id" parameter is required`);
    const extension: Extension = new Extension(this.saasClient, arg.id);
    await extension.init();

    return extension;
  }

  async getAll() {
    return await this.saasClient
      .Get<IExtension[]>(`extensions?limit=50`)
      .then((res) => res.data)
      .then((data) => data.map((t) => new Extension(this.saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`extensions.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as Extension[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `extensions.removeFilter: "filter" parameter is required`
      );

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  async import(arg: { file: string | Buffer; data: IExtensionImportData }) {
    if (!arg) throw new Error(`extensions.import: no arguments were provided`);
    if (!arg.file)
      throw new Error(`extensions.import: "file" argument is missing`);

    const fd = new QlikFormData();
    
    fd.append({
      field: "file",
      data: arg.file,
      contentType: "application/x-zip-compressed",
    });

    fd.append({
      field: "data",
      data: JSON.stringify(arg.data),
    });

    return await this.saasClient
      .Post<IExtension>("extensions", fd.getData, fd.getHeaders)
      .then((res) => new Extension(this.saasClient, res.data.id, res.data));
  }
}
