import { QlikSaaSClient } from "qlik-rest-api";
import { Actions } from "../types/types";
import { Assignment, IAssignment } from "./Assignment";

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

export class Space {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: ISpace;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ISpace) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.details = details ?? ({} as ISpace);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.saasClient
        .Get<ISpace>(`spaces/${this.id}`)
        .then((res) => res.data);
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

    let updateStatus = 0;

    return await this.saasClient
      .Put<ISpace>(`spaces/${this.id}`, data)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  async assignments() {
    return await this.saasClient
      .Get<IAssignment[]>(`spaces/${this.id}/assignments`)
      .then((res) => res.data)
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
      .Post<IAssignment>(`spaces/${this.id}/assignments`, data)
      .then((res) => res.data)
      .then(
        (assignment) =>
          new Assignment(this.saasClient, assignment.id, this.id, assignment)
      );
  }
}
