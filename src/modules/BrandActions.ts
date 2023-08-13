import { QlikSaaSClient } from "qlik-rest-api";
import { IBrand } from "./Brand";

export class BrandActions {
  private id: string;
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient, id: string) {
    this.id = id;
    this.saasClient = saasClient;
  }

  /**
   * Sets the brand active and de-activates any other active brand.
   * If the brand is already active, no action is taken.
   */
  async activate() {
    return this.saasClient
      .Post<IBrand>(`brands/${this.id}/actions/activate`, {})
      .then((res) => res.status);
  }

  /**
   * Sets the brand so it is no longer active.
   * If the brand is already inactive, no action is taken.
   */
  async deactivate() {
    return this.saasClient
      .Post<IBrand>(`brands/${this.id}/actions/deactivate`, {})
      .then((res) => res.status);
  }
}
