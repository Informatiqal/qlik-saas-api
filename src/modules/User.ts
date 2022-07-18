import { QlikSaaSClient } from "qlik-rest-api";
import { IRoleCondensed } from "./Roles";

export interface IUser {
  id: string;
  tenantId: string;
  subject: string;
  status: "active" | "invited" | "disabled" | "deleted";
  inviteExpiry: number;
  name: string;
  createdAt?: string;
  lastUpdatedAt?: string;
  picture: string;
  email: string;
  assignedRoles: IRoleCondensed[];
  groups?: string[];
  assignedGroups?: IAssignedGroup[];
  zoneinfo: string;
  locale: string;
  preferredZoneinfo: string;
  preferredLocale: string;
  links: {
    self: {
      href: string;
    };
  };
}

export interface IAssignedGroup {
  id: string;
  name: string;
  assignedRoles?: [];
}

export interface IAssignedRole {
  id: string;
  name: string;
  type: string;
  level: string;
}

export interface IUserUpdate {
  path:
    | "name"
    | "assignedRoles"
    | "inviteExpiry"
    | "zoneinfo"
    | "locale"
    | "preferredZoneinfo"
    | "preferredLocale"
    | "status"
    | string;
  value: string;
  op: "replace" | "add" | "renew";
}

export interface IClassUser {
  details: IUser;
  remove(): Promise<number>;
  update(arg: IUserUpdate[]): Promise<number>;
}

export class User implements IClassUser {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IUser;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IUser) {
    if (!id) throw new Error(`user.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`users/${this.id}`)
        .then((res) => res.data as IUser);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`users/${this.id}`)
      .then((res) => res.status);
  }

  async update(arg: IUserUpdate[]) {
    const data = arg.map((a) => {
      this.details[a.path] = a.value;
      return { path: `/${a.path}`, value: a.value, op: a.op };
    });

    return await this.saasClient
      .Patch(`users/${this.id}`, data)
      .then((res) => res.status);
  }
}
