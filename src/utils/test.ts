import { vi } from "vitest";
import type { Context } from "../context";

const prismaFunctions = {
  findMany: vi.fn(),
  findUnique: vi.fn(),
  findFirst: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

export const createMockPrisma = () => ({
  property: prismaFunctions,
  weatherData: prismaFunctions,
});

export const createMockContext = (
  mockPrisma: ReturnType<typeof createMockPrisma>
): Context => ({
  prisma: mockPrisma as unknown as Context["prisma"],
});
