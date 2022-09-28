import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { ILineageNode } from "./LineageNode";

export interface IClassLineageImpact {
  expand(arg: {
    id: string;
    node: string;
    level: "FIELD" | "TABLE" | "RESOURCE";
    collapse?: boolean;
    up?: number;
  }): Promise<ILineageNode>;
  search(arg: {
    id: string;
    filter: string;
    terms?: string;
    down?: number;
  }): Promise<ILineageNode[]>;
  overview(arg: { id: string; down?: number }): Promise<ILineageNode>;
  source(arg: { id: string }): Promise<ILineageNode[]>;
}

export class LineageImpact implements IClassLineageImpact {
  private id: string;
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async expand(arg: {
    id: string;
    node: string;
    level: "FIELD" | "TABLE" | "RESOURCE";
    collapse?: boolean;
    up?: number;
  }) {
    if (!arg.id)
      throw new Error(`lineage.impact.expand: "id" parameter is required`);
    if (!arg.node)
      throw new Error(`lineage.impact.expand: "node" parameter is required`);
    if (!arg.level)
      throw new Error(`lineage.impact.expand: "level" parameter is required`);

    const urlBuild = new URLBuild(
      `lineage-graphs/impact/${encodeURIComponent(arg.id)}/actions/expand`
    );

    urlBuild.addParam("node", arg.node, false);
    urlBuild.addParam("collapse", arg?.collapse);
    urlBuild.addParam("up", arg?.up);
    urlBuild.addParam("level", arg.level);

    return await this.saasClient
      .Get<{ graph: ILineageNode }>(`${urlBuild.getUrl()}`)
      .then((res) => res.data.graph);
  }

  async search(arg: {
    id: string;
    filter: string;
    terms?: string;
    down?: number;
  }) {
    if (!arg.id)
      throw new Error(`lineage.impact.search: "id" parameter is required`);
    if (!arg.filter)
      throw new Error(`lineage.impact.search: "filter" parameter is required`);

    const urlBuild = new URLBuild(
      `lineage-graphs/impact/${encodeURIComponent(arg.id)}/actions/search`
    );

    urlBuild.addParam("down", arg?.down);
    urlBuild.addParam("filter", arg.filter);

    return await this.saasClient
      .Get<{ graphs: ILineageNode[] }>(`${urlBuild.getUrl()}`)
      .then((res) => res.data.graphs || []);
  }

  async overview(arg: { id: string; down?: number }) {
    if (!arg.id)
      throw new Error(`lineage.impact.overview: "id" parameter is required`);

    const urlBuild = new URLBuild(
      `lineage-graphs/impact/${encodeURIComponent(this.id)}/overview`
    );
    urlBuild.addParam("down", arg.down);

    return await this.saasClient
      .Get<{ graph: ILineageNode }>(`${urlBuild.getUrl()}`)
      .then((res) => res.data.graph || ({} as ILineageNode));
  }

  async source(arg: { id: string }) {
    if (!arg.id)
      throw new Error(`lineage.impact.source: "id" parameter is required`);

    return await this.saasClient
      .Get<{ graphs: ILineageNode[] }>(
        `lineage-graphs/impact/${encodeURIComponent(this.id)}/source`
      )
      .then((res) => res.data.graphs || []);
  }
}
