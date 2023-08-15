// import { QlikSaaSClient } from "qlik-rest-api";
// import { Automation } from "./Automation";
// import { IAutomation, IAutomationCreate } from "./Automation.interfaces";
// import { Run } from "./Run";

// export class Runs {
//   private saasClient: QlikSaaSClient;
//   constructor(saasClient: QlikSaaSClient) {
//     this.saasClient = saasClient;
//   }

//   async get(arg: { id: string }) {
//     if (!arg.id) throw new Error(`runs.get: "id" parameter is required`);

//     const a: Run = new Run(this.saasClient, arg.id);
//     await a.init();

//     return a;
//   }

//   async getAll() {
//     return await this.saasClient
//       .Get(`automations`)
//       .then((res) => res.data as IAutomation[])
//       .then((data: any) => {
//         return data.map((t) => new Automation(this.saasClient, t.id, t));
//       });
//   }

//   async create(arg: IAutomationCreate) {
//     return await this.saasClient
//       .Post("automations", { ...arg })
//       .then((res) => res.data as IAutomation);
//   }
// }
