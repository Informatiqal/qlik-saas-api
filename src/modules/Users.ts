import { QlikSaaSClient } from "qlik-rest-api";
import { IClassUser, IUser, User } from "./User";

export interface IUserCreate {
  tenantId: string;
  subject: string;
  name: string;
  picture?: string;
  email?: string;
  roles?: string[];
  status?: "active" | "inactive" | string;
}

export interface IClassUsers {
  get(id: string): Promise<IClassUser>;
  getAll(): Promise<IClassUser[]>;
  actionsCount(): Promise<{ total: number }>;
  me(): Promise<IClassUser>;
  metadata(): Promise<{ valid_roles: string[] }>;
  create(arg: IUserCreate): Promise<IClassUser>;
}

export class Users implements IClassUsers {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`users.get: "id" parameter is required`);
    const user: User = new User(this.saasClient, id);
    await user.init();

    return user;
  }

  async getAll() {
    return await this.saasClient
      .Get(`users`)
      .then((res) => res.data as IUser[])
      .then((data) => data.map((t) => new User(this.saasClient, t.id, t)));
  }

  async actionsCount() {
    return await this.saasClient
      .Get(`users/actions/count`)
      .then((res) => res.data);
  }

  async me() {
    return await this.saasClient
      .Get(`users/me`)
      .then((res) => new User(this.saasClient, res.data.id, res.data));
  }

  async metadata() {
    return await this.saasClient.Get(`users/metadata`).then((res) => res.data);
  }

  async create(arg: IUserCreate) {
    if (!arg.name)
      throw new Error(`users.create: "name" parameter is required`);
    if (!arg.subject)
      throw new Error(`users.create: "subject" parameter is required`);
    if (!arg.tenantId)
      throw new Error(`users.create: "tenantId" parameter is required`);

    return await this.saasClient
      .Post(`users`, arg)
      .then((res) => new User(this.saasClient, res.data.id, res.data));
  }
}
