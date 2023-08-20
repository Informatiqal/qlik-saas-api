export type ParsedCondition = {
  property: string;
  operation: string;
  value: string;
};

/**
 * Convert custom search statements to JS statement string.
 * Custom search statements format/examples:
 * - id eq 123-123-123-13
 * - name eq "some name" and description eq "something else"
 *
 * @param filter the actual filter string
 * @param baseObjPath the path of the origin object. This path will be included in the final JS statement
 * @returns string based JS statement
 */
export function parseFilter(filter: string, baseObjPath: string) {
  //   if (!filter) throw new Error("");

  // split the conditions on "and" and "or" (ignore cases: AND = and = And etc.)
  const r = new RegExp(/(?: and | or )+/, "ig");

  // use the above regex to get list of all conditions
  const conditions = filter.split(r);

  // @ts-ignore: Object is possibly 'null'.
  const r1 = r.test(filter) ? filter.match(r).map((a) => a.toLowerCase()) : [];

  // prepare the conditions - separate the property, operation and value
  const parsedConditions = conditions.map((condition) => {
    const f = filter.split(" ");
    return {
      property: f[0],
      operation: f[1],
      value: f.slice(2).join(" "),
    };
  });

  // the final JS filter statement
  try {
    return constructFilter(parsedConditions, r1, baseObjPath);
  } catch (e) {
    return "";
  }
}

// convert the parsed filter condition to a JS statement
function constructFilter(
  conditions: ParsedCondition[],
  operations: string[],
  baseObjPath: string
) {
  const c = {
    // equal
    eq: (p, v) => `${p} == ${v}`,
    // not equal
    ne: (p, v) => `${p} != ${v}`,
    // starts with
    sw: (p, v) => `${p}.startsWith(${v})`,
    // ends with
    ew: (p, v) => `${p}.endsWith(${v})`,
    // substring of
    so: (p, v) => `${p}.includes(${v})`,
    // grater than
    gt: (p, v) => `${p} > ${v}`,
    // greater than or equal
    ge: (p, v) => `${p} >= ${v}`,
    // less than
    lt: (p, v) => `${p} < ${v}`,
    // less than or equal
    le: (p, v) => `${p} <= ${v}`,
  };

  const op = {
    and: "&&",
    or: "||",
    " and ": "&&",
    " or ": "||",
    " and": "&&",
    " or": "||",
    "and ": "&&",
    "or ": "||",
  };

  return conditions
    .map((c1, i) => {
      if (!c[c1.operation])
        throw new Error(`"${c1.operation}" is not a valid filter operation.`);

      return `${baseObjPath}.${c[c1.operation](c1.property, c1.value)} ${
        op[operations[i]] ?? ""
      } `;
    })
    .join("");
}
