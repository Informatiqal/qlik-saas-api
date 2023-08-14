import { QlikSaaSClient } from "qlik-rest-api";
import { IOriginCreate } from "./Origins";

export interface IOrigin {
  id: string;
  origin: string;
  name: string;
  description: string;
  childSrc: boolean;
  connectSrc: boolean;
  connectSrcWSS: boolean;
  fontSrc: boolean;
  formAction: boolean;
  frameAncestors: boolean;
  frameSrc: boolean;
  imgSrc: boolean;
  mediaSrc: boolean;
  objectSrc: boolean;
  scriptSrc: boolean;
  styleSrc: boolean;
  workerSrc: boolean;
  createdDate: string;
  modifiedDate: string;
}

export interface IClassOrigin {
  details: IOrigin;
  remove(): Promise<number>;
  update(arg: IOriginCreate): Promise<number>;
}

export class Origin implements IClassOrigin {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IOrigin;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IOrigin) {
    if (!id) throw new Error(`origins.get: "id" parameter is required`);

    this.details = details ?? ({} as IOrigin);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`csp-origins/${this.id}`)
        .then((res) => res.data as IOrigin);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`csp-origins/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: IOriginCreate) {
    if (!arg.origin)
      throw new Error(`origins.create: "origin" parameter is required`);

    return await this.saasClient
      .Put<IOrigin>(`csp-origins/${this.id}`, arg)
      .then((res) => {
        this.details = res.data;
        return res.status;
      });
  }
}
