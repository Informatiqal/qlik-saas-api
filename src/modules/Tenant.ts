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
  autoAssignDataServicesContributorRoleToProfessionals: boolean;
  autoAssignPrivateAnalyticsContentCreatorRoleToProfessionals: boolean;
}

export interface ITenantUpdate {
  path: string;
  value: string;
  op: "replace" | "add" | "renew";
}

export type DeactivateStatus = {
  id: string;
  status: string;
  estimatedPurgeDate: string;
};

export class Tenant {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: ITenant;
  constructor(saasClient: QlikSaaSClient, id: string, details?: ITenant) {
    if (!id) throw new Error(`tenant.get: "id" parameter is required`);

    this.details = details ?? ({} as ITenant);
    this.id = id;
    this.saasClient = saasClient;
  }

  async init(arg?: { force: true }) {
    if (Object.keys(this.details).length == 0 || arg?.force == true) {
      this.details = await this.saasClient
        .Get<ITenant>(`tenants/${this.id}`)
        .then((res) => res.data);
    }
  }

  async update(arg: ITenantUpdate[]) {
    if (!arg) throw new Error(`tenant.update: update arguments are missing`);

    const data = arg.map((a) => ({
      path: `/${a.path}`,
      value: a.value,
      op: a.op,
    }));

    let updateStatus: number = -1;

    return await this.saasClient
      .Patch(`tenants/${this.id}`, data)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  async reactivate() {
    let status = 200;

    return await this.saasClient
      .Post(`tenants/${this.id}/actions/reactivate`, {})
      .then((res) => {
        status = res.status;
        return this.init({ force: true });
      })
      .then(() => status);
  }

  async deactivate(arg?: { purgeAfterDays: number }) {
    if (arg && !arg.purgeAfterDays)
      throw new Error(
        `tenant.deactivate: "purgeAfterDays" parameter is missing`
      );

    let deactivateData: DeactivateStatus = {
      id: "",
      status: "",
      estimatedPurgeDate: "",
    };

    return await this.saasClient
      .Post<DeactivateStatus>(
        `tenants/${this.id}/actions/deactivate`,
        arg?.purgeAfterDays ? { purgeAfterDays: arg.purgeAfterDays } : {}
      )
      .then((res) => {
        deactivateData = res.data;
        return this.init({ force: true });
      })
      .then(() => deactivateData);
  }
}
