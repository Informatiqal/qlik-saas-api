import { QlikSaaSClient } from "qlik-rest-api";

export interface ISmtpRequest {
  body: string;
  subject: string;
  recipient: string;
}

export interface ISmtpResult {
  /**
   * error message from SMTP middleware .. a bit technical but could be useful to administrator
   */
  message: string;
  /**
   * was SMTP operation successful or not. Other fields herein provide more detail
   */
  success: string;
  /**
   * could not resolve domain name, connection refused, connection timed out, SSL mismatch
   */
  connectionFailed: boolean;
  /**
   * smtp result code string from the SMTP server. eg. "250 2.6.0"
   */
  smtpResponseCode: number;
}

export interface ISmtpCheck {
  /**
   * true if smtp config is correct and complete. Will return false if smtp-config does not exist at all
   */
  isValid: boolean;
}

export interface IClassTransportsActions {
  /**
   * Send a test mail with the supplied email info (subject, body, recipient). Email config from database is used for the connection
   *
   * Rate limit: Tier 2 (60 requests per minute)
   */
  sendTestEmail(arg: ISmtpRequest): Promise<ISmtpResult>;
  /**
   * Returns the isValid value for the email configuration for the tenant. Will return false if no email configuration exists
   *
   * Rate limit: Tier 2 (60 requests per minute)
   */
  validate(): Promise<ISmtpCheck>;
  /**
   * Verifies connection to email server for tenant provided via JWT
   *
   * Rate limit: Tier 2 (60 requests per minute)
   */
  verifyConnection(): Promise<ISmtpResult>;
}

export class TransportsActions implements IClassTransportsActions {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async sendTestEmail(arg: ISmtpRequest): Promise<ISmtpResult> {
    if (!arg)
      throw new Error(
        `transports._actions.sendTestEmail: mandatory argument object is missing`
      );
    if (arg.body)
      throw new Error(
        `transports._actions.sendTestEmail: "body" parameter is required`
      );
    if (!arg.recipient)
      throw new Error(
        `transports._actions.sendTestEmail: "recipient" parameter is required`
      );
    if (!arg.subject)
      throw new Error(
        `transports._actions.sendTestEmail: "subject" parameter is required`
      );

    return await this.saasClient
      .Post<ISmtpResult>(`transports/email-config/actions/send-test-email`, arg)
      .then((res) => res.data);
  }

  async validate(): Promise<ISmtpCheck> {
    return await this.saasClient
      .Post<ISmtpCheck>(`transports/email-config/actions/validate`, {})
      .then((res) => res.data);
  }

  async verifyConnection(): Promise<ISmtpResult> {
    return await this.saasClient
      .Post<ISmtpResult>(
        `transports/email-config/actions/verify-connection`,
        {}
      )
      .then((res) => res.data);
  }
}
