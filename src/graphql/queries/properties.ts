import { builder } from "../../lib/builder";
import { nonNullable } from "../../utils/nonNullable";

const PropertyOrderBy = builder.enumType("PropertyOrderBy", {
  values: {
    CREATED_AT_ASC: { value: "asc" },
    CREATED_AT_DESC: { value: "desc" },
  },
});

builder.queryField("properties", (t) => {
  return t.prismaConnection({
    type: "Property",
    cursor: "id",
    args: {
      city: t.arg.string(),
      state: t.arg.string(),
      zipCode: t.arg.int(),
      orderBy: t.arg({ type: PropertyOrderBy }),
    },
    resolve: (query, _root, args, ctx) => {
      return ctx.prisma.property.findMany({
        ...query,
        where: {
          city: nonNullable(args.city),
          state: nonNullable(args.state),
          zipCode: nonNullable(args.zipCode),
        },
        orderBy: {
          createdAt: args.orderBy ?? undefined,
        },
      });
    },
  });
});
