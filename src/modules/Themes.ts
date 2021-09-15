import { QlikSaaSClient } from "qlik-rest-api";
import { FormDataCustom } from "../util/FormData";
import { IClassTheme, ITheme, Theme } from "./Theme";

export interface IClassThemes {
  get(id: string): Promise<IClassTheme>;
  getAll(): Promise<IClassTheme[]>;
  import(file: Buffer, fileName?: string): Promise<IClassTheme>;
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

  async import(file: Buffer, fileName?: string) {
    if (!file) throw new Error(`themes.import: "file" parameter is required`);

    if (!fileName) fileName = "some-file.zip";

    const fd = new FormDataCustom();
    fd.append(
      "data",
      JSON.stringify({
        tags: [],
      })
    );

    fd.append("file", file, fileName);
    const data = fd.getData();

    return await this.saasClient
      .Post(`themes`, data, fd.headers)
      .then((res) => new Theme(this.saasClient, res.data.id, res.data));
  }
}
