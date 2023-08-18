function f(filter: string) {
  // split the conditions on "and" and "or" (ignore cases: AND = and = And etc.)
  const r = new RegExp(/(?: and | or )+/, "ig");

  // use the above regex to get list of all conditions
  const conditions = filter.split(r);

  return conditions.map((condition) => parseCondition(condition));
}

function parseCondition(filter: string) {
  const f = filter.split(" ");

  return {
    property: f[0],
    operation: f[1],
    value: f.slice(2).join(" "),
  };
}

// const a = f("");
