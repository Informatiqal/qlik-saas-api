import { QlikSaaSClient } from "qlik-rest-api";

export interface ICmpBase<T> {
  baseline: T;
  comparison: T;
}

export interface ICmpDiffBase {
  id: string;
  title: string;
  sheetId: string;
  objectType: number;
  dataSourceStatus: string;
}

export interface ICmpDiffSingleThreaded extends ICmpDiffBase {}

export interface ICmpDiffSlowUncached extends ICmpDiffBase {}

export interface ICmpDiffSheetUncached extends ICmpDiffBase {}

export interface ICmpDiffObjSlowUncached extends ICmpDiffBase {}

export interface ICmpDiffSheetCached extends ICmpDiffBase {}

export interface ICmpDiffObjNoCached extends ICmpDiffBase {}

export interface ICmpDiffObjHeavy extends ICmpDiffBase {
  cpuSeconds1: ICmpBase<number>;
  cpuSeconds2: ICmpBase<number>;
  cpuQuotient1: ICmpBase<number>;
  cpuQuotient2: ICmpBase<number>;
}

export interface ICmpDiffTopTable {
  name: string;
  byte_size: ICmpBase<number>;
  is_system: ICmpBase<boolean>;
  no_of_rows: ICmpBase<number>;
  dataSourceStatus: string;
}

export interface ICmpDiffTopField {
  name: string;
  byte_size: ICmpBase<number>;
  is_system: ICmpBase<boolean>;
  cardinal: ICmpBase<number>;
  total_count: ICmpBase<number>;
  dataSourceStatus: string;
}

export interface ICmpObj<T> {
  list: T[];
  absoluteDiffAsc: T[];
  relativeDiffAsc: T[];
  absoluteDiffDesc: T[];
  dataSourceStatus: string;
  relativeDiffDesc: T[];
}

export interface IAppEvaluationComparison {
  objHeavy: ICmpObj<ICmpDiffObjHeavy>;
  rowCount: ICmpBase<number>;
  objNoCache: ICmpObj<ICmpDiffObjNoCached>;
  sheetCount: ICmpBase<number>;
  fileSizeMib: ICmpBase<number>;
  objectcount: ICmpBase<number>;
  maxMemoryMib: ICmpBase<number>;
  sheetsCached: ICmpObj<ICmpDiffSheetCached>;
  objSlowCached: ICmpObj<ICmpDiffObjSlowUncached>;
  sheetsUncached: ICmpObj<ICmpDiffSheetUncached>;
  documentSizeMib: ICmpBase<number>;
  objSlowUncached: ICmpObj<ICmpDiffSlowUncached>;
  dataModelSizeMib: ICmpBase<number>;
  hasSectionAccess: ICmpBase<boolean>;
  topFieldsByBytes: ICmpObj<ICmpDiffTopField>;
  topTablesByBytes: ICmpObj<ICmpDiffTopTable>;
  objSingleThreaded: ICmpObj<ICmpDiffSingleThreaded>;
  appOpenTimeSeconds: ICmpBase<number>;
}

export interface IAppEvaluation {
  id: string;
  ID?: string;
  appId: string;
  ended: string;
  events: {
    details: string;
    sheetId: string;
    objectId: string;
    severity: string;
    errorCode: string;
    objectType: string;
    sheetTitle: string;
    objectTitle: string;
    objectVisualization: string;
  }[];
  result: {
    sheets: {
      sheet: {
        id: string;
        title: string;
        sheetId: string;
        objectType: number;
        responseTimeSeconds: number;
      };
      objectCount: number;
      sheetObjects: {
        id: string;
        title: string;
        sheetId: string;
        objectType: number;
        responseTimeSeconds: number;
      }[];
    }[];
    rowCount: number;
    objNoCache: {
      id: string;
      title: string;
      sheetId: string;
      objectType: number;
      responsetimeseconds: number;
    }[];
    sheetCount: number;
    objectCount: number;
    objSlowCached: {
      id: string;
      title: string;
      sheetId: string;
      objectType: number;
      schema: {
        id: string;
        title: string;
        sheetId: string;
        objectType: number;
      };
      cpuQuotients: number[];
      responseTimeSeconds: number;
    }[];
    documentSizeMiB: number;
    objSlowUncached: {
      id: string;
      title: string;
      sheetId: string;
      objectType: number;
      responseTimeSeconds: number;
    }[];
    hasSectionAccess: boolean;
    topFieldsByBytes: {
      name: string;
      byte_size: number;
      is_system: true;
    }[];
    topTablesByBytes: {
      name: string;
      byte_size: number;
      is_system: boolean;
    }[];
    objSingleThreaded: {
      id: string;
      title: string;
      sheetId: string;
      objectType: number;
      cpuQuotient1: number;
    }[];
  };
  status: string;
  appName: string;
  details: {
    errors: string[][];
    warnings: string[][];
    dedicated: boolean;
    objectMetrics: {};
    engineHasCache: boolean;
    concurrentReload: boolean;

    // fileSizeMiB: number;
    // maxMemoryCachedMiB: number;
    // maxMemoryUsageMiB: number;
    // maxMemoryWorkingMiB: number;
    // minMemoryFreeMiB: number;
    // maxMemoryNotFreeMiB: number;
    // physicalMemoryMiB: number;
    // openApp: {
    //   responsetimeseconds: number;
    //   cpuseconds: number[];
    //   cpuquotients: number[];
    // };
    // openAppCached: {
    //   responsetimeseconds: number;
    //   cpuseconds: number[];
    //   cpuquotients: number[];
    // };
  };
  sheetId: string;
  started: string;
  version: number;
  metadata: {
    reloadmeta: {
      cpuspent: string;
      peakmemorybytes: number;
    };
    amountofrows: number;
    amountoffields: number;
    amountoftables: number;
    staticbytesize: number;
    hassectionaccess: boolean;
    amountoffieldvalues: number;
    amountofcardinalfieldvalues: number;
  };
  tenantId: string;
  appItemId: string;
  timestamp: string;
  sheetTitle: string;
}

export class AppEvaluation {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IAppEvaluation;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    details?: IAppEvaluation
  ) {
    if (!id) throw new Error(`evaluations.get: "id" parameter is required`);

    this.#id = id;
    this.#saasClient = saasClient;
    this.details = details ?? ({} as IAppEvaluation);
    if (details && details.ID && !details.id)
      this.details.id = this.details.ID ?? "";
  }

  async init() {
    if (!this.details || Object.keys(this.details).length == 0) {
      this.details = await this.#saasClient
        .Get<IAppEvaluation>(`/app/evaluations/${this.#id}`)
        .then((res) => res.data);
    }
  }

  /**
   * Download a detailed XML log of a specific evaluation
   */
  async download() {
    return await this.#saasClient
      .Get<string>(`apps/evaluations/${this.#id}/actions/download`)
      .then((res) => res.data);
  }

  /**
   * Compare the base evaluation against the provided evaluation id
   *
   * Returns the comparison result AND downloads the log, in XML format
   */
  async compare(arg: { comparisonId: string }) {
    if (!arg.comparisonId)
      throw new Error(
        `evaluation.compare: "comparisonId" parameter is required`
      );

    const [result, log] = await Promise.all([
      this.#saasClient
        .Get<IAppEvaluationComparison>(
          `apps/evaluations/${this.#id}/actions/compare/${arg.comparisonId}?all=true&format=json`
        )
        .then((res) => res.data),
      this.#saasClient
        .Get<string>(
          `apps/evaluations/${this.#id}/actions/compare/${arg.comparisonId}/actions/download`
        )
        .then((res) => res.data),
    ]);

    return { result, log };
  }
}
