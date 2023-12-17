import { QlikSaaSClient } from "qlik-rest-api";

export interface ISharingSettings {
  /**
   * These persisted sharing settings are only available for this tenant. Extracted from request JWT.
   */
  tenantId: string;
  /**
   * Maximum number of recipients when creating a sharing task
   */
  maxRecipients: number;
  /**
   * Whether API endpoints for sharing are enabled
   */
  "enable-sharing": boolean;
  /**
   * This indicates that there is an ongoing operation to either disable or enable the report subscription feature. none means that no such operation is ongoing. enabling/disabling means that system is currently enabling/disabling the feature
   */
  reportSubscriptionStatus: string;
  /**
   * Max Recipients accepted when creating a new subscription (excluding the owner)
   */
  maxSubscriptionRecipients: number;
  /**
   * true if report-subscription feature is enabled for this tenant
   */
  "enable-report-subscription": boolean;
  /**
   * Whether the license for the tenant has the reportingService feature enabled.
   */
  "reporting-service-license-status": "enabled" | "disabled";
  /**
   * UTC timestamp of the most recent change of reportSubscriptionStatus. If there has not been any such change, this is the timestamp of the initial creation of the record.
   */
  reportSubscriptionStatusChangeTime: string;
  /**
   * This indicates that there is an ongoing operation to either disable or enable the reporting template subscription feature. none means that no such operation is ongoing. enabling/disabling means that system is currently enabling/disabling the feature
   */
  reportingTemplateSubscriptionStatus: "none" | "enabling" | "disabling";
  /**
   * true if reporting-template-subscription feature is enabled for this tenant
   */
  "enable-reporting-template-subscription": boolean;
  /**
   * UTC timestamp of the most recent change of reportSubscriptionStatus. If there has not been any such change, this is the timestamp of the initial creation of the record
   */
  reportingTemplateSubscriptionStatusChangeTime: string;
}

export class SharingTasksSettings {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  /**
   * Lists sharing settings.
   */
  async get() {
    return await this.#saasClient
      .Get<ISharingSettings>(`sharing-tasks/settings`)
      .then((res) => res.data);
  }

  /**
   * Patches sharing features toggles. Accessible only by tenant admins
   */
  async patch(
    arg: {
      op: "replace";
      path:
        | "/enable-sharing"
        | "/enable-report-subscription"
        | "/enable-reporting-template-subscription";
      value: {};
    }[]
  ) {
    return await this.#saasClient
      .Patch<ISharingSettings>(`sharing-tasks/settings`, arg)
      .then((res) => res.status);
  }

  /**
   * Updates API configuration. Accessible only by tenant admins
   */
  async update(arg: { "enable-sharing": boolean; maxRecipients?: number }) {
    return await this.#saasClient
      .Put<ISharingSettings>(`sharing-tasks/settings`, arg)
      .then((res) => res.status);
  }
}
