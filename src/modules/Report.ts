import { QlikSaaSClient } from "qlik-rest-api";

export interface IExportError {
  /**
   * The unique code for the error
   *
   * "REP-400000" Bad request. The server could not understand the request due to invalid syntax.
   *
   * "REP-400008" Selections error.
   *
   * "REP-400009" Maximum 16384 columns limit exceeded. Download data in a visualization can't generate an .xlsx file due to limitations to the number of columns you can download.
   *
   * "REP-400010" Maximum 1048566 rows limit exceeded. Download data in a visualization can't generate an .xlsx file due to limitations to the number of rows you can download.
   *
   * "REP-400011" The size of the downloaded Excel file exceed 100 MB limit. Download data in a visualization can't generate an .xlsx file due to limitations to the amount of data you can download.
   *
   * "REP-400015" Bad request in enigma request. The patch value has invalid JSON format.
   *
   * "REP-401000" Unauthorized. The client must authenticate itself to get the requested response.
   *
   * "REP-401001" Unauthorized, bad JWT.
   *
   * "REP-403000" Forbidden. The client does not have access rights to the content.
   *
   * "REP-403001" App forbidden, the user does not have read permission on the app.
   *
   * "REP-403002" Chart type not supported.
   *
   * "REP-404000" Not found. The server can not find the requested resource.
   *
   * "REP-404001" App not found, the app does not exist or it has been deleted.
   *
   * "REP-404002" Chart not found, the chart does not exist or it has been deleted.
   *
   * "REP-404003" Sheet not found, the sheet does not exist or it has been deleted or it is unavailable.
   *
   * "REP-404004" Story not found, the story does not exist or it has been deleted or it is unavailable.
   *
   * "REP-429000" Too many request. The user has sent too many requests in a given amount of time ("rate limiting").
   *
   * "REP-429012" Exceeded max session tenant quota. A tenant has opened too many different sessions at the same time.
   *
   * "REP-429014" Reporting service was not able to return inside of request export deadline. Too many request at the same time for the same tenant.
   *
   * "REP-429016" Exceeded max session tenant quota per day.
   *
   * "REP-500000" Fail to resolve resource.
   *
   * "REP-500006" Fail to get report session parameters.
   *
   * "REP-503005" Engine unavailable, qix-sessions error no engines available.
   *
   * "REP-503013" Session unavailable. The engine session used to create the report is unavailable.
   *
   * "REP-500100" Image rendering generic error on Sense client.
   *
   * "REP-500101" Image rendering could not set cookies error on Sense client.
   *
   * "REP-400102" Image rendering invalid strategy error on Sense client.
   *
   * "REP-500103" Image rendering JS timeout error on Sense client.
   *
   * "REP-500104" Image rendering load URL timeout error on Sense client.
   *
   * "REP-500105" Image rendering max paint attempts exceeded error on Sense client.
   *
   * "REP-500106" Image rendering max JS attempts exceeded error on Sense client.
   *
   * "REP-500107" Image rendering render timeout error on Sense client.
   *
   * "REP-500108" Image rendering JS failure due to timeout error on Sense client.
   *
   * "REP-500109" Image rendering generic JS failure error on Sense client.
   *
   * "REP-400029" Reload Entitlement Limit Reached.
   *
   * "REP-409046" Report aborted due to app reload.
   */
  code: string;
  /**
   * A summary in english explaining what went wrong
   */
  title: string;
  /**
   * Optional. MAY be used to provide more concrete details.
   */
  detail: string;
  /**
   * Define the export error metadata. Each property is filled if it is related to the export error type
   */
  meta: {
    /**
     * Errors occurring when dealing with the app.
     */
    appErrors: {
      appId: string;
      /**
       * The method that is failing
       */
      method: string;
      /**
       * Parameters of method that fails.
       */
      parameters: {};
    }[];
    /**
     * Errors occurring in selections
     */
    selectionErrors: {
      /**
       * Details about the field selection error
       */
      detail: string;
      /**
       * Enum:
       * fieldMissing
       *
       * fieldValuesMissing
       *
       * stateMissing
       */
      errorType: string;
      /**
       * The field name that is missing
       */
      fieldName: string;
      /**
       * The state name that is missing
       */
      stateName: string;
      missingValues: {
        /**
         * String value of the field value
         */
        test: string;
        number: number;
        /**
         * IsNumeric tells whether the field value is text or number. Default value is equal to defaultIsNumeric property in QSelection
         */
        isNumeric: boolean;
      }[];
    }[];
  };
}

export interface IReport {
  /**
   * Status of the requested report
   */
  status:
    | "queued"
    | "processing"
    | "done"
    | "failed"
    | "aborted"
    | "visiting"
    | "aborting";
  /**
   * Present when the status is "done"
   */
  results: {
    /**
     * Location to download the generated report.
     */
    location: string;
    /**
     * The output identifier which uniquely identifies an output (PDF, image etc.) within the same request
     */
    outputId: string;
    /**
     * Errors occurred during report generation
     */
    exportErrors: IExportError[];
  }[];
  /**
   * Present when status is failed
   */
  reasons: {
    traceId: string;
    /**
     * The output identifier which uniquely identifies an output (PDF, image etc.) within the same request.
     */
    outputId: string;
    /**
     * Errors occurred during report generation
     */
    exportErrors: IExportError[];
  }[];
  /**
   * Relative path to status location
   */
  statusLocation: string;
  /**
   * Count how many times the resolution of this report was attempted.
   */
  resolutionAttempts: number;
}

export class Report {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: IReport;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IReport) {
    if (!id) throw new Error(`report.get: "id" parameter is required`);

    this.details = details ?? ({} as IReport);
    this.#id = id;
    this.#saasClient = saasClient;
  }

  async init(arg?: { force: true }) {
    if (Object.keys(this.details).length == 0 || arg?.force == true) {
      this.details = await this.#saasClient
        .Get<IReport>(`reports/${this.#id}/status`)
        .then((res) => res.data);
    }
  }
}
