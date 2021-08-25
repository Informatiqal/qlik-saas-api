import { QlikRepositoryClient } from "qlik-rest-api";
import { Privileges, ResourceType } from "../types/types";
import { IApp } from "./Apps.interfaces";

// import { ISelection, IEntityRemove, IHttpStatus } from "./types/interfaces";

export interface IItems {
  data: IItem[];
  links: {
    self?: {
      href: string;
    };
    next?: {
      href: string;
    };
    prev?: {
      href: string;
    };
    collection?: {
      href: string;
    };
  };
}

interface IResourceAttributeNote {
  thumbnail: string;
}

interface IResourceAttributeLink {
  linkType: string;
  url: string;
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

export interface IClassItems {
  get(id: string): Promise<any>;
  //   getAll(): Promise<IClassApp[]>;
  //   getFilter(filter: string, orderBy?: string): Promise<IClassApp[]>;
  //   removeFilter(filter: string): Promise<IEntityRemove[]>;
  //   select(filter?: string): Promise<ISelection>;
  //   upload(
  //     name: string,
  //     file: Buffer,
  //     keepData?: boolean,
  //     excludeDataConnections?: boolean
  //   ): Promise<IClassApp>;
  //   uploadAndReplace(
  //     name: string,
  //     targetAppId: string,
  //     file: Buffer,
  //     keepData?: boolean
  //   ): Promise<IClassApp>;
}

export class Items implements IClassItems {
  private repoClient: QlikRepositoryClient;
  //   private genericClient: QlikGenericRestClient;
  constructor(
    private mainRepoClient: QlikRepositoryClient // private mainGenericClient: QlikGenericRestClient
  ) {
    this.repoClient = mainRepoClient;
    // this.genericClient = mainGenericClient;
  }

  public async get(id: string) {}

  //   public async get(id: string) {
  //     if (!id) throw new Error(`apps.get: "id" parameter is required`);
  //     const app: App = new App(this.repoClient, id, null, this.genericClient);
  //     await app.init();

  //     return app;
  //   }

  //   public async getAll() {
  //     return await this.repoClient
  //       .Get(`app/full`)
  //       .then((res) => res.data as IApp[])
  //       .then((data) => {
  //         return data.map(
  //           (t) => new App(this.repoClient, t.id, t, this.genericClient)
  //         );
  //       });
  //   }

  //   public async getFilter(filter: string, orderBy?: string) {
  //     if (!filter)
  //       throw new Error(`app.getFilter: "filter" parameter is required`);

  //     const urlBuild = new URLBuild(`app/full`);
  //     urlBuild.addParam("filter", filter);
  //     urlBuild.addParam("orderby", orderBy);

  //     return await this.repoClient
  //       .Get(urlBuild.getUrl())
  //       .then((res) => res.data as IApp[])
  //       .then((data) => {
  //         return data.map(
  //           (t) => new App(this.repoClient, t.id, t, this.genericClient)
  //         );
  //       });
  //   }

  //   public async upload(
  //     name: string,
  //     file: Buffer,
  //     keepData?: boolean,
  //     excludeDataConnections?: boolean
  //   ) {
  //     if (!name) throw new Error(`app.upload: "name" parameter is required`);
  //     if (!file) throw new Error(`app.upload: "file" parameter is required`);

  //     const urlBuild = new URLBuild("app/upload");
  //     urlBuild.addParam("name", name);
  //     urlBuild.addParam("keepdata", keepData);
  //     urlBuild.addParam("excludeconnections", excludeDataConnections);

  //     return await this.repoClient
  //       .Post(urlBuild.getUrl(), file, "application/vnd.qlik.sense.app")
  //       .then(
  //         (res) =>
  //           new App(
  //             this.repoClient,
  //             (res.data as IApp).id,
  //             res.data,
  //             this.genericClient
  //           )
  //       );
  //   }

  //   public async uploadAndReplace(
  //     name: string,
  //     targetAppId: string,
  //     file: Buffer,
  //     keepData?: boolean
  //   ) {
  //     if (!name)
  //       throw new Error(`app.uploadAndReplace: "name" parameter is required`);
  //     if (!file)
  //       throw new Error(`app.uploadAndReplace: "file" parameter is required`);
  //     if (!targetAppId)
  //       throw new Error(
  //         `app.uploadAndReplace: "targetAppId" parameter is required`
  //       );

  //     const urlBuild = new URLBuild("app/upload/replace");
  //     urlBuild.addParam("name", name);
  //     urlBuild.addParam("keepdata", keepData);
  //     urlBuild.addParam("targetappid", targetAppId);

  //     return await this.repoClient
  //       .Post(urlBuild.getUrl(), file, "application/vnd.qlik.sense.app")
  //       .then(
  //         (res) =>
  //           new App(
  //             this.repoClient,
  //             (res.data as IApp).id,
  //             null,
  //             this.genericClient
  //           )
  //       );
  //   }

  //   public async removeFilter(filter: string) {
  //     if (!filter)
  //       throw new Error(`app.removeFilter: "filter" parameter is required`);

  //     const apps = await this.getFilter(filter);
  //     return Promise.all<IEntityRemove>(
  //       apps.map((app: IClassApp) =>
  //         app.remove().then((s) => ({ id: app.details.id, status: s }))
  //       )
  //     );
  //   }

  //   public async select(filter?: string) {
  //     const urlBuild = new URLBuild(`selection/app`);
  //     urlBuild.addParam("filter", filter);

  //     return await this.repoClient
  //       .Post(urlBuild.getUrl(), {})
  //       .then((res) => res.data as ISelection);
  //   }
}
