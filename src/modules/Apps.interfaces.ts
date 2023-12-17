import { ILinks } from "../types/Common";
import { Custom, Privileges, Optional } from "../types/types";

export interface ICreate {
  resource: string;
  canCreate: boolean;
}

export interface IAppAttributes {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  lastReloadTime: string;
  createdDate: string;
  modifiedDate: string;
  owner: string;
  ownerId: string;
  dynamicColor: string;
  published: boolean;
  publishTime: string;
  custom: Custom;
  hasSectionAccess: boolean;
  encrypted: boolean;
  originAppId: string;
  spaceId: string;
  _resourcetype: string;
}

export interface IApp {
  attributes: IAppAttributes;
  privileges?: Privileges[];
  create?: ICreate[];
  scriptVersions?: IScriptVersion[];
}

export interface IResourceAttributes {
  _resourcetype: string;
  createdDate: string;
  description: string;
  dynamicColor: string;
  hasSectionAccess: boolean;
  id: string;
  lastReloadTime: string;
  modifiedDate: string;
  name: string;
  originAppId: string;
  owner: string;
  ownerId: string;
  publishTime: string;
  published: boolean;
  spaceId: string;
  thumbnail: string;
}

export interface IAppDataLineage {
  discriminator: string;
  statement: string;
}

export interface IAppMetaData {
  reload_meta: {
    cpu_time_spent_ms: number;
    hardware: {
      logical_cores: number;
      total_memory: number;
    };
    peak_memory_bytes: number;
  };
  static_byte_size: number;
  fields: [
    {
      name: string;
      src_tables: string[];
      is_system: boolean;
      is_hidden: boolean;
      is_semantic: boolean;
      distinct_only: boolean;
      cardinal: number;
      total_count: number;
      is_locked: boolean;
      always_one_selected: boolean;
      is_numeric: boolean;
      comment: string;
      tags: string[];
      byte_size: number;
      hash: string;
    }
  ];
  tables: [
    {
      name: string;
      is_system: boolean;
      is_semantic: boolean;
      is_loose: boolean;
      no_of_rows: number;
      no_of_fields: number;
      no_of_key_fields: number;
      comment: string;
      byte_size: number;
    }
  ];
  has_section_access: boolean;
  tables_profiling_data: [
    {
      NoOfRows: number;
      FieldProfiling: [
        {
          Name: string;
          FieldTags: string[];
          NumberFormat: {
            Type: string;
            nDec: number;
            UseThou: number;
            Fmt: string;
            Dec: string;
            Thou: string;
          };
          DistinctValues: number;
          DistinctNumericValues: number;
          DistinctTextValues: number;
          NumericValues: number;
          NullValues: number;
          TextValues: number;
          NegValues: number;
          PosValues: number;
          ZeroValues: number;
          Sum: number;
          Sum2: number;
          Average: number;
          Median: number;
          Std: number;
          Min: number;
          Max: number;
          Skewness: number;
          Kurtosis: number;
          Fractiles: string[];
          EmptyStrings: number;
          MaxStringLen: number;
          MinStringLen: number;
          SumStringLen: number;
          AvgStringLen: number;
          FirstSorted: string;
          LastSorted: string;
          MostFrequent: [
            {
              Symbol: {
                Text: string;
                Number: number;
              };
              Frequency: number;
            }
          ];
          FrequencyDistribution: {
            NumberOfBins: number;
            BinsEdges: string[];
            Frequencies: string[];
          };
        }
      ];
    }
  ];
}

export interface IAppCopy {
  name: string;
  description?: string;
  spaceId?: string;
  locale?: string;
}

export interface IAppImport {
  file: Buffer;
  name?: string;
  spaceId?: string;
  mode?: "New" | "AutoReplace";
  appId?: string;
  fallbackName?: string;
}

export interface IAppCreate {
  name: string;
  description?: string;
  spaceId?: string;
  locale?: string;
}

export interface IAppUpdate {
  name: string;
  description?: string;
  ownerId?: string;
}

export interface IAppPublish {
  /**
   * The managed space ID where the app will be published.
   */
  spaceId: string;
  description?: string;
  /**
   * The published app will have data from source or target app. The default is source.
   *
   * * source: Publish with source data
   * * target: Publish with target data
   */
  data?: "source" | "target";
  /**
   * The name (title) of the application.
   *
   * @default false
   */
  appName?: string;
  /**
   * The original is moved instead of copied. The current published state of all objects is kept.
   */
  moveApp?: boolean;
  /**
   * If app is moved, originAppId needs to be provided.
   */
  originAppId?: string;
}

export interface IAppRePublish {
  /**
   * The target ID to be republished.
   */
  targetId: string;
  /**
   * The republished app will have data from source or target app. The default is source.
   *
   * * source: Publish with source data
   * * target: Publish with target data
   */
  data?: "source" | "target";
  /**
   * The description of the application.
   */
  description?: string;
  /**
   * The name (title) of the application.
   */
  appName?: string;
  /**
   * Validate that source app is same as originally published.
   *
   * @default true
   */
  checkOriginAppId?: boolean;
}

export interface IScriptMeta {
  /**
   * Script size
   */
  size: number;
  /**
   * Script ID
   */
  scriptId: string;
  /**
   * User last modifying script version.
   */
  modifierId: string;
  /**
   * Script version last modification time.
   */
  modifiedTime: string;
  /**
   * Description of this script version
   */
  versionMessage: string;
}

export interface IScriptMetaWithScript extends IScriptMeta {
  script: string;
}

export interface IScriptVersion {
  /**
   * Script text
   */
  script: string;
  /**
   * Description of this script version
   */
  versionMessage: string;
}

export interface IScriptLogMeta {
  endTime: string;
  success: boolean;
  duration: number;
  reloadId: string;
}

export interface AppObject {
  attributes: {
    id: string;
    name: string;
    ownerId: string;
    approved: boolean;
    objectType: string;
    description: string;
    genericType:
      | "genericObject"
      | "genericBookmark"
      | "genericMeasure"
      | "genericDimension"
      | "genericVariable";
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  privileges: Privileges;
}

export interface ReportFilter {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  filterType: "REP" | "SUB";
  filterV1_0: {
    fieldsByState: {
      [key: string]: {
        name: string;
        values: {
          valueType: string;
          valueAsText: string;
        }[];
      }[];
    };
  };
  description: string;
  filterVersion: string;
}

export type ReportFilterRequest = Optional<
  Omit<ReportFilter, "id">,
  "ownerId" | "description"
>;
