import { builder } from "../../lib/builder";

builder.mutationField("deleteProperty", (t) => {
  return t.prismaField({
    type: "Property",
    args: {
      id: t.arg.globalID({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      const { id } = args.id;

      return ctx.prisma.property.delete({
        ...query,
        where: { id: String(id) },
      });
    },
  });
});
