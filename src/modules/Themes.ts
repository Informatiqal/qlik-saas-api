import { QlikSaaSClient } from "qlik-rest-api";
import { ITheme, Theme } from "./Theme";
import { parseFilter } from "../util/filter";

// export interface IThemeCreate {
//   id: string;
//   file: Buffer;
// }

export class Themes {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`themes.get: "id" parameter is required`);

    const theme: Theme = new Theme(this.saasClient, arg.id);
    await theme.init();

    return theme;
  }

  async getAll() {
    return await this.saasClient
      .Get(`themes`)
      .then((res) => res.data as ITheme[])
      .then((data) => data.map((t) => new Theme(this.saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`themes.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) =>
      entities.filter((f) => eval(parseFilter(arg.filter, "f.details")))
    );
  }  

  // async create(arg: IThemeCreate) {
  //   return await this.saasClient
  //     .Post(`themes`, arg)
  //     .then((res) => new Theme(this.saasClient, res.data.id, res.data));
  // }
}
