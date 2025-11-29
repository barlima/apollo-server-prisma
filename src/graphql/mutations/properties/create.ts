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
      lat: t.arg.float({
        required: true,
        validate: {
          min: -90,
          max: 90,
        },
      }),
      lng: t.arg.float({
        required: true,
        validate: {
          min: -180,
          max: 180,
        },
      }),
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
            ...data,
            street: args.street,
            weatherData: {
              create: weatherData,
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
