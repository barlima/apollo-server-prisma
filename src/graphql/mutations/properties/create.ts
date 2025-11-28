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
      const data = {
        city: args.city,
        state: args.state,
        zipCode: args.zipCode,
        lat: args.lat,
        lng: args.lng,
      };
      let weatherData = null;

      try {
        weatherData = await ctx.weather.getCurrentWeather(data);
      } catch (error) {
        console.error(error);
        // Log the error to an external service
        // Continue without weather data
      }

      const propertyData = {
        ...data,
        street: args.street,
      };

      if (!weatherData) {
        return ctx.prisma.property.create({
          ...query,
          data: propertyData,
        });
      } else {
        return ctx.prisma.property.create({
          ...query,
          data: {
            ...propertyData,
            weatherData: {
              create: weatherData,
            },
          },
        });
      }
    },
  });
});
