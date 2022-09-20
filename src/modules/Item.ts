import { QlikSaaSClient } from "qlik-rest-api";
import { Privileges, ResourceType } from "../types/types";
import { IApp } from "./Apps.interfaces";

export interface IResourceAttributeNote {
  thumbnail: string;
}

export interface IResourceAttributeLink {
  linkType: string;
  url: string;
}

export interface IITemCollections {
  createdAt: string;
  creatorId: string;
  description: string;
  id: string;
  itemCount: number;
  links: {
    items: {
      href: string;
    };
    self: {
      href: string;
    };
  };
  meta: {
    items: {
      data: IItem[];
      links: {
        collection: {
          href: string;
        };
        next: {
          href: string;
        };
        prev: {
          href: string;
        };
        self: {
          href: string;
        };
      };
    };
  };
  name: string;
  tenantId: string;
  type: string;
  updatedAt: string;
  updaterId: string;
}

// TODO: more definitions for resourceAttributes
export interface IItem {
  name: string;
  description: string;
  resourceAttributes: IApp | IResourceAttributeNote | IResourceAttributeLink;
  resourceCustomAttributes: null;
  resourceUpdatedAt: string;
  resourceType: ResourceType;
  resourceId: string;
  resourceCreatedAt: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  updaterId: string;
  tenantId: string;
  isFavorited: boolean;
  links: {
    self: {
      href: string;
    };
    thumbnail: {
      href: string;
    };
    collections: {
      href: string;
    };
    open: {
      href: string;
    };
  };
  actions: Privileges[];
  collectionIds: string[];
  meta: {
    isFavorited: boolean;
    actions: Privileges[];
    tags: { id: string; name: string }[];
    collections: string[];
  };
  ownerId: string;
  resourceReloadEndTime: string;
  resourceReloadStatus: string;
  resourceSize: {
    appFile: number;
    appMemory: number;
  };
}

export interface IClassItem {
  details: IItem;
  remove(): Promise<number>;
  collections(): Promise<IITemCollections[]>;
  publishedItems(): Promise<IITemCollections[]>;
}

export class Item implements IClassItem {
  private id: string;
  private saasClient: QlikSaaSClient;
  details: IItem;
  constructor(saasClient: QlikSaaSClient, id: string, details?: IItem) {
    if (!id) throw new Error(`app.get: "id" parameter is required`);

    this.id = id;
    this.saasClient = saasClient;
    if (details) this.details = details;
  }

  async init() {
    if (!this.details) {
      this.details = await this.saasClient
        .Get<IItem>(`items/${this.id}`)
        .then((res) => res.data);
    }
  }

  async remove() {
    return await this.saasClient
      .Delete(`items/${this.id}`)
      .then((res) => res.status);
  }

  async collections() {
    return await this.saasClient
      .Get<IITemCollections[]>(`items/${this.id}/collections`)
      .then((res) => res.data);
  }

  async publishedItems() {
    return await this.saasClient
      .Get<IITemCollections[]>(`items/${this.id}/publisheditems`)
      .then((res) => res.data);
  }
}
