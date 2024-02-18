import { QlikSaaSClient } from "qlik-rest-api";
import { IMigrationInformation } from "./Encryptions";

export interface IKeyProvider {
  /**
   * The provider resource notation for the key
   */
  arn: string;
  /**
   * Name of key provider entry
   */
  name: string;
  /**
   * Indicates whether the key is being used to encrypt/decrypt secrets
   */
  current: boolean;
  /**
   * Tenant ID
   */
  tenantId: string;
  /**
   * When key entry was created
   */
  createdAt: string;
  /**
   * Description of key provider entry
   */
  description: string;
  /**
   * Key Provider type.
   *
   * At the moment only "AWS-KMS" (12/2023)
   */
  keyProvider: string;
  /**
   * Indicated whether the key has multi-region configuration and has replica key in qcs secondary region
   */
  multiRegion: boolean;
  replicaKeys: {
    /**
     * Replica key keeps list of backup keys from the supported qcs secondary region
     */
    arn: string;
    /**
     * Region indicates the backup qcs-region link to the primary region
     */
    region: string;
  }[];
  /**
   * The ARN fingerprint
   */
  arnFingerPrint: string;
  /**
   * When the key was promoted to being current active one
   */
  promotedToCurrentAt: string;
  /**
   * When the ley was demoted from being current to non active
   */
  demotedFromCurrentAt: string;
}

export class KeyProvider {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IKeyProvider;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IKeyProvider) {
    if (!id) throw new Error(`keyProvider.get: "id" parameter is required`);

    this.details = details ?? ({} as IKeyProvider);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: boolean }) {
    if (
      !this.details ||
      Object.keys(this.details).length == 0 ||
      arg?.force == true
    ) {
      this.details = await this.#saasClient
        .Get<IKeyProvider>(`encryption/keyproviders/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`encryption/keyproviders/${this.#id}`)
      .then((res) => res.status);
  }

  /**
   * Patches Name & Description of keyprovider information
   */
  async patch(arg: { op: string; path: string; value: string }[]) {
    let updateStatus = 0;

    return await this.#saasClient
      .Patch(`encryption/keyproviders/${this.#id}`, arg)
      .then((res) => {
        updateStatus = res.status;
        return this.init({ force: true });
      })
      .then(() => updateStatus);
  }

  /**
   * Migrates existing cipher keys from current key provider to requested key provider
   */
  async migrate() {
    return await this.#saasClient
      .Post<IMigrationInformation>(
        `encryption/keyproviders/${this.#id}/actions/migrate`,
        {}
      )
      .then((res) => res.data);
  }

  /**
   * Validates AWS-KMS key access and usage
   */
  async test() {
    return await this.#saasClient
      .Post<IKeyProvider>(
        `encryption/keyproviders/${this.#id}/actions/test`,
        {}
      )
      .then((res) => res.data);
  }
}
