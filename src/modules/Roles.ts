import { QlikSaaSClient } from "qlik-rest-api";
import { parseFilter } from "../util/filter";

export interface IRoleCondensed {
  id: string;
  name: string;
  type: string;
  level?: "admin" | "user";
}

export interface IRole extends IRoleCondensed {
  tenantId: string;
  createdAt: string;
  description: string;
  permissions?: string[];
  lastUpdatedAt: string;
  links: {
    self: {
      href: string;
    };
  };
}

export class Roles {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`roles.get: "id" parameter is required`);

    return await this.saasClient
      .Get(`roles/${arg.id}`)
      .then((res) => res.data as IRole);
  }

  async getAll() {
    return await this.saasClient
      .Get(`roles`)
      .then((res) => res.data as IRole[]);
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`roles.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }

}
