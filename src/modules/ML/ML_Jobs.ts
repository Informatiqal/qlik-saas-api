import { QlikSaaSClient } from "qlik-rest-api";
import { Actions } from "../../types/types";
import { SpaceAssignments } from "../SpaceAssignments";

export interface ISpace {
  id: string;
  type: string;
  ownerId: string;
  tenantId: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  meta: {
    actions: Actions[];
    roles: string[];
    assignableRoles: string[];
  };
  links: {
    self: {
      href: string;
    };
    assignments: {
      href: string;
    };
  };
}

export interface ISpaceUpdate {
  name?: string;
  description?: string;
  ownerId?: string;
}

export class ML_Jobs {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: ISpace;
  assignments: SpaceAssignments;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ISpace) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as ISpace);
    this.#id = id;
    this.#saasClient = saasClient;
    this.assignments = new SpaceAssignments(this.#saasClient, this.#id);
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<ISpace>(`spaces/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`spaces/${this.#id}`)
      .then((res) => res.status);
  }

  async update(arg: ISpaceUpdate) {
    let data: { [k: string]: any } = {};
    if (arg.name) data["name"] = arg.name;
    if (arg.description) data["description"] = arg.description;
    if (arg.ownerId) data["ownerId"] = arg.ownerId;

    let updateStatus = 0;

    return await this.#saasClient
      .Put<ISpace>(`spaces/${this.#id}`, data)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
