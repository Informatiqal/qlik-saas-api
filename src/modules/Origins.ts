import { QlikSaaSClient } from "qlik-rest-api";
import { Origin, IClassOrigin, IOrigin } from "./Origin";

export interface IOriginCreate {
  origin: string;
  name?: string;
  description?: string;
  childSrc?: boolean;
  connectSrc?: boolean;
  connectSrcWSS?: boolean;
  fontSrc?: boolean;
  formAction?: boolean;
  frameAncestors?: boolean;
  frameSrc?: boolean;
  imgSrc?: boolean;
  mediaSrc?: boolean;
  objectSrc?: boolean;
  scriptSrc?: boolean;
  styleSrc?: boolean;
  workerSrc?: boolean;
  createdDate?: string;
  modifiedDate?: string;
}

export interface IClassOrigins {
  get(id: string): Promise<IClassOrigin>;
  getAll(): Promise<IClassOrigin[]>;
  generateHeader(): Promise<{ [k: string]: any }>;
  create(arg: IOriginCreate): Promise<IClassOrigin>;
}

export class Origins implements IClassOrigins {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`origins.get: "id" parameter is required`);
    const origin: Origin = new Origin(this.saasClient, id);
    await origin.init();

    return origin;
  }

  // TODO: 400 when called?
  async getAll() {
    return await this.saasClient
      .Get(`csp-origins`)
      .then((res) => res.data as IOrigin[])
      .then((data) => data.map((t) => new Origin(this.saasClient, t.id, t)));
  }

  async generateHeader() {
    return await this.saasClient
      .Get(`csp-origins/actions/generate-header`)
      .then((res) => res.data as { [k: string]: any });
  }

  async create(arg: IOriginCreate) {
    if (!arg.origin)
      throw new Error(`origins.create: "origin" parameter is required`);

    return await this.saasClient
      .Post(`csp-origins`, arg)
      .then((res) => new Origin(this.saasClient, res.data.id, res.data));
  }
}
