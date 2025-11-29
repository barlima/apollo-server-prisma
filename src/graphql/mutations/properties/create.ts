import { GraphQLError } from "graphql";
import { builder } from "../../../lib/builder";
import { USStateEnum } from "../../enums/us-state";

builder.mutationField("createProperty", (t) => {
  return t.prismaField({
    type: "Property",
    args: {
      city: t.arg.string({
        required: true,
        validate: {
          maxLength: 100,
          minLength: 1,
        },
      }),
      state: t.arg({ type: USStateEnum, required: true }),
      street: t.arg.string({
        required: true,
        validate: {
          maxLength: 200,
          minLength: 1,
        },
      }),
      zipCode: t.arg.int({
        required: true,
        validate: {
          min: 501,
          max: 99950,
        },
      }),
    },
    resolve: async (query, _root, args, ctx) => {
      let weatherResponse = null;

      try {
        weatherResponse = await ctx.weather.getWeather({
          city: args.city,
          state: args.state,
          zipCode: args.zipCode,
        });

        if (!weatherResponse) {
          throw new GraphQLError("Failed to get weather data", {
            extensions: {
              code: "FAILED_TO_GET_WEATHER_DATA",
            },
          });
        }
      } catch (error) {
        ctx.logger.error(error as Error);
        // In case the weather data is not available, return an error
        // and do not proceed with the creation of the property
        throw error;
      }

      try {
        return ctx.prisma.property.create({
          ...query,
          data: {
            street: args.street,
            city: args.city,
            state: args.state,
            zipCode: args.zipCode,
            lat: weatherResponse.location.lat,
            lng: weatherResponse.location.lng,
            weatherData: {
              create: weatherResponse.current,
            },
          },
        });
      } catch (error) {
        ctx.logger.error(error as Error);
        throw error;
      }
    },
  });
});
