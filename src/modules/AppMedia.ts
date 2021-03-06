import { QlikSaaSClient } from "qlik-rest-api";

export class IAppMedia {
  type: string;
  id: string;
  link: string;
  name: string;
}

export interface IClassMedia {
  details: IAppMedia;
  content(): Promise<Buffer>;
  remove(): Promise<number>;
  update(content: Buffer): Promise<number>;
}

export class Media implements IClassMedia {
  private id: string;
  private shortLink: string;
  private saasClient: QlikSaaSClient;
  details: IAppMedia;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IAppMedia) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) {
      this.details = details;
      this.shortLink = this.details.link.replace("/api/v1/", "");
    }
  }

  async content() {
    return await this.saasClient
      .Get(this.shortLink, "", "arraybuffer")
      .then((res) => res.data as Buffer);
  }

  async remove() {
    return await this.saasClient
      .Delete(this.shortLink)
      .then((res) => res.status);
  }

  async update(content: Buffer) {
    if (!content)
      throw new Error(`appMedia.update: "content" parameter is required`);
    return await this.saasClient
      .Put(this.shortLink, content, "application/octet-stream")
      .then((res) => res.status);
  }
}
