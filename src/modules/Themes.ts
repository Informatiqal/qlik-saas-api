import { QlikSaaSClient } from "qlik-rest-api";
import { ITheme, Theme } from "./Theme";
import { parseFilter } from "../util/filter";

// export interface IThemeCreate {
//   id: string;
//   file: Buffer;
// }

export class Themes {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`themes.get: "id" parameter is required`);

    const theme: Theme = new Theme(this.#saasClient, arg.id);
    await theme.init();

    return theme;
  }

  async getAll() {
    return await this.#saasClient
      .Get<ITheme[]>(`themes?limit=50`)
      .then((res) => res.data)
      .then((data) => data.map((t) => new Theme(this.#saasClient, t.id, t)));
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`themes.getFilter: "filter" parameter is required`);

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as Theme[];
    });
  }

  async removeFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(`themes.removeFilter: "filter" parameter is required`);

    return await this.getFilter(arg).then((entities) =>
      Promise.all(
        entities.map((entity) =>
          entity.remove().then((s) => ({ id: entity.details.id, status: s }))
        )
      )
    );
  }

  // async create(arg: IThemeCreate) {
  //   return await this.#saasClient
  //     .Post(`themes`, arg)
  //     .then((res) => new Theme(this.#saasClient, res.data.id, res.data));
  // }
}
