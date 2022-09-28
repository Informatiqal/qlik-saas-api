import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";
import { LineageImpact } from "./LineageImpact";
import { ILineageNode, LineageNode } from "./LineageNode";

export interface IClassLineage {
  getNode(arg: { id: string }): Promise<LineageNode>;
  impact: LineageImpact;
  expandNode(arg: {
    id: string;
    level: "FIELD" | "TABLE";
    collapse?: boolean;
    up?: number;
  }): Promise<ILineageNode>;
  searchNode(arg: {
    id: string;
    filter: string;
    terms?: string;
    collapse?: boolean;
    up?: number;
  }): Promise<ILineageNode[]>;
}

export interface ILineageGetNodeParams {
  collapse?: boolean;
  level?: "FIELD" | "TABLE" | "RESOURCE";
  up?: number;
}

export class Lineage implements IClassLineage {
  private saasClient: QlikSaaSClient;
  impact: LineageImpact;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
    this.impact = new LineageImpact(this.saasClient);
  }

  async getNode(arg: { id: string; params?: ILineageGetNodeParams }) {
    if (!arg.id)
      throw new Error(`lineageNode.getNode: "id" parameter is required`);

    const lineageNode: LineageNode = new LineageNode(
      this.saasClient,
      arg.id,
      undefined,
      arg.params
    );
    await lineageNode.init();

    return lineageNode;
  }

  // async impact(id: string) {
  //   return new LineageImpact(this.saasClient, id);
  // }

  /**
   * Expand node from the provided id (qri) and level
   */
  async expandNode(arg: {
    id: string;
    node: string;
    level: "FIELD" | "TABLE";
    collapse?: boolean;
    up?: number;
  }) {
    if (!arg.id)
      throw new Error(`lineage.expandNode: "id" parameter is required`);
    if (!arg.id) throw new Error(`lineage.node: "node" parameter is required`);
    if (!arg.level)
      throw new Error(`lineage.expandNode: "level" parameter is required`);

    const urlBuild = new URLBuild(
      `lineage-graphs/nodes/${encodeURIComponent(arg.id)}/actions/expand`
    );

    urlBuild.addParam("collapse", arg?.collapse);
    urlBuild.addParam("up", arg?.up);
    urlBuild.addParam("level", arg.level);

    return await this.saasClient
      .Get<{ graph: ILineageNode }>(`${urlBuild.getUrl()}`)
      .then((res) => res.data.graph);
  }

  /**
   * Expand node from the provided id (qri) and level
   */
  async searchNode(arg: {
    id: string;
    filter: string;
    terms?: string;
    collapse?: boolean;
    up?: number;
  }) {
    if (!arg.id)
      throw new Error(`lineage.searchNode: "id" parameter is required`);
    if (!arg.filter)
      throw new Error(`lineage.searchNode: "filter" parameter is required`);

    const urlBuild = new URLBuild(
      `lineage-graphs/nodes/${encodeURIComponent(arg.id)}/actions/search`
    );

    urlBuild.addParam("collapse", arg?.collapse);
    urlBuild.addParam("up", arg?.up);
    urlBuild.addParam("filter", arg.filter);

    return await this.saasClient
      .Get<{ graphs: ILineageNode[] }>(`${urlBuild.getUrl()}`)
      .then((res) => res.data.graphs);
  }
}
