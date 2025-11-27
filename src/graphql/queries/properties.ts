import { builder } from "../../lib/builder";

builder.queryField("properties", (t) => {
  return t.stringList({
    resolve: () => [],
  });
});
