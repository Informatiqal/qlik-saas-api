import { QlikSaaSClient } from "qlik-rest-api";
import {
  IClassLicenseAssignment,
  ILicenseAssignment,
  LicenseAssignment,
} from "./LicenseAssignment";

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

export interface IClassLicenses {
  consumption(): Promise<ILicenseConsumption[]>;
  assignments(): Promise<IClassLicenseAssignment[]>;
  assignmentsAdd(
    arg: { subject: string; type: string }[]
  ): Promise<IClassLicenseAssignment[]>;
  status(): Promise<ILicenseStatus>;
  overview(): Promise<ILicenseOverview>;
}

export class Licenses implements IClassLicenses {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  // TODO: Cannot read property 'Href' of undefined
  async consumption() {
    return await this.saasClient
      .Get(`licenses/consumption`)
      .then((res) => res.data as ILicenseConsumption[]);
  }

  // TODO: Cannot read property 'Href' of undefined
  async assignments() {
    return await this.saasClient
      .Get(`licenses/assignments`)
      .then((res) => res.data as ILicenseAssignment[])
      .then((assignments) =>
        assignments.map((a) => new LicenseAssignment(this.saasClient, a))
      );
  }

  async assignmentsAdd(arg: { subject: string; type: string }[]) {
    return await this.saasClient
      .Post(`licenses/assignments/actions/add`, arg)
      .then((res) => res.data as ILicenseAssignment[])
      .then((assignments) =>
        assignments.map((a) => new LicenseAssignment(this.saasClient, a))
      );
  }

  async status() {
    return await this.saasClient
      .Get(`licenses/status`)
      .then((res) => res.data as ILicenseStatus);
  }

  async overview() {
    return await this.saasClient
      .Get(`licenses/overview`)
      .then((res) => res.data as ILicenseOverview);
  }
}
