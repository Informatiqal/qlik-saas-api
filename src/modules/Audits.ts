import { QlikSaaSClient } from "qlik-rest-api";
import { URLBuild } from "../util/UrlBuild";

export interface IAudit {
  id: string;
  source: string;
  contentType: string;
  eventType: string;
  eventId: string;
  eventTime: string;
  tenantId: string;
  userId: string;
  data: {
    createdByUser: string;
    description: string;
    id: string;
    sub: string;
    subType: string;
    tenantId: string;
  };
  links: {
    Self: {
      Href: string;
    };
    self: {
      href: string;
    };
  };
}

export interface IAudit {
  id: string;
  source: string;
  contentType: string;
  eventType: string;
  eventId: string;
  eventTime: string;
  tenantId: string;
  userId: string;
  data: {
    createdByUser: string;
    description: string;
    id: string;
    sub: string;
    subType: string;
    tenantId: string;
  };
  links: {
    Self: {
      Href: string;
    };
    self: {
      href: string;
    };
  };
}

export interface IAuditsFilter {
  id?: string[];
  source?: string;
  eventType?: string;
  eventTime?: string;
  userId?: string;
}

export interface IAuditsSettings {
  EventTTL: number;
  ArchiveEnabled: boolean;
}

export interface IClassAudits {
  get(id: string): Promise<IAudit>;
  getAll(arg: IAuditsFilter): Promise<IAudit[]>;
  settings(): Promise<IAuditsSettings>;
  sources(): Promise<string[]>;
  types(): Promise<string[]>;
  archive(date: string): Promise<IAudit[]>;
}

export class Audits implements IClassAudits {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async get(id: string) {
    if (!id) throw new Error(`audits.get: "id" parameter is required`);
    return await this.saasClient
      .Get(`audits/${id}`)
      .then((res) => res.data as IAudit);
  }

  async getAll(arg: IAuditsFilter) {
    const urlBuild = new URLBuild("audits");
    urlBuild.addParam("id", arg.id);
    urlBuild.addParam("source", arg.source);
    urlBuild.addParam("eventType", arg.eventType);
    urlBuild.addParam("eventTime", arg.eventTime);
    urlBuild.addParam("userId", arg.userId);

    return await this.saasClient
      .Get(urlBuild.getUrl())
      .then((res) => res.data as IAudit[]);
  }

  async settings() {
    return await this.saasClient
      .Get(`audits/settings`)
      .then((res) => res.data as IAuditsSettings);
  }

  async sources() {
    return await this.saasClient
      .Get(`audits/sources`)
      .then((res) => res.data as string[]);
  }

  async types() {
    return await this.saasClient
      .Get(`audits/types`)
      .then((res) => res.data as string[]);
  }

  // TODO: different types are returned in data:{...}
  async archive(date: string) {
    if (!date) throw new Error(`audits.archive: "date" parameter is required`);

    return await this.saasClient
      .Get(`audits/archive?date=${date}`)
      .then((res) => res.data as IAudit[]);
  }
}
