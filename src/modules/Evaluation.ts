import { QlikSaaSClient } from "qlik-rest-api";

export interface IEvaluation {
  id: string;
  appId: string;
  appItemId: string;
  appName: string;
  spaceId: string;
  status: string;
  tenantId: string;
  sheetId: string;
  sheetTitle: string;
  userId: string;
  events: {
    severity: string;
    errorcode: string;
    details: string;
    objectid: string;
    objecttype: string;
    objectvisualization: string;
    objecttitle: string;
  }[];
  result: {
    maxmemorymib: number;
    documentsizemib: number;
    filesizemib: number;
    appopentimeseconds: number;
    objectcount: number;
    sheetcount: number;
    rowcount: number;
    datamodelsizemib: number;
    hassectionaccess: boolean;
    objnocache: {
      id: string;
      objectType: number;
      sheetId: string;
      title: string;
      responsetimeseconds1: number;
      responsetimeseconds2: number;
    }[];
    objslowuncached: {
      id: string;
      objectType: number;
      sheetId: string;
      title: string;
      responsetimeseconds1: number;
      responsetimeseconds2: number;
    }[];
    objslowcached: {
      id: string;
      objectType: number;
      sheetId: string;
      title: string;
      schema: {
        id: string;
        objectType: number;
        sheetId: string;
        title: string;
      };
      responsetimeseconds1: number;
      responsetimeseconds2: number;
      cpuquotients1: number[];
      cpuquotients2: number[];
    }[];
    objsinglethreaded: {
      id: string;
      objectType: number;
      sheetId: string;
      title: string;
      cpuquotient1: number;
      cpuquotient2: number;
      cpuseconds1: number;
      cpuseconds2: number;
    }[];
    objheavy: {
      id: string;
      objectType: number;
      sheetId: string;
      title: string;
      cpuquotient1: number;
      cpuquotient2: number;
      cpuseconds1: number;
      cpuseconds2: number;
    }[];
    toptablesbybytes: {
      name: string;
      is_system: boolean;
      byte_size: number;
      no_of_rows: number;
    }[];
    topfieldsbybytes: {
      name: string;
      is_system: true;
      byte_size: number;
      total_count: number;
      cardinal: number;
    }[];
  };
  metadata: {
    staticbytesize: number;
    hassectionaccess: boolean;
    amountoffields: number;
    amountoftables: number;
    amountofrows: number;
    amountofcardinalfieldvalues: number;
    amountoffieldvalues: number;
    reloadmeta: {
      cpuspent: string;
      peakmemorybytes: number;
    };
  };
  details: {
    warnings: string[];
    errors: string[];
    fileSizeMiB: number;
    maxMemoryCachedMiB: number;
    maxMemoryUsageMiB: number;
    maxMemoryWorkingMiB: number;
    minMemoryFreeMiB: number;
    maxMemoryNotFreeMiB: number;
    physicalMemoryMiB: number;
    openApp: {
      responsetimeseconds: number;
      cpuseconds: number[];
      cpuquotients: number[];
    };
    openAppCached: {
      responsetimeseconds: number;
      cpuseconds: number[];
      cpuquotients: number[];
    };
    objectMetrics: {};
    engineHasCache: boolean;
    dedicated: boolean;
    concurrentReload: boolean;
  };
}

export interface IClassEvaluation {
  details: IEvaluation;
  download(): Promise<IEvaluation>;
}

export class Evaluation implements IClassEvaluation {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IEvaluation;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IEvaluation) {
    if (!id) throw new Error(`evaluations.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<IEvaluation>(`evaluations/${this.id}`)
        .then((res) => res.data);
    }
  }

  async download() {
    return await this.saasClient
      .Get<IEvaluation>(`evaluations/${this.id}/download`)
      .then((res) => res.data);
  }
}
