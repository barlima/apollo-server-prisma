import { Property, WeatherData } from "../../generated/prisma/client";

export type WeatherDataResponse = Omit<
  WeatherData,
  "id" | "propertyId" | "createdAt" | "updatedAt"
>;

export type WeatherResponse = {
  current: WeatherDataResponse;
  location: {
    lat: number;
    lng: number;
  };
};

export type CurrentWeatherOptions = Partial<
  Pick<Property, "city" | "state" | "zipCode" | "street">
>;

export interface IWeatherService {
  getWeather(
    options: CurrentWeatherOptions
  ): Promise<WeatherResponse | null>;
}
