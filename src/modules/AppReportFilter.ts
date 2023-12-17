import { QlikSaaSClient } from "qlik-rest-api";
import { ReportFilter } from "./Apps.interfaces";

export class AppReportFilter {
  #id: string;
  private appId: string;
  #saasClient: QlikSaaSClient;
  details: ReportFilter;
  constructor(
    saasClient: QlikSaaSClient,
    reportFilterId: string,
    appId: string,
    details?: ReportFilter
  ) {
    if (!appId) throw new Error(`"appId" parameter is required`);

    this.details = details ?? ({} as ReportFilter);
    this.#id = reportFilterId;
    this.appId = appId;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (!this.details || arg?.force == true) {
      this.details = await this.#saasClient
        .Get<ReportFilter>(`apps/${this.appId}/report-filters/${this.#id}`)
        .then((res) => ({ ...res.data, script: "" }));
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`apps/${this.appId}/report-filters/${this.#id}`)
      .then((res) => res.status);
  }
}
