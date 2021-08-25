export type Actions = "read" | "create" | "update" | "delete";

export type Privileges =
  | "read"
  | "create"
  | "update"
  | "delete"
  | "reload"
  | "publish"
  | "duplicate"
  | "export"
  | "exportdata"
  | "change_owner"
  | "change_space"
  | "export_reduced"
  | "source";

export interface Custom {
  [key: string]: any;
}

export type ResourceType =
  | "app"
  | "collection"
  | "qlikview"
  | "insight"
  | "qvapp"
  | "genericlink"
  | "sharingservicetask"
  | "note";

export interface IEntityRemove {
  /**
   * `ID` of the removed object
   */
  id: string;
  /**
   * `HTTP` response status. If the object is successfully removed the status will be `204`
   */
  status: number;
}
