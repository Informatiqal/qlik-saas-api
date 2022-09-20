import { QlikSaaSClient } from "qlik-rest-api";

export interface IGroup {
  id: string;
  name: string;
  idpid: string;
  links: {
    href: string;
  };
  status: "active" | "disabled";
  tenantId: string;
  createdAt: string;
  assignedRoles: {
    id: string;
    name: string;
    type: string;
    level: "admin" | "user";
    permissions: string[];
  }[];
  lastUpdatedAt: string;
}

export interface IClassGroup {
  details: IGroup;
  remove(): Promise<number>;
}

export class Group implements IClassGroup {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IGroup;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IGroup) {
    if (!id) throw new Error(`group.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<IGroup>(`groups/${this.id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`groups/${this.id}`)
      .then((res) => res.status);
  }
}
