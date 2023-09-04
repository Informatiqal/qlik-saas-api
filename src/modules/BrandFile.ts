import { QlikSaaSClient, QlikFormData } from "qlik-rest-api";

export interface IBrandFile {
  id: "logo" | "styles" | "favIcon";
  eTag: string;
  path: string;
  contentType: string;
}

export const contentTypeMime = {
  logo: "image/png",
  styles: "text/css",
  favIcon: "image/x-icon",
};

export class BrandFile {
  #id: string;
  private brandId: string;
  #saasClient: QlikSaaSClient;
  details: IBrandFile;
  constructor(
    saasClient: QlikSaaSClient,
    brandId: string,
    id: string,
    details: IBrandFile
  ) {
    this.#id = id;
    this.brandId = brandId;
    this.#saasClient = saasClient;
    this.details = details;
  }

  /**
   * Download the current brand file
   */
  async download() {
    return this.#saasClient
      .Get<string>(`brands/${this.brandId}/files/${this.#id}`)
      .then((res) => res.data);
  }

  /**
   * Remove the current brand file from the brand
   */
  async remove() {
    return this.#saasClient
      .Delete(`brands/${this.brandId}/files/${this.#id}`)
      .then((res) => res.status);
  }

  /**
   * Update the content of the current brand file
   */
  async update(arg: { file: string }) {
    const fd = new QlikFormData();
    fd.append({
      field: "file",
      data: arg.file,
      contentType: contentTypeMime[this.#id],
    });

    return this.#saasClient
      .Put(`brands/${this.brandId}/files/${this.#id}`, fd.getData, fd.getHeaders)
      .then((res) => res.status);
  }
}
