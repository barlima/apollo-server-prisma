import { builder } from "../../lib/builder";
import type { WeatherData } from "../../generated/prisma/client";
import { fromParent } from "../../utils/fromParent";
import type { ExtractFields } from "../../types/ExtractFields";

const Astro = builder.objectRef<WeatherData>("Astro").implement({
  fields: (t) => {
    const resolve = (field: ExtractFields<WeatherData, "astro">) => {
      if (field === "MoonIllumination") {
        return t.int({ resolve: fromParent("astroMoonIllumination") });
      }

      return t.string({ resolve: fromParent(`astro${field}`) });
    };

    return {
      sunrise: resolve("Sunrise"),
      sunset: resolve("Sunset"),
      moonrise: resolve("Moonrise"),
      moonset: resolve("Moonset"),
      moonPhase: resolve("MoonPhase"),
      moonIllumination: resolve("MoonIllumination"),
    };
  },
});

const AirQuality = builder.objectRef<WeatherData>("AirQuality").implement({
  fields: (t) => {
    const resolve = (field: ExtractFields<WeatherData, "airQuality">) => {
      return t.float({ resolve: fromParent(`airQuality${field}`) });
    };

    return {
      co: resolve("Co"),
      no2: resolve("No2"),
      o3: resolve("O3"),
      so2: resolve("So2"),
      pm25: resolve("Pm25"),
      pm10: resolve("Pm10"),
      usEpaIndex: resolve("UsEpaIndex"),
      gbDefraIndex: resolve("GbDefraIndex"),
    };
  },
});

builder.prismaObject("WeatherData", {
  fields: (t) => ({
    id: t.exposeID("id"),
    observationTime: t.exposeString("observationTime"),
    temperature: t.exposeInt("temperature"),
    weatherCode: t.exposeInt("weatherCode"),
    weatherIcons: t.exposeStringList("weatherIcons"),
    weatherDescriptions: t.exposeStringList("weatherDescriptions"),
    astro: t.field({
      type: Astro,
      resolve: (parent) => parent,
    }),
    airQuality: t.field({
      type: AirQuality,
      resolve: (parent) => parent,
    }),
    windSpeed: t.exposeInt("windSpeed"),
    windDegree: t.exposeInt("windDegree"),
    windDir: t.exposeString("windDir"),
    pressure: t.exposeInt("pressure"),
    precip: t.exposeInt("precip"),
    humidity: t.exposeInt("humidity"),
    cloudcover: t.exposeInt("cloudcover"),
    feelslike: t.exposeInt("feelslike"),
    uvIndex: t.exposeInt("uvIndex"),
    visibility: t.exposeInt("visibility"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    property: t.relation("property", { nullable: true }),
  }),
});
