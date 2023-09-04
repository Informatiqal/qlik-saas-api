import { QlikSaaSClient } from "qlik-rest-api";
import { TransportsActions } from "./TransportsActions";

export interface IEmailConfigGet {
  /**
   * Contains statusCode and statusReason
   */
  status: {
    /**
     * Status code
     */
    statusCode: number;
    /**
     * Status reason
     */
    statusReason: string;
  };
  /**
   * Is the configuration valid
   */
  isValid: boolean;
  /**
   * The tenant Id
   */
  tenantId: string;
  /**
   * user name
   */
  username: string;
  /**
   * smtp listening port
   */
  serverPort: number;
  /**
   * Number of authentication failures
   */
  authFailures: number;
  /**
   * user for SMTP authentication
   */
  emailAddress: string;
  /**
   * one of none, StartTLS or SSL/TLS
   */
  securityType: string;
  /**
   * domain name or IP address of SMTP server
   */
  serverAddress: string;
  /**
   * Indicates if password is defined for smtp config. The password itself is not returned!
   */
  passwordExists: boolean;
  /**
   * Last modification time. Formatter as ISO 8601 string.
   */
  modificationTime: string;
}

export interface IEmailConfigFieldPatch {
  /**
   * The operation to be performed
   */
  op: "add" | "remove" | "replace";
  /**
   * The path for the given resource field to patch
   */
  path:
    | "/username"
    | "/serverAddress"
    | "/serverPort"
    | "/securityType"
    | "/emailAddress"
    | "/emailPassword";
  /**
   * The value to be used for this operation
   */
  value: string;
}

export class Transports {
  #saasClient: QlikSaaSClient;
  _actions: TransportsActions;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
    this._actions = new TransportsActions(this.#saasClient);
  }

  async get() {
    return await this.#saasClient
      .Get<IEmailConfigGet>(`transports/email-config`)
      .then((res) => res.data);
  }

  async patch(arg: IEmailConfigFieldPatch[]) {
    if (!arg)
      throw new Error(`transports.patch: mandatory argument object is missing`);
    if (!Array.isArray(arg))
      throw new Error(`transports.patch: provided argument is not an array`);

    return await this.#saasClient
      .Patch(`transports/email-config`, arg)
      .then((res) => res.status);
  }

  async delete() {
    return await this.#saasClient
      .Delete(`transports/email-config`)
      .then((res) => res.status);
  }
}
