import { builder } from "../../../lib/builder";

builder.mutationField("createProperty", (t) => {
  return t.prismaField({
    type: "Property",
    args: {
      city: t.arg.string({ required: true }),
      state: t.arg.string({ required: true }),
      street: t.arg.string({ required: true }),
      zipCode: t.arg.int({ required: true }),
      lat: t.arg.float({ required: true }),
      lng: t.arg.float({ required: true }),
    },
    resolve: async (query, _root, args, ctx) => {
      return ctx.prisma.property.create({
        ...query,
        data: {
          city: args.city,
          state: args.state,
          street: args.street,
          zipCode: args.zipCode,
          lat: args.lat,
          lng: args.lng,
        },
      });
    },
  });
});