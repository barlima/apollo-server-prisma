import { describe, it, expect, vi, beforeEach } from "vitest";
import { Weatherstack } from "./weatherstack";
import { WeatherstackCurrentResponse } from "./schema";
import { ILogger } from "../logger/types";

describe("Weatherstack", () => {
  let mockLogger: ILogger;
  let fakeWeatherResponse: WeatherstackCurrentResponse;

  beforeEach(() => {
    mockLogger = {
      error: vi.fn(),
    };
    fakeWeatherResponse = {
      current: {
        observation_time: "10:00 AM",
        temperature: 20,
        weather_code: 1000,
        weather_icons: ["01d"],
        weather_descriptions: ["Clear sky"],
        astro: {
          sunrise: "6:00 AM",
          sunset: "6:00 PM",
          moonrise: "6:00 PM",
          moonset: "6:00 AM",
          moon_phase: "Full Moon",
          moon_illumination: 100,
        },
        air_quality: {
          co: "10",
          no2: "10",
          o3: "10",
          so2: "10",
          pm2_5: "10",
          pm10: "10",
          "us-epa-index": "10",
          "gb-defra-index": "10",
        },
        wind_speed: 10,
        wind_degree: 10,
        wind_dir: "N",
        pressure: 10,
        precip: 10,
        humidity: 10,
        cloudcover: 10,
        feelslike: 10,
        uv_index: 10,
        visibility: 10,
      },
    };
  });

  it("should fetch weather data successfully", async () => {
    const mockHttpClient = {
      fetch: vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(fakeWeatherResponse),
      }),
    };

    const service = new Weatherstack("1234567890", mockHttpClient, mockLogger);

    const result = await service.getCurrentWeather({
      city: "New York",
    });

    expect(mockHttpClient.fetch).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result?.temperature).toBe(20);
    expect(result?.windSpeed).toBe(10);
    expect(result?.astroSunset).toBe("6:00 PM");
    expect(result?.airQualityCo).toBe(10);
    expect(Object.values(result || {}).length).toBe(29);
  });

  it("should throw a validation error if the response is invalid", async () => {
    const mockHttpClient = {
      fetch: vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ invalid: "response" }),
      }),
    };

    const service = new Weatherstack("1234567890", mockHttpClient, mockLogger);

    await expect(
      service.getCurrentWeather({
        city: "New York",
      })
    ).rejects.toThrow();
  });
});
