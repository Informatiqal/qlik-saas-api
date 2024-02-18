import { QlikSaaSClient } from "qlik-rest-api";
import { IKeyProvider, KeyProvider } from "./KeyProvider";
import { KeepRequired } from "../types/types";

export interface IMigrationInformation {
  /**
   * Migration operation ID
   */
  id: string;
  /**
   * Migration operation state
   */
  state: "New" | "InProgress" | "Completed";
  /**
   * Progress in percentage
   */
  progress: number;
  tenantId: string;
  completedAt: string;
  initiatedAt: string;
  /**
   * The nre key ARN that keys should be migrated to
   */
  migratingTo: string;
  /**
   * The key ARN bing migrated from (in case of QlikVault, could be a short name only)
   */
  migratingFrom: string;
  /**
   * The nre key prefix (to help services know which prefix should NOT be migrated)
   */
  migratingToPrefix: string;
  /**
   * The nre ARN fingerprint
   */
  migratingToFingerprint: string;
}

export class Encryptions {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`encryption.get: "id" parameter is required`);

    const kp: KeyProvider = new KeyProvider(this.#saasClient, arg.id);
    await kp.init();

    return kp;
  }

  /**
   * Lists keyproviders registered for the tenant
   */
  async getAll() {
    return await this.#saasClient
      .Get<IKeyProvider[]>(`encryption/keyproviders?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new KeyProvider(this.#saasClient, t.arnFingerPrint, t))
      );
  }

  /**
   * Lists keyproviders registered for the tenant [Qlik, AWS-KMS]
   */
  async list() {
    return await this.#saasClient
      .Get<IKeyProvider[]>(`encryption/keyproviders/actions/list?limit=50`)
      .then((res) => res.data)
      .then((data) =>
        data.map((t) => new KeyProvider(this.#saasClient, t.arnFingerPrint, t))
      );
  }

  /**
   * Gets ongoing migration details
   */
  async migrationDetails() {
    return await this.#saasClient
      .Get<IMigrationInformation[]>(
        `encryption/keyproviders/migration/actions/details?limit=50`
      )
      .then((res) => res.data);
  }

  /**
   * Registers an AWS-KMS key for the specific tenant
   */
  async create(arg: KeepRequired<IKeyProvider, "arn" | "name">) {
    if (!arg.arn)
      throw new Error(`encryption.create: "arn" parameter is required`);
    if (!arg.name)
      throw new Error(`encryption.create: "name" parameter is required`);

    return await this.#saasClient
      .Post<IKeyProvider>(`encryption/keyproviders`, arg)
      .then((res) => new KeyProvider(this.#saasClient, res.data.arn, res.data));
  }

  /**
   * Resets tenant key provider to Qlik managed provider
   */
  async resetToDefaultProvider() {
    return await this.#saasClient
      .Get<IMigrationInformation>(
        `keyproviders/actions/reset-to-default-provider`
      )
      .then((res) => res.data);
  }
}
