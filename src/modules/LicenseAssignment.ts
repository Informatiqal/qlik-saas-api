import { QlikSaaSClient } from "qlik-rest-api";

export interface ILicenseAssignment {
  subject: string;
  type: string;
  name: string;
  userId: string;
  excess: boolean;
  created: string;
}

export class LicenseAssignment {
  #saasClient: QlikSaaSClient;
  details: ILicenseAssignment;
  constructor(saasClient: QlikSaaSClient, details?: ILicenseAssignment) {
    this.#saasClient = saasClient;
    this.details = details ?? ({} as ILicenseAssignment);
  }

  async remove() {
    return await this.#saasClient
      .Post(`licenses/assignments/actions/delete`, {
        delete: [
          {
            subject: this.details.subject,
            type: this.details.type,
          },
        ],
      })
      .then((res) => res.status);
  }

  async update(arg: { sourceType: string }) {
    if (!arg.sourceType)
      throw new Error(`assignments.update: "sourceType" parameter is required`);

    return await this.#saasClient
      .Post(`licenses/assignments/actions/update`, {
        update: [
          {
            subject: this.details.subject,
            type: this.details.type,
            sourceType: arg.sourceType,
          },
        ],
      })
      .then((res) => res.status);
  }
}
