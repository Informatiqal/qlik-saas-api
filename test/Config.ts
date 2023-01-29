import path from "path";
import https from "https";

const dotEnvPath = path.resolve(".env");
import dotenv from "dotenv";
dotenv.config({ path: dotEnvPath });

import { QlikSaaSApi } from "../src";

export class Config {
  public saasApi: QlikSaaSApi.client;
  constructor() {
    const httpsAgentCert = new https.Agent({
      rejectUnauthorized: false,
    });

    const saasApi = new QlikSaaSApi.client({
      host: process.env.SAAS_URL,
      httpsAgent: httpsAgentCert,
      authentication: {
        token: process.env.SAAS_TOKEN,
      },
    });

    this.saasApi = saasApi;
  }
}

export class Helpers {
  constructor() {}

  uuidString(): string {
    let guid = this.uuid();
    return guid.replace(/-/g, "");
  }

  uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
