import { prisma } from "./lib/prisma";
import { weatherstack } from "./lib/weatherstack/weatherstack";

export interface Context {
  prisma: typeof prisma;
  weather: typeof weatherstack;
}

export const createContext = async (): Promise<Context> => {
  return {
    prisma,
    weather: weatherstack,
  };
};
