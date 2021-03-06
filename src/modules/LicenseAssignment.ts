import { QlikSaaSClient } from "qlik-rest-api";

export interface ILicenseAssignment {
  subject: string;
  type: string;
  name: string;
  userId: string;
  excess: boolean;
  created: string;
}

export interface IClassLicenseAssignment {
  details: ILicenseAssignment;
  remove(sourceType: string): Promise<number>;
}

export class LicenseAssignment implements IClassLicenseAssignment {
  private saasClient: QlikSaaSClient;
  details: ILicenseAssignment;
  constructor(saasClient: QlikSaaSClient, details?: ILicenseAssignment) {
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async remove() {
    return await this.saasClient
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

  async update(sourceType: string) {
    if (!sourceType)
      throw new Error(`assignments.update: "sourceType" parameter is required`);

    return await this.saasClient
      .Post(`licenses/assignments/actions/update`, {
        update: [
          {
            subject: this.details.subject,
            type: this.details.type,
            sourceType,
          },
        ],
      })
      .then((res) => res.status);
  }
}
