import { config } from "../../config";
import { Property, WeatherData } from "../../generated/prisma/client";
import { ObjectSnakeToCamel } from "../../types/ObjectSnakeToCamel";
import { mapRecordFromSnakeToCamel } from "../../utils/mapRecordFromSnakeToCamel";
import { pick } from "../../utils/pick";
import {
  WeatherstackCurrentResponse,
  weatherstackCurrentResponseSchema,
} from "./schema";

type WeatherDataResponse = Omit<
  WeatherData,
  "id" | "propertyId" | "createdAt" | "updatedAt"
>;

type CurrentWeatherOptions = Partial<
  Pick<Property, "city" | "state" | "zipCode" | "lat" | "lng">
>;

class Weatherstack {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  // In case of changes in the response, keep the list of fields
  // that we want to select and validate
  private readonly relevantKeys: (keyof WeatherstackCurrentResponse["current"])[];

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.weatherstack.com";
    this.relevantKeys = [
      "observation_time",
      "temperature",
      "weather_code",
      "weather_icons",
      "weather_descriptions",
      "wind_speed",
      "wind_degree",
      "wind_dir",
      "pressure",
      "precip",
      "humidity",
      "cloudcover",
      "feelslike",
      "uv_index",
      "visibility",
      "astro",
      "air_quality",
    ];
  }

  public async getCurrentWeather(
    options: CurrentWeatherOptions
  ): Promise<WeatherDataResponse | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/current?${this.getQueryParams(options).toString()}`
      );

      if (!response.ok) {
        throw new Error(
          `Weatherstack API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      const validatedData = this.validateResponse(data);
      const relevantData = this.pickRelevantData(validatedData);
      const normalizedData = mapRecordFromSnakeToCamel(relevantData);

      return this.formatWeatherData(normalizedData);
    } catch (error) {
      console.error(error);
      // Log the error to an external service
      // If required - schedule a job to retry the request
      throw error;
    }
  }

  private getQueryParams(options: CurrentWeatherOptions) {
    const query = Object.values(options).filter(Boolean).join(",");

    const params = new URLSearchParams({
      access_key: this.apiKey,
      query,
    });

    return params;
  }

  private formatWeatherData(
    data: ObjectSnakeToCamel<WeatherstackCurrentResponse["current"]>
  ): WeatherDataResponse {
    const { astro, airQuality, ...rest } = data;

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

  private pickRelevantData(
    data: WeatherstackCurrentResponse
  ): WeatherstackCurrentResponse["current"] {
    return pick(data.current, this.relevantKeys);
  }

  private validateResponse(data: unknown): WeatherstackCurrentResponse {
    const validatedData = weatherstackCurrentResponseSchema.safeParse(data);

    if (!validatedData.success) {
      throw new Error(validatedData.error.message);
    }

    return validatedData.data;
  }
}

export const weatherstack = new Weatherstack(config.weatherstackApiKey);
