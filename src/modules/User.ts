import { QlikSaaSClient } from "qlik-rest-api";

export interface IUser {
  id: string;
  tenantId: string;
  subject: string;
  status: "active" | "invited" | "disabled" | string;
  inviteExpiry: number;
  name: string;
  created?: string;
  createdAt?: string;
  lastUpdated?: string;
  lastUpdatedAt?: string;
  picture: string;
  email: string;
  roles?: string[];
  assignedRoles?: string[];
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

// TODO: provide the options for "op"?
export interface IUserUpdate {
  path:
    | "name"
    | "roles"
    | "inviteExpiry"
    | "zoneinfo"
    | "locale"
    | "preferredZoneinfo"
    | "preferredLocale"
    | string;
  value: string;
  // op?: "replace" | "add" | "renew";
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
    if (!id) throw new Error(`app.get: "id" parameter is required`);

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
      return { path: `/${a.path}`, value: a.value, op: "replace" };
    });

    return await this.saasClient
      .Patch(`users/${this.id}`, data)
      .then((res) => res.status);
  }
}
