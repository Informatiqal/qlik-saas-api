import { QlikSaaSClient } from "qlik-rest-api";
import { Actions } from "../types/types";
import { Assignment, IAssignment, IClassAssignment } from "./Assignment";

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

export interface IAssignmentCreate {
  type?: "user" | "group";
  assigneeId?: string;
  roles?: string[];
}

export interface IClassSpace {
  details: ISpace;
  remove(): Promise<number>;
  update(arg: ISpaceUpdate): Promise<number>;
  assignments(): Promise<IClassAssignment[]>;
}

export class Space implements IClassSpace {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: ISpace;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ISpace) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`spaces/${this.id}`)
        .then((res) => res.data as ISpace);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`spaces/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: ISpaceUpdate) {
    let data: { [k: string]: any } = {};
    if (arg.name) data["name"] = arg.name;
    if (arg.description) data["description"] = arg.description;
    if (arg.ownerId) data["ownerId"] = arg.ownerId;

    return await this.saasClient
      .Put<ISpace>(`spaces/${this.id}`, data)
      .then((res) => {
        this.details = res.data;
        return res.status;
      });
  }

  async assignments() {
    return await this.saasClient
      .Get(`spaces/${this.id}/assignments`)
      .then((res) => res.data as IAssignment[])
      .then((assignments) =>
        assignments.map(
          (assignment) =>
            new Assignment(this.saasClient, assignment.id, this.id, assignment)
        )
      );
  }

  async assignmentCreate(arg: IAssignmentCreate) {
    let data: { [k: string]: any } = {};
    if (arg.type) data["type"] = arg.type;
    if (arg.assigneeId) data["assigneeId"] = arg.assigneeId;
    if (arg.roles) data["roles"] = arg.roles;

    return await this.saasClient
      .Post(`spaces/${this.id}/assignments`, data)
      .then((res) => res.data as IAssignment)
      .then(
        (assignment) =>
          new Assignment(this.saasClient, assignment.id, this.id, assignment)
      );
  }
}
