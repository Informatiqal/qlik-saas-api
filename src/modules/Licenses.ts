import { QlikSaaSClient } from "qlik-rest-api";
import { ILicenseAssignment, LicenseAssignment } from "./LicenseAssignment";

export interface ILicenseConsumption {
  id: string;
  userId: string;
  sessionId: string;
  appId: string;
  endTime: string;
  duration: number;
  allotmentId: string;
  capacityUsed: number;
  minutesUsed: number;
  licenseUsage: string;
}

export interface ILicenseStatus {
  status: "Ok" | "Blacklisted" | "Expired" | "Missing" | string;
  valid: string;
  type: "Signed" | "Plain" | string;
  origin: "Internal" | "External" | string;
  trial: boolean;
  product: string;
}

export interface ILicenseOverview {
  licenseNumber: string;
  licenseKey: string;
  valid: string;
  status: "Ok" | "Blacklisted" | "Expired" | "Missing" | string;
  origin: "Internal" | "External" | string;
  trial: boolean;
  allotments: {
    name: "professional" | "analyzer" | "analyzer_time" | string;
    usageClass: string;
    unitsUsed: number;
    units: number;
    overage: number;
  }[];
  product: string;
  parameters: {
    name: string;
    valid: string;
    values: {};
    access: {
      allotment: string;
    };
  }[];
}

export class Licenses {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  // TODO: Cannot read property 'Href' of undefined
  async consumption() {
    return await this.#saasClient
      .Get<ILicenseConsumption[]>(`licenses/consumption`)
      .then((res) => res.data);
  }

  // TODO: Cannot read property 'Href' of undefined
  async assignments() {
    return await this.#saasClient
      .Get<ILicenseAssignment[]>(`licenses/assignments`)
      .then((res) => res.data)
      .then((assignments) =>
        assignments.map((a) => new LicenseAssignment(this.#saasClient, a))
      );
  }

  async assignmentsAdd(arg: { subject: string; type: string }[]) {
    return await this.#saasClient
      .Post<ILicenseAssignment[]>(`licenses/assignments/actions/add`, arg)
      .then((res) => res.data)
      .then((assignments) =>
        assignments.map((a) => new LicenseAssignment(this.#saasClient, a))
      );
  }

  async status() {
    return await this.#saasClient
      .Get<ILicenseStatus>(`licenses/status`)
      .then((res) => res.data);
  }

  async overview() {
    return await this.#saasClient
      .Get<ILicenseOverview>(`licenses/overview`)
      .then((res) => res.data);
  }
}
