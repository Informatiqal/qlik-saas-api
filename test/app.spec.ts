import { describe, it, expect } from "vitest";
import path from "path";
const dotEnvPath = path.resolve(".env");
import dotenv from "dotenv";
dotenv.config({ path: dotEnvPath });

import { Config, Helpers } from "./Config";

const config = new Config();
const saasApi = config.saasApi;
const helpers = new Helpers();

describe("Apps", function () {
  this.timeout(30000);

  it("Script operations", async function () {
    const tempAppName = "Temp API Test app";
    const script1 = "let a = 1;";
    const script2 = "let b = 1;";

    const app = await saasApi.apps.create({
      name: tempAppName,
    });

    const initialScript = await app.setScript({
      script: script1,
      versionMessage: "Initial version",
    });

    const anotherScript = await app.setScript({
      script: script2,
      versionMessage: "Updated script",
    });

    const allScriptVersions = await app.scriptVersions();

    const initialScriptValue = await app.scriptVersion({
      versionId: allScriptVersions.filter(
        (s) => s.details.versionMessage == "Initial version"
      )[0].details.scriptId,
    });

    const anotherScriptValue = await app.scriptVersion({
      versionId: allScriptVersions.filter(
        (s) => s.details.versionMessage == "Updated script"
      )[0].details.scriptId,
    });

    const removeScriptStatus = await allScriptVersions
      .filter((s) => s.details.versionMessage == "Initial version")[0]
      .remove();

    const updateScriptNameStatus = await allScriptVersions
      .filter((s) => s.details.versionMessage == "Updated script")[0]
      .update({ name: "Updated name" });

    const allScriptVersionsAfterRemove = await app.scriptVersions();

    const scriptNames = allScriptVersionsAfterRemove.filter(
      (s) => s.details.versionMessage == "Updated name"
    );

    const removeAppStatus = await app.remove();

    expect(initialScript).to.be.equal(200) &&
      expect(anotherScript).to.be.equal(200) &&
      expect(allScriptVersions.length).to.be.greaterThan(2) &&
      expect(initialScriptValue.details.script).to.be.equal(script1) &&
      expect(anotherScriptValue.details.script).to.be.equal(script2) &&
      expect(removeScriptStatus).to.be.equal(200) &&
      expect(updateScriptNameStatus).to.be.equal(200) &&
      expect(updateScriptNameStatus).to.be.equal(200) &&
      expect(scriptNames.length).to.be.equal(1) &&
      expect(allScriptVersionsAfterRemove.length).to.be.equal(
        allScriptVersions.length - 1
      ) &&
      expect(removeAppStatus).to.be.equal(200);
  });

  it("Reload logs", async function () {
    const app = await saasApi.apps.get({
      id: `${process.env.RELOAD_LOGS_APP}`,
    });
    const logs = await app.reloadLogs();
    const log0 = await app.reloadLogContent({ reloadId: logs[0].reloadId });

    expect(logs.length).to.be.greaterThan(0) &&
      expect(log0.length).to.be.greaterThan(0) &&
      expect(log0.indexOf("Execution started")).to.be.greaterThan(-1);
  });
});
