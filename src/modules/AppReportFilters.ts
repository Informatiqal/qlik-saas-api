import { QlikSaaSClient } from "qlik-rest-api";
import { ReportFilter, ReportFilterRequest } from "./Apps.interfaces";
import { AppReportFilter } from "./AppReportFilter";
import { parseFilter } from "../util/filter";

export class AppReportFilters {
  #saasClient: QlikSaaSClient;
  private appId: string;
  constructor(saasClient: QlikSaaSClient, appId: string) {
    this.#saasClient = saasClient;
    this.appId = appId;
  }

  async getAll() {
    return await this.#saasClient
      .Get<ReportFilter[]>(
        `/apps/${this.appId}/report-filters?limit=50&filterTypes=REP`
      )
      .then((res) => res.data)
      .then((data) =>
        data.map(
          (t) => new AppReportFilter(this.#saasClient, t.id, this.appId, t)
        )
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `reportFilters.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as AppReportFilter[];
    });
  }

  async create(arg: ReportFilterRequest) {
    return await this.#saasClient
      .Post<ReportFilter>(`/apps/${this.appId}/report-filters`, arg)
      .then(
        (res) =>
          new AppReportFilter(
            this.#saasClient,
            res.data.id,
            this.appId,
            res.data
          )
      );
  }

  async count(arg: { filterType: "REP" | "SUB" }) {
    if (!arg || !arg.filterType)
      throw new Error(
        `reportFilters.count: "filterType" parameter is required`
      );

    if (arg.filterType != "REP" && arg.filterType != "SUB")
      throw new Error(
        `reportFilters.count: unknown "filterType" value. Allowed are "REP" or "SUB"`
      );

    return await this.#saasClient
      .Get<{ total: number }>(
        `/apps/${this.appId}/report-filters/actions/count?filterTypes=${arg.filterType}`
      )
      .then((res) => {
        // seems that the API returns empty object when there are no filters
        // because of this we have to enforce and return 0
        // when "total" is not present in the response data
        if (res.data && !res.data.total) return 0;

        return res.data.total;
      });
  }
}
