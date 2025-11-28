import { builder } from "../../../lib/builder";
import { USStateEnum } from "../../enums/us-state";

builder.mutationField("createProperty", (t) => {
  return t.prismaField({
    type: "Property",
    args: {
      city: t.arg.string({ required: true }),
      state: t.arg({ type: USStateEnum, required: true }),
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

        if (!weatherData) {
          throw new Error("Failed to get weather data");
        }
      } catch (error) {
        console.error(error);
        // Log the error to an external service
        // In case the weather data is not available, return an error
        throw error;
      }

      return ctx.prisma.property.create({
        ...query,
        data: {
          ...data,
          street: args.street,
          weatherData: {
            create: weatherData,
          },
        },
      });
    },
  });
});
