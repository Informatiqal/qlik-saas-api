import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { IClassUser, IUser, User } from "./User";

export interface IUserCreate {
  tenantId: string;
  subject: string;
  name: string;
  picture?: string;
  email?: string;
  assignedRoles?: string[];
  status?: "active" | "inactive" | string;
}

export interface IClassUsers {
  /**
   * Info about the tenant accessing the endpoint
   */
  get(id: string): Promise<IClassUser>;
  /**
   * Retrieves a list of users matching the filter using an advanced query string
   * @param filter example:
   *     (id eq \"626949b9017b657805080bbd\" or id eq \"626949bf017b657805080bbe\") and (status eq \"active\" or status eq \"deleted\")
   * @param [sort] OPTIONAL name; +name; -name
   */
  getFilter(filter: string, sort?: string): Promise<IUser[]>;
  /**
   * Returns a list of users. Each element of the list is an instance of the User class
   */
  getAll(): Promise<IClassUser[]>;
  /**
   * Returns the number of users in a given tenant
   * @returns number
   */
  actionsCount(): Promise<{ total: number }>;
  me(): Promise<IClassUser>;
  /**
   * Returns the metadata with regard to the user configuration. Deprecated, use GET /v1/roles instead
   * @deprecated It will no longer be available after 01/11/2022.
   *     The role names can now be retrieved from the list roles endpoint.
   */
  metadata(): Promise<{ valid_roles: string[] }>;
  /**
   * Creates an invited user
   * @returns IClassUser
   */
  create(arg: IUserCreate): Promise<IClassUser>;
}

export class Users implements IClassUsers {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    return await this.saasClient
      .Post("users/actions/filter", { filter: `id eq "${id}"` })
      .then((res) => res.data.data as IUser[])
      .then((userData) => {
        return userData.length == 1
          ? new User(this.saasClient, userData[0].id, userData[0])
          : undefined;
      });
  }

  async getFilter(filter: string, sort?: string) {
    const urlBuild = new URLBuild(`users/actions/filter`);
    urlBuild.addParam("NoData", sort);

    if (!filter)
      throw new Error(`users.getFilter: "filter" parameter is required`);

    return await this.saasClient
      .Post(urlBuild.getUrl(), { filter })
      .then((res) => res.data as IUser[]);
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
