import { QlikSaaSClient } from "qlik-rest-api";
import { IClassTheme, ITheme, Theme } from "./Theme";

// export interface IThemeCreate {
//   id: string;
//   file: Buffer;
// }

export interface IClassThemes {
  get(id: string): Promise<IClassTheme>;
  getAll(): Promise<IClassTheme[]>;
}

export class Themes implements IClassThemes {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`themes.get: "id" parameter is required`);
    const theme: Theme = new Theme(this.saasClient, id);
    await theme.init();

    return theme;
  }

  async getAll() {
    return await this.saasClient
      .Get(`themes`)
      .then((res) => res.data as ITheme[])
      .then((data) => data.map((t) => new Theme(this.saasClient, t.id, t)));
  }

  // async create(arg: IThemeCreate) {
  //   return await this.saasClient
  //     .Post(`themes`, arg)
  //     .then((res) => new Theme(this.saasClient, res.data.id, res.data));
  // }
}
