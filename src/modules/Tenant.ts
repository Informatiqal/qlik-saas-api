import { QlikSaaSClient } from "qlik-rest-api";
import { ILinksShort } from "../types/Common";

export interface ITenant {
  id: string;
  name: string;
  links: ILinksShort;
  status: "active" | "disabled" | "deleted";
  created: string;
  hostnames: string[];
  lastUpdated: string;
  createdByUser: string;
  enableAnalyticCreation: boolean;
  autoAssignCreateSharedSpacesRoleToProfessionals: boolean;
}

export interface IClassTenant {
  details: ITenant;
}

export class Tenant implements IClassTenant {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: ITenant;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ITenant) {
    if (!id) throw new Error(`tenant.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }
}
