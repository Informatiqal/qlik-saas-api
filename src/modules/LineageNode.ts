import { QlikSaaSClient } from "qlik-rest-api";
import { ILineageGetNodeParams } from "./Lineage";
import { LineageNodeActions } from "./LineageNodeActions";
import { URLBuild } from "../util/UrlBuild";

export interface ILineageNode {
  type: string;
  edges: {
    id: string;
    source: string;
    target: string;
    relation: string[];
    metadata: {
      type: string;
    };
  }[];
  label: string;
  nodes: {
    [k: string]: {
      label: string;
      metadata: {
        type: string;
        subtype?: string;
      };
    };
  };
  directed: boolean;
  metadata: {
    total?: number;
    createdAt?: number;
    producerId?: string;
    specVersion?: string;
    producerType?: string[];
  };
}

export interface ILineageNodeOverviewItem {
  id?: string;
  lineage?: {
    tableQRI: string;
    tableLabel: string;
    resourceQRI: string;
    resourceLabel: string;
  }[];
}

export interface IClassLineageNode {
  details: ILineageNode;
  actions: LineageNodeActions;
  overview(): Promise<ILineageNodeOverviewItem>;
}

export class LineageNode implements IClassLineageNode {
  private id: string;
  private saasClient: QlikSaaSClient;
  private params: ILineageGetNodeParams;
  actions: LineageNodeActions;
  details: ILineageNode;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: ILineageNode,
    params?: ILineageGetNodeParams
  ) {
    if (!id) throw new Error(`lineage.getNode: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    this.params = params ? params : {};
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      const urlBuild = new URLBuild(
        `lineage-graphs/nodes/${encodeURIComponent(this.id)}`
      );
      urlBuild.addParam("collapse", this.params.collapse);
      urlBuild.addParam("up", this.params.up);
      urlBuild.addParam("level", this.params.level);

      if (!this.details) {
        this.details = await this.saasClient
          .Get<{ graph: ILineageNode }>(`${urlBuild.getUrl()}`)
          .then((res) => res.data.graph);
      }
    }

    this.actions = new LineageNodeActions(this.saasClient, this.id);
  }

  async overview() {
    return await this.saasClient
      .Post<{ resource?: ILineageNodeOverviewItem }>(
        `lineage-graphs/nodes/${encodeURIComponent(this.id)}/overview`,
        []
      )
      .then((res) => res.data.resource || ({} as ILineageNodeOverviewItem));
  }
}
