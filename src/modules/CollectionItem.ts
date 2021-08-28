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

export interface IClassCollectionItem {
  details: ICollectionItem;
  remove(): Promise<number>;
}

export class CollectionItem implements IClassCollectionItem {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: ICollectionItem;
  collectionId: string;
  constructor(
    saasClient: QlikSaaSClient,
    id: string,
    collectionId: string,
    details?: ICollectionItem
  ) {
    if (!id) throw new Error(`collectionItems.get: "id" parameter is required`);

    this.id = id;
    this.collectionId = collectionId;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get(`collections/${this.id}/items/${this.id}`)
        .then((res) => res.data as ICollectionItem);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`collections/${this.collectionId}/items/${this.id}`)
      .then((res) => res.status);
  }
}
