import { config } from "./config";
import { createLogger } from "./lib/logger";
import { ILogger } from "./lib/logger/types";
import { prisma } from "./lib/prisma";

import {
  createWeatherstackService,
  type IWeatherService,
} from "./lib/weatherstack";

export interface Context {
  prisma: typeof prisma;
  weather: IWeatherService;
  logger: ILogger;
}

const logger = createLogger();
const weather = createWeatherstackService(config.weatherstackApiKey, logger);

export const createContext = async (): Promise<Context> => {
  return Promise.resolve({
    prisma,
    weather,
    logger,
  });
};
