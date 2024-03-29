import { QlikSaaSClient } from "qlik-rest-api";

export interface IAppMedia {
  type: string;
  id: string;
  link: string;
  name: string;
}

export class Media {
  #id: string;
  private shortLink: string;
  #saasClient: QlikSaaSClient;
  details: IAppMedia;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IAppMedia) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.#id = id;
    this.#saasClient = saasClient;
    this.details = details ?? ({} as IAppMedia);
    this.shortLink = this.details.link.replace("/api/v1/", "") ?? "";
  }

  async content() {
    return await this.#saasClient
      .Get<Buffer>(this.shortLink, "", "arraybuffer")
      .then((res) => res.data);
  }

  async remove() {
    return await this.#saasClient
      .Delete(this.shortLink)
      .then((res) => res.status);
  }

  async update(arg: { content: Buffer }) {
    if (!arg.content)
      throw new Error(`appMedia.update: "content" parameter is required`);
    return await this.#saasClient
      .Put(this.shortLink, arg.content, "application/octet-stream")
      .then((res) => res.status);
  }
}
