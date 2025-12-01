import { ObjectSnakeToCamel } from "../../types/ObjectSnakeToCamel";
import { mapRecordFromSnakeToCamel } from "../../utils/mapRecordFromSnakeToCamel";
import { pick } from "../../utils/pick";
import {
  WeatherstackCurrentResponse,
  weatherstackCurrentResponseSchema,
} from "./schema";
import { HttpClient } from "../httpCleint";
import { SimpleCache } from "../cache";

import type {
  CurrentWeatherOptions,
  IWeatherService,
  WeatherDataResponse,
  WeatherResponse,
} from "./types";
import type { IHttpClient } from "../httpCleint/types";
import type { ILogger } from "../logger/types";
import type { ICache } from "../cache/type";

export class Weatherstack implements IWeatherService {
  private readonly baseUrl: string;

  // In case of changes in the response, keep the list of fields
  // that we want to select and validate
  private readonly relevantKeys: (keyof WeatherstackCurrentResponse["current"])[];

  constructor(
    private readonly apiKey: string,
    private readonly httpClient: IHttpClient,
    private readonly logger: ILogger,
    // Cache the results of the weatherstack API calls for 5 minutes
    // I've decided to go for the zip code since the cities might be large
    // However in that case the lat/lng would be the same for the entire zip code area
    // Optionally we could go for the entire city+state combination
    private readonly cache: ICache<WeatherResponse>
  ) {
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

  public async getWeather(
    options: CurrentWeatherOptions
  ): Promise<WeatherResponse | null> {
    // Check zipCode in the cache
    if (options.zipCode) {
      const cached = this.cache.get(options.zipCode);
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await this.httpClient.fetch(
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

      const weatherData = this.formatWeatherData(normalizedData);
      const location = {
        lat: parseFloat(validatedData.location.lat),
        lng: parseFloat(validatedData.location.lon),
      };

      const result = { current: weatherData, location };

      // Cache the result
      if (options.zipCode) {
        this.cache.set(options.zipCode, result);
      }

      return result;
    } catch (error) {
      this.logger.error(error as Error);
      // Possibly schedule a job to retry the request
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

export const createWeatherstackService = (
  apiKey: string,
  logger: ILogger
): IWeatherService => {
  const httpClient = new HttpClient();
  const cache = new SimpleCache<WeatherResponse>(5);

  return new Weatherstack(apiKey, httpClient, logger, cache);
};
