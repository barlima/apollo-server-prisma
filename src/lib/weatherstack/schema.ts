import { z } from "zod";

// Because we defined a flat structure in the Prisma schema
// we have to create a schema that matches the response
// Also we want to use camelCase across the codebase
export const weatherstackCurrentResponseSchema = z.object({
  location: z.object({
    lat: z.string(),
    lon: z.string(),
  }),
  current: z.object({
    observation_time: z.string(),
    temperature: z.number(),
    weather_code: z.number(),
    weather_icons: z.array(z.string()),
    weather_descriptions: z.array(z.string()),
    wind_speed: z.number(),
    wind_degree: z.number(),
    wind_dir: z.string(),
    pressure: z.number(),
    precip: z.number(),
    humidity: z.number(),
    cloudcover: z.number(),
    feelslike: z.number(),
    uv_index: z.number(),
    visibility: z.number(),
    air_quality: z.object({
      co: z.string(),
      no2: z.string(),
      o3: z.string(),
      so2: z.string(),
      pm2_5: z.string(),
      pm10: z.string(),
      "us-epa-index": z.string(),
      "gb-defra-index": z.string(),
    }),
    astro: z.object({
      sunrise: z.string(),
      sunset: z.string(),
      moonrise: z.string(),
      moonset: z.string(),
      moon_phase: z.string(),
      moon_illumination: z.number(),
    }),
  }),
});

export type WeatherstackCurrentResponse = z.infer<
  typeof weatherstackCurrentResponseSchema
>;
