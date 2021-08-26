import { QlikSaaSClient } from "qlik-rest-api";

export interface INLAsk {
  text: string;
  lang?: string;
  app?: {
    id?: string;
    name?: string;
  };
  disableNarrative?: boolean;
  disableConversationContext?: boolean;
  disableFollowups?: boolean;
  clearEntityContext?: boolean;
  recommendationId?: string;
}

export interface INL {
  conversationalResponse: {
    responses: {
      type: string;
      sentence: {
        text: string;
      };
      imageUrl: string;
      narrative: {
        text: string;
      };
      infoType: string;
      infoValues: [];
      followupSentence: string;
    }[];
    drillDownURI: string;
    contextInfo: string;
    apps: [
      {
        id: string;
        name: string;
      }
    ];
    sentenceWithMatches: string;
  }[];
  apps: {
    id: string;
    name: string;
  }[];
  nluInfo: {
    elements: {
      entity: boolean;
      errorText: string;
      filterFieldName: string;
      filterText: string;
      isFilter: boolean;
      text: string;
      type: string;
      typeName: string;
      typeTranslated: string;
    }[];
  };
}

export interface IClassNL {
  ask(arg: INLAsk): Promise<INL>;
}

export class NL implements IClassNL {
  private saasClient: QlikSaaSClient;
  constructor(saasClient: QlikSaaSClient) {
    this.saasClient = saasClient;
  }

  async ask(arg: INLAsk) {
    return await this.saasClient
      .Post(`questions/actions/ask`, arg)
      .then((res) => res.data as INL);
  }
}
