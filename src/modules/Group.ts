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

export type IGroupUpdate =
  | {
      id: string;
    }
  | { name: string };

export class Group {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IGroup;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IGroup) {
    if (!id) throw new Error(`group.get: "id" parameter is required`);

    this.details = details ?? ({} as IGroup);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init(arg?: { force: true }) {
    if (Object.keys(this.details).length == 0 || arg?.force == true) {
      this.details = await this.saasClient
        .Get(`groups/${this.id}`)
        .then((res) => res.data as IGroup);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`groups/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: IGroupUpdate[]) {
    if (!arg) throw new Error(`group.update: update arguments are missing`);

    const data = arg.map((a) => ({
      path: `/assignedRoles`,
      value: a,
      op: "replace",
    }));

    let updateStatus: number = -1;

    return await this.saasClient
      .Patch(`groups/${this.id}`, data)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }
}
