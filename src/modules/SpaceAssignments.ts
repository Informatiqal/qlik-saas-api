import { QlikSaaSClient } from "qlik-rest-api";
import { Assignment, IAssignment } from "./SpaceAssignment";
import { parseFilter } from "../util/filter";

export interface IAssignmentCreate {
  type?: "user" | "group";
  assigneeId?: string;
  /**
   *  codeveloper, consumer, dataconsumer, facilitator, producer (for now)
   */
  roles?: string[];
}

export class SpaceAssignments {
  #saasClient: QlikSaaSClient;
  private spaceId: string;
  constructor(saasClient: QlikSaaSClient, spaceId: string) {
    this.#saasClient = saasClient;
    this.spaceId = spaceId;
  }

  async getAll() {
    return await this.#saasClient
      .Get<IAssignment[]>(`spaces/${this.spaceId}/assignments`)
      .then((res) => res.data)
      .then((assignments) =>
        assignments.map(
          (assignment) =>
            new Assignment(
              this.#saasClient,
              assignment.id,
              this.spaceId,
              assignment
            )
        )
      );
  }

  async getFilter(arg: { filter: string }) {
    if (!arg.filter)
      throw new Error(
        `space.assignments.getFilter: "filter" parameter is required`
      );

    return await this.getAll().then((entities) => {
      const anonFunction = Function(
        "entities",
        `return entities.filter(f => ${parseFilter(arg.filter, "f.details")})`
      );

      return anonFunction(entities) as Assignment[];
    });
  }

  async create(arg: IAssignmentCreate) {
    let data: { [k: string]: any } = {};
    if (arg.type) data["type"] = arg.type;
    if (arg.assigneeId) data["assigneeId"] = arg.assigneeId;
    if (arg.roles) data["roles"] = arg.roles;

    return await this.#saasClient
      .Post<IAssignment>(`spaces/${this.spaceId}/assignments`, data)
      .then((res) => res.data)
      .then(
        (assignment) =>
          new Assignment(
            this.#saasClient,
            assignment.id,
            this.spaceId,
            assignment
          )
      );
  }
}
