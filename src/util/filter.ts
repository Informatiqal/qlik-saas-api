type ParsedCondition = {
  property: string;
  operation: string;
  value: string;
};

export function parseFilter(filter: string, baseObjPath: string) {
  //   if (!filter) throw new Error("");

  // split the conditions on "and" and "or" (ignore cases: AND = and = And etc.)
  const r = new RegExp(/(?: and | or )+/, "ig");

  // use the above regex to get list of all conditions
  const conditions = filter.split(r);

  // @ts-ignore: Object is possibly 'null'.
  const r1 = r.test(filter) ? filter.match(r).map((a) => a.toLowerCase()) : [];

  const parsedConditions = conditions.map((condition) =>
    parseCondition(condition)
  );

  const jsFilter = constructFilter(parsedConditions, r1, baseObjPath);

  return jsFilter;
}

function parseCondition(filter: string): ParsedCondition {
  const f = filter.split(" ");

  return {
    property: f[0],
    operation: f[1],
    value: f.slice(2).join(" "),
  };
}

function constructFilter(
  conditions: ParsedCondition[],
  operations: string[],
  baseObjPath: string
) {
  const c = {
    eq: (p, v) => `${p} == ${v}`,
    ne: (p, v) => `${p} != ${v}`,
    sw: (p, v) => `${p}.startsWith(${v})}`,
  };

  const op = {
    " and ": "&&",
    " or ": "||",
    " and": "&&",
    " or": "||",
    "and ": "&&",
    "or ": "||",
    and: "&&",
    or: "||",
  };

  return conditions
    .map(
      (c1, i) =>
        `${baseObjPath}.${c[c1.operation](c1.property, c1.value)} ${
          op[operations[i]] ?? ""
        } `
    )
    .join("");
}
