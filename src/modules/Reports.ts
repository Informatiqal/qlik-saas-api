import { QlikSaaSClient } from "qlik-rest-api";
import { Report } from "./Report";

export interface ISheet {
  id: string;
  /**
   * A JSON object that is passed as-is to the mashup page while rendering, this will be applied to all charts within the sheet. It includes properties of the whole sheet such as theme, gradient etc
   */
  jsOpts?: {};
  /**
   * The width of the sheet in pixels. Default value is: - 1680 pixels for responsive sheet - 1120 pixels for extended sheet - same width set in sheet properties for custom sheet
   *
   * minimum=20, maximum=4000
   */
  widthPx?: number;
  /**
   * The height of the sheet in pixels. Default value is: - 1120 pixels for responsive sheet - 1680 pixels for extended sheet - same height set in sheet properties for custom sheet
   *
   * minimum=20, maximum=4000
   */
  heightPx?: number;
  /**
   * A map for applying jsOpts to specific visualization IDs within the sheet.
   */
  jsOptsById: {};
  /**
   * A map for applying soft properties, aka patches, to specific visualization IDs within the sheet.
   */
  patchesById: {};
}

export interface IVisualization {
  /**
   * The sense visualization id or json definition
   */
  id: string;
  /**
   * Choose visualization to export an image of a sense chart, sessionobject for a visualization to be created on-the-fly. An empty value leads to the type being inferred by its id
   */
  type?: "visualization" | "sessionobject";
  /**
   * A JSON object that is passed as-is to the mashup page while rendering.
   */
  jsOpts?: {};
  /**
   * Soft properties, aka patches, to be applied to the visualization
   */
  patches?: {
    qOp: "add" | "remove" | "replace";
    /**
     * Path to the property to add, remove or replace.
     */
    qPath: string;
    /**
     * Corresponds to the value of the property to add or to the new value of the property to update
     */
    qValue?: string;
  }[];
  /**
   * Width in pixels
   *
   * minimum=5, maximum=4000
   */
  widthPx: number;
  /**
   * Height in pixels
   *
   * minimum=5, maximum=4000
   */
  heightPx: number;
}

export interface IDocProperties {
  title: string;
  author: string;
  subject: string;
}

export interface IPDFOutput {
  /**
   * Size of the pdf page
   *
   * default='A4'
   */
  size:
    | "A1"
    | "A2"
    | "A3"
    | "A4"
    | "A5"
    | "A6"
    | "Letter"
    | "Legal"
    | "Tabloid";
  /**
   * Content alignment
   */
  align: {
    /**
     * default='top'
     */
    vertical: "top" | "middle" | "bottom";
    /**
     * default='left'
     */
    horizontal: "left" | "center" | "right";
  };
  properties: IDocProperties;
  /**
   * The area where the object (eg. sheet, chart) is printed. Required in case of "fit" resizeType.
   */
  resizeData: {};
  /**
   * The type of resize to be performed
   *
   * default='none'
   *
   * - none is used to export a visualization, sheet or story as is (e.g. normal size), regardless of its size. This may result in cropping.
   * - autofit automatically fits the visualization, sheet or story into the output size (i.e. A4, A3 etc.). Any provided resizeData parameter will be ignored for this configuration.
   * - fit fits the visualization, sheet or story into the area specified in resizeData. The content will be rescaled to fit in that area.
   */
  resizeType: "none" | "autofit" | "fit";
  /**
   * P for portrait, L for landscape and A for auto-detect. Auto-detect sets the orientation depending on the content width and height proportions: if content width > height the orientation is automatically set to landscape, portrait otherwise
   *
   * default='P'
   */
  orientation: "P" | "L" | "A";
  /**
   * This value is used for rendered images only, set to a default of 300 dpi
   *
   * default=300, maximum=1000
   */
  imageRenderingDpi: number;
}

export interface IPptxOutput {
  /**
   * Size of the PowerPoint slide
   *
   * default='Widescreen'
   */
  size: "Widescreen" | "OnScreen" | "OnScreen16x9" | "OnScreen16x10";
  properties: IDocProperties;
  /**
   * The type of resize to be performed. Autofit automatically fits the visualization, sheet or story into the output size (i.e. Widescreen, OnScreen etc.)
   *
   * default='autofit'
   */
  resizeType: string;
  /**
   * L for landscape, P for portrait and A for auto-detect. Auto-detect sets landscape, the default PowerPoint orientation
   *
   * default='L'
   */
  orientation: "L" | "P" | "A";
  /**
   * This value is used for rendered images only, set to a default of 200 dpi
   *
   * default=200, maximum=1000
   */
  imageRenderingDpi: number;
}

export interface IExcelOutput {
  /**
   * The image format of the report to be produced
   *
   * default='xlsx'
   */
  outFormat: string;
}

export interface IImageOutput {
  /**
   * Image resolution in DPI (default 96 DPI)
   *
   * maximum=1000
   */
  outDpi: number;
  /**
   * The scale factor to be applied in image scaling. A zoom greater than 5 will not be applied to the device pixel ratio which will remain fixed at 5
   */
  outZoom: number;
  /**
   * The image format of the report to be produced
   *
   * default='png'
   */
  outFormat: "png" | "jsondata";
}

export interface ICallbackAction {
  /**
   * Http callback. The provided uri will be called once the report is done
   */
  httpRequest: {
    /**
     * URI of the request
     */
    uri: string;
  };
}

export interface IReportRequest {
  /**
   * Template type and version using semantic versioning. It must have the following name convention: dashed-separated-template-name-MAJOR.MINOR. Please note that sense-story-x.0, sense-excel-template-1.0, sense-data-x.0 and qv-data-x.0 are only for internal use.
   *
   * Each type requires a specific template to be provided:
   *
   *  - composition-1.0 requires compositionTemplates to be set
   *  - sense-excel-template-1.0 requires senseExcelTemplate to be set
   *  - sense-image-1.0 requires senseImageTemplate to be set
   *  - sense-sheet-1.0 requires senseSheetTemplate to be set
   *
   * Each template type supports specific output types:
   *  - composition-1.0 supports only pdf composition output type
   *  - sense-excel-template-1.0 supports only excel output type
   *  - sense-image-1.0 supports pdf and png output types
   *  - sense-sheet-1.0 supports only pdf output type
   *
   * Enum:
   *  - composition-1.0
   *  - sense-image-1.0
   *  - sense-data-1.0
   *  - sense-sheet-1.0
   *  - sense-story-1.0
   *  - qv-data-1.0
   *  - qv-data-2.0
   *  - sense-excel-template-1.0
   */
  type: string;
  /**
   * Define the request metadata. It includes priority, deadline and future settings on execution policy of the request
   */
  meta?: {
    /**
     * Time to live of the final result artifacts in ISO8601 duration format. After that duration the request and underlying output files will not be guaranteed to be available. Default is 1 hour
     *
     * iso8601
     */
    outputTtl: string;
    /**
     * The maximum interval, starting from the time the API request is received, within which a report must be produced, past this interval the report generation fails. The default value is 10 minutes, the maximum allowed value is 2 hours
     *
     * iso8601
     */
    exportDeadline: string;
  };
  output?: {
    /**
     * Each template type supports specific output types:
     * - composition-1.0 supports only pdfcomposition and pptxcomposition output types
     * - excel-1.0 supports only excel output type
     * - sense-image-1.0 supports pdf and image output types
     * - sense-sheet-1.0 supports only pdf output type
     *
     * Each output type requires a specific output to be provided:
     * - excel requires excelOutput to be set
     * - pdfcomposition requires pdfCompositionOutput to be set
     * - pptxcomposition requires pptxCompositionOutput to be set
     * - pdf requires pdfOutput to be set
     * - image requires imageOutput to be set
     * - csv doesn't have csv output.
     */
    type:
      | "image"
      | "pdf"
      | "xlsx"
      | "jsondata"
      | "pdfcomposition"
      | "excel"
      | "pptx"
      | "pptxcomposition"
      | "csv";
    /**
     * The output identifier which uniquely identifies an output (PDF, image etc.) within the same request. It does not need to be a GUID. No spaces and colons are allowed in the outputId string.
     */
    outputId: string;
    /**
     * Output to be used to export a single visualization or a sheet as pdf
     */
    pdfOutput?: IPDFOutput;
    /**
     * Output to be used to export a single visualization or a sheet as PowerPoint presentation
     */
    pptxOutput?: IPptxOutput;
    /**
     * Output to be used to export a excel template
     */
    excelOutput?: IExcelOutput;
    /**
     * Output to be used to export a single visualization as image
     */
    imageOutput?: IImageOutput;
    /**
     * The callback to be performed once the report is done
     */
    callBackAction?: ICallbackAction;
    /**
     * Output to be used to export a composition of templates as pdf
     */
    pdfCompositionOutput?: {
      /**
       * The ordered list of PDF outputs, the number must match the composable templates
       */
      pdfOutput: IPDFOutput[];
      /**
       * Properties of the document. In case of multiple composition, only properties specified in the composition output are taken and the ones specified in each output item are ignored
       */
      properties: IDocProperties;
    };
    pptxCompositionOutput?: {
      /**
       * Output to be used to export a single visualization or a sheet as PowerPoint presentation
       */
      pdfOutput: IPptxOutput[];
      /**
       * Properties of the document. In case of multiple composition, only properties specified in the composition output are taken and the ones specified in each output item are ignored
       */
      properties: IDocProperties;
    };
  };
  /**
   * Definitions of common properties that are shared between templates, e.g. selectionsByState can be the same for all templates within a composition of templates.
   */
  definitions?: {};
  senseImageTemplate?: {
    appId: string;
    visualization: IVisualization;
    /**
     * default='ignoreErrorsNoDetails
     */
    selectionStrategy?:
      | "failOnErrors"
      | "ignoreErrorsReturnDetails"
      | "ignoreErrorsNoDetails";
    /**
     * Map of selections to apply by state. Maximum number of states allowed is 125. Maximum number of fields allowed is 125 and maximum number of overall field values allowed is 150000
     */
    selectionsByState?: {};
    /**
     * The definition ID referring to a selectionsByState definition declared in definitions
     */
    selectionsByStateDef?: string;
  };
  /**
   * Used to export a sheet as pdf
   */
  senseSheetTemplate?: {
    appId: string;
    sheet: ISheet;
    /**
     * default='ignoreErrorsNoDetails
     */
    selectionStrategy?:
      | "failOnErrors"
      | "ignoreErrorsReturnDetails"
      | "ignoreErrorsNoDetails";
    /**
     * Map of selections to apply by state. Maximum number of states allowed is 125. Maximum number of fields allowed is 125 and maximum number of overall field values allowed is 150000
     */
    selectionsByState?: {};
    /**
     * The definition ID referring to a selectionsByState definition declared in definitions
     */
    selectionsByStateDef?: string;
  };
  /**
   * Composition of senseSheetTemplate and/or senseImageTemplate templates
   */
  compositionTemplates?: {
    /**
     * Template type and version using semantic versioning. It must have the following name convention, dashed-separated-template-name-MAJOR.MINOR
     *
     * Enum:
     * - sense-image-1.0
     * - sense-sheet-1.0
     */
    type: string;
    /**
     * Used to export a single visualization as pdf or png
     */
    senseImageTemplate: {
      appId: string;
      visualization?: IVisualization;
      /**
       * default='ignoreErrorsNoDetails
       */
      selectionStrategy?:
        | "failOnErrors"
        | "ignoreErrorsReturnDetails"
        | "ignoreErrorsNoDetails";
      /**
       * Map of selections to apply by state. Maximum number of states allowed is 125. Maximum number of fields allowed is 125 and maximum number of overall field values allowed is 150000
       */
      selectionsByState?: {};
      /**
       * The definition ID referring to a selectionsByState definition declared in definitions
       */
      selectionsByStateDef?: string;
    };
    /**
     * Used to export a sheet as pdf
     */
    senseSheetTemplate: {
      appId: string;
      /**
       * It refers to the Sense Sheet to be exported. Note that if widthPx and heightPx are not specified, default values will be applied depending on the actual size and layout properties of the Sense Sheet object.
       */
      sheet: ISheet;
      /**
       * default='ignoreErrorsNoDetails
       */
      selectionStrategy?:
        | "failOnErrors"
        | "ignoreErrorsReturnDetails"
        | "ignoreErrorsNoDetails";
      /**
       * Map of selections to apply by state. Maximum number of states allowed is 125. Maximum number of fields allowed is 125 and maximum number of overall field values allowed is 150000
       */
      selectionsByState?: {};
      /**
       * The definition ID referring to a selectionsByState definition declared in definitions
       */
      selectionsByStateDef?: string;
    };
  }[];
}

export class Reports {
  #saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.#saasClient = saasClient;
  }

  async get(arg: { id: string }) {
    if (!arg.id) throw new Error(`reports.get: "id" parameter is required`);
    const report: Report = new Report(this.#saasClient, arg.id);
    await report.init();

    return report;
  }

  /**
   * Queue a new report request generation
   *
   * Rate limit -> Special (10 requests per minute)
   */
  async create(arg: IReportRequest) {
    return await this.#saasClient
      .Post<number>(`/reports`, arg)
      .then((res) => res.status);
  }
}
