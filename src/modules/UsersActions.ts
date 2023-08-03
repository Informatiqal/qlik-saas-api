import { QlikSaaSClient } from "qlik-rest-api";

export interface IUserActionsInvite {
  /**
   * Optional display name for this invitee. Example - "Elvis Presley"
   */
  name?: string;
  /**
   * Email address for this invitee. Example - "foo@qlik.com"
   */
  email: string;
  /**
   * Flag - when true invite message is sent to inactive or invited users.
   * Typically used to force email resend to users who are not yet active
   */
  resend?: boolean;
  /**
   * Optional ISO 639-1 2 letter code for invite language.
   * Defaults to 'en' when missing or not found.
   */
  language?: string;
}

export class UsersActions {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  /**
   * Returns the number of users in a given tenant
   * @returns {object} { total: number }
   *
   * Rate limit: Tier 1 (1000 requests per minute)
   */
  async count() {
    return await this.saasClient
      .Get<{ total: number }>(`users/actions/count`)
      .then((res) => res.data);
  }

  /**
   * Invite one or more users by email address
   *
   * Rate limit: Tier 2 (100 requests per minute)
   */
  async invite(arg: IUserActionsInvite[]) {
    if (!arg)
      throw new Error(`users._actions.invite: update arguments are missing`);

    return await this.saasClient
      .Post<{ data: any[] }>(`users/actions/invite`, arg)
      .then((res) => res.data);
  }
}
