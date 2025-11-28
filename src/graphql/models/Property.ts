import { builder } from "../../lib/builder";

builder.prismaNode("Property", {
  id: { field: "id" },
  fields: (t) => ({
    city: t.exposeString("city"),
    street: t.exposeString("street"),
    state: t.exposeString("state"),
    zipCode: t.exposeInt("zipCode"),
    lat: t.exposeFloat("lat"),
    lng: t.exposeFloat("lng"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    weatherData: t.relation("weatherData", { nullable: true }),
  }),
});
