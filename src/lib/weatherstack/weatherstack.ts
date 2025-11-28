import { config } from "../../config";
import { Property, WeatherData } from "../../generated/prisma/client";
import { mapRecordFromSnakeToCamel } from "../../utils/mapRecordFromSnakeToCamel";
import {
  WeatherstackCurrentResponse,
  weatherstackCurrentResponseSchema,
} from "./weatherstack.schema";

type WeatherDataResponse = Omit<
  WeatherData,
  "id" | "propertyId" | "createdAt" | "updatedAt"
>;

class Weatherstack {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.weatherstack.com";
  }

  public async getCurrentWeather(
    options: Partial<
      Pick<Property, "city" | "state" | "zipCode" | "lat" | "lng">
    >
  ): Promise<WeatherDataResponse | null> {
    const query = Object.values(options).filter(Boolean).join(",");

    const params = new URLSearchParams({
      access_key: this.apiKey,
      query,
    });

    try {
      const response = await fetch(
        `${this.baseUrl}/current?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `Weatherstack API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const validatedData = weatherstackCurrentResponseSchema.safeParse(data);

      if (!validatedData.success) {
        throw new Error(validatedData.error.message);
      }

      return this.formatWeatherData(validatedData.data.current);
    } catch (error) {
      console.error(error);
      // Log the error to an external service
      // If required - schedule a job to retry the request
      throw error;
    }
  }

  private formatWeatherData(
    data: WeatherstackCurrentResponse["current"]
  ): WeatherDataResponse {
    // isDay is not defined in the documentation
    const { astro, airQuality, isDay, ...rest } =
      mapRecordFromSnakeToCamel(data);

    return {
      ...rest,
      astroSunrise: astro.sunrise,
      astroSunset: astro.sunset,
      astroMoonrise: astro.moonrise,
      astroMoonset: astro.moonset,
      astroMoonPhase: astro.moonPhase,
      astroMoonIllumination: astro.moonIllumination,
      airQualityCo: this.parseStringToFloat(airQuality.co),
      airQualityNo2: this.parseStringToFloat(airQuality.no2),
      airQualityO3: this.parseStringToFloat(airQuality.o3),
      airQualitySo2: this.parseStringToFloat(airQuality.so2),
      airQualityPm25: this.parseStringToFloat(airQuality.pm25),
      airQualityPm10: this.parseStringToFloat(airQuality.pm10),
      airQualityUsEpaIndex: this.parseStringToFloat(airQuality["us-epa-index"]),
      airQualityGbDefraIndex: this.parseStringToFloat(
        airQuality["gb-defra-index"]
      ),
    };
  }

  private parseStringToFloat(value: string): number {
    // If the value is not a number, return 0 by default
    // It might require a more sophisticated approach (more details needed)
    return parseFloat(value) || 0;
  }
}

export const weatherstack = new Weatherstack(config.weatherstackApiKey);
