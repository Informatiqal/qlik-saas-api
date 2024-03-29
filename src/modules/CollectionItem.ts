import { QlikSaaSClient } from "qlik-rest-api";

export interface ICollectionItem {
  actions: [];
  collectionIds: string[];
  createdAt: string;
  creatorId: string;
  description: string;
  id: string;
  isFavorited: true;
  links: {
    collections: {
      href: string;
    };
    open: {
      href: string;
    };
    self: {
      href: string;
    };
    thumbnail: {
      href: string;
    };
  };
  meta: {
    actions: [];
    collections: {
      id: string;
      name: string;
    }[];
    isFavorited: boolean;
    tags: {
      id: string;
      name: string;
    }[];
  };
  ownerId: string;
  name: string;
  resourceAttributes: {};
  resourceCreatedAt: string;
  resourceCustomAttributes: {};
  resourceId: string;
  resourceLink: string;
  resourceReloadEndTime: string;
  resourceReloadStatus: string;
  resourceSize: {
    appFile: number;
    appMemory: number;
  };
  resourceSubType: string;
  resourceType: string;
  resourceUpdatedAt: string;
  spaceId: string;
  tenantId: string;
  thumbnailId: string;
  updatedAt: string;
  updaterId: string;
}

export class CollectionItem {
  #id: string;
  #saasClient: QlikSaaSClient;
  details: ICollectionItem;
  collectionId: string;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    collectionId: string,
    details?: ICollectionItem
  ) {
    if (!id) throw new Error(`collectionItems.get: "id" parameter is required`);

    this.details = details ?? ({} as ICollectionItem);
    this.#id = id;
    this.collectionId = collectionId;
    this.#saasClient = saasClient;
  }

  async init() {
    if (!this.details || Object.keys(this.details).length == 0) {
      this.details = await this.#saasClient
        .Get<ICollectionItem>(`collections/${this.#id}/items/${this.#id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.#saasClient
      .Delete(`collections/${this.collectionId}/items/${this.#id}`)
      .then((res) => res.status);
  }
}
