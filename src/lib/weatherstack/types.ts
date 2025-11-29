import { Property, WeatherData } from "../../generated/prisma/client";

export type WeatherDataResponse = Omit<
  WeatherData,
  "id" | "propertyId" | "createdAt" | "updatedAt"
>;

export type CurrentWeatherOptions = Partial<
  Pick<Property, "city" | "state" | "zipCode" | "lat" | "lng">
>;

export interface IWeatherService {
  getCurrentWeather(
    options: CurrentWeatherOptions
  ): Promise<WeatherDataResponse | null>;
}
