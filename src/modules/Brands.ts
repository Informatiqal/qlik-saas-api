import { QlikFormData, QlikSaaSClient } from "qlik-rest-api";
import { Brand, IBrand } from "./Brand";
import { contentTypeMime } from "./BrandFile";
import { parseFilter } from "../util/filter";

export interface IBrandCreate {
  /**
   * The path and name of a JPG or PNG file that will be adjusted to fit in a 'box'
   * measuring 109px in width and 62 px in height while maintaining aspect ratio.
   * Maximum size of 300 KB, but smaller is recommended.
   */
  logo?: string;
  /**
   * Name of the brand.
   */
  name: string;
  /**
   * @NOT_OPERATIONAL
   *
   *
   * The path and name of a JSON file to define brand style settings.
   * Maximum size is 100 KB. This property is not currently operational.
   *
   */
  styles?: string;
  /**
   * The path and name of a properly formatted ICO file. Maximum size is 100 KB.
   */
  favIcon?: string;
  /**
   * Description of the brand.
   */
  description?: string;
}

export class Brands {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  /**
   * Get specific brand (by brand ID)
   */
  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`brands.get: "id" parameter is required`);
    const brand: Brand = new Brand(this.saasClient, arg.id);
    await brand.init();

    return brand;
  }

  /**
   * Get all existing brands
   */
  async getAll() {
    return await this.saasClient
      .Get<{ data: IBrand[] }>(`brands`)
      .then((res) => res.data.data ?? res.data ?? [])
      .then((data) => data.map((t) => new Brand(this.saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`brands.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) =>
      entities.filter((f) => parseFilter(arg.filter, "f.details"))
    );
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`brands.removeFilter: "filter" parameter is required`);

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  /**
   * Create new brand
   */
  async create(arg: IBrandCreate) {
    if (!arg.name)
      throw new Error(`brands.create: "name" parameter is required`);

    const fd = new QlikFormData();
    fd.append({
      data: arg.name,
      field: "name",
    });

    if (arg.favIcon)
      fd.append({
        data: arg.favIcon,
        field: "favIcon",
        contentType: contentTypeMime.favIcon,
      });

    if (arg.logo)
      fd.append({
        data: arg.logo,
        field: "logo",
        contentType: contentTypeMime.logo,
      });

    if (arg.styles)
      fd.append({
        data: arg.name,
        field: "styles",
        // contentType: contentTypeMime.styles,
      });

    return await this.saasClient
      .Post<IBrand>(`brands`, fd.getData, fd.getHeaders)
      .then((res) => new Brand(this.saasClient, res.data.id, res.data));
  }
}
