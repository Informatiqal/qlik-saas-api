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
      .Get<IRole>(`roles/${arg.id}`)
      .then((res) => res.data);
  }

  async getAll() {
    return await this.saasClient.Get<IRole[]>(`roles?limit=50`).then((res) => res.data);
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`roles.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as IRole[];
    });
  }
}
