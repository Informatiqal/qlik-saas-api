import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { ILineageNode } from "./LineageNode";

export interface IClassLineageNodeActions {
  /**
   * Expand node, using "self" as a base
   */
  expand(arg: {
    level: "FIELD" | "TABLE";
    collapse?: boolean;
    up?: number;
  }): Promise<ILineageNode>;
}

export class LineageNodeActions implements IClassLineageNodeActions {
  private id: string;
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient, id: string) {
    this.id = id;
    this.saasClient = saasClient;
  }

  async expand(arg: {
    level: "FIELD" | "TABLE";
    collapse?: boolean;
    up?: number;
  }) {
    if (!arg.level)
      throw new Error(
        `lineageNode.action.expand: "level" parameter is required`
      );

    const urlBuild = new URLBuild(
      `lineage-graphs/nodes/${encodeURIComponent(this.id)}/actions/expand`
    );

    urlBuild.addParam("node", this.id, false);
    urlBuild.addParam("collapse", arg?.collapse);
    urlBuild.addParam("up", arg?.up);
    urlBuild.addParam("level", arg.level);

    return await this.saasClient
      .Get<{ graph: ILineageNode }>(`${urlBuild.getUrl()}`)
      .then((res) => res.data.graph);
  }
}
