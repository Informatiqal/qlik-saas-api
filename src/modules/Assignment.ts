import { QlikSaaSClient } from "qlik-rest-api";

export interface IAssignment {
  id: string;
  type: "user" | "group";
  assigneeId: string;
  roles: string[];
  spaceId: string;
  tenantId: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  links: {
    self: {
      href: string;
    };
    space: {
      href: string;
    };
  };
}

export interface IClassAssignment {
  details: IAssignment;
  remove(): Promise<number>;
  update(roles: string[]): Promise<number>;
}

export class Assignment implements IClassAssignment {
  private id: string;
  private spaceId: string;
  private saasClient: QlikSaaSClient;
  details: IAssignment;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    spaceId: string,
    details?: IAssignment
  ) {
    if (!id) throw new Error(`assignment.get: "id" parameter is required`);
    if (!spaceId) throw new Error(`assignment.get: "id" parameter is required`);

    this.details = details ?? ({} as IAssignment);
    this.id = id;
    this.spaceId = spaceId;
    this.saasClient = saasClient;
  }

  async remove() {
    return await this.saasClient
      .Delete(`spaces/${this.spaceId}/assignments/${this.id}`)
      .then((res) => res.status);
  }

  async update(roles: string[]) {
    return await this.saasClient
      .Put(`spaces/${this.spaceId}/assignments/${this.id}`, { roles: roles })
      .then((res) => {
        this.details.roles = roles;
        return res.status;
      });
  }
}
