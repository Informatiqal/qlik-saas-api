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

export class Origin {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IOrigin;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IOrigin) {
    if (!id) throw new Error(`origins.get: "id" parameter is required`);

    this.details = details ?? ({} as IOrigin);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: true }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IOrigin>(`csp-origins/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`csp-origins/${this.#id}`)
      .then((res) => res.status);
  }

  async update(arg: IOriginCreate) {
    if (!arg.origin)
      throw new Error(`origins.create: "origin" parameter is required`);

    let updateStatus = 0;

    return await this.#saasClient
      .Put<IOrigin>(`csp-origins/${this.#id}`, arg)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
