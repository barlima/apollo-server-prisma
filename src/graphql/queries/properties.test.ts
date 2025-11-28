import { describe, it, expect, beforeEach } from "vitest";
import { GraphQLSchema, graphql } from "graphql";
import { builder } from "../../lib/builder";
import { createMockPrisma, createMockContext } from "../../utils/test";
import "./properties";

describe("properties resolver", () => {
  let schema: GraphQLSchema;
  let mockPrisma: ReturnType<typeof createMockPrisma>;

  const mockProperties = [
    {
      id: "1",
      city: "San Francisco",
      street: "Market St",
      state: "CA",
      zipCode: 94102,
      lat: 37.7749,
      lng: -122.4194,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: "2",
      city: "Los Angeles",
      street: "Broadway",
      state: "CA",
      zipCode: 90012,
      lat: 34.0522,
      lng: -118.2437,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
    },
    {
      id: "3",
      city: "San Francisco",
      street: "Mission St",
      state: "CA",
      zipCode: 94110,
      lat: 37.7599,
      lng: -122.4148,
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-03"),
    },
  ];

  beforeEach(() => {
    schema = builder.toSchema();
    mockPrisma = createMockPrisma();
  });

  it("should return all properties when no filters are applied", async () => {
    mockPrisma.property.findMany.mockResolvedValue(mockProperties);

    const query = `
      query {
        properties {
          id
          city
          state
          zipCode
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
      contextValue: createMockContext(mockPrisma),
    });

    expect(result.errors).toBeUndefined();
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith({
      where: {
        city: undefined,
        state: undefined,
        zipCode: undefined,
      },
    });
    expect(result.data?.properties).toHaveLength(3);
    expect(result.data?.properties).toMatchSnapshot();
  });

  it("should filter by city when city is provided", async () => {
    const filteredProperties = mockProperties.filter(
      (p) => p.city === "San Francisco"
    );
    mockPrisma.property.findMany.mockResolvedValue(filteredProperties);

    const query = `
      query {
        properties(city: "San Francisco") {
          id
          city
          state
          zipCode
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
      contextValue: createMockContext(mockPrisma),
    });

    expect(result.errors).toBeUndefined();
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith({
      where: {
        city: "San Francisco",
        state: undefined,
        zipCode: undefined,
      },
    });
    expect(result.data?.properties).toHaveLength(2);
    expect(result.data?.properties).toMatchSnapshot();
  });

  it("should filter by state when state is provided", async () => {
    mockPrisma.property.findMany.mockResolvedValue(mockProperties);

    const query = `
      query {
        properties(state: "CA") {
          id
          city
          state
          zipCode
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
      contextValue: createMockContext(mockPrisma),
    });

    expect(result.errors).toBeUndefined();
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith({
      where: {
        city: undefined,
        state: "CA",
        zipCode: undefined,
      },
    });
    expect(result.data?.properties).toHaveLength(3);
    expect(result.data?.properties).toMatchSnapshot();
  });

  it("should filter by all arguments when all are provided", async () => {
    const filteredProperties = mockProperties.filter(
      (p) =>
        p.city === "San Francisco" &&
        p.state === "CA" &&
        p.zipCode === 94102
    );
    mockPrisma.property.findMany.mockResolvedValue(filteredProperties);

    const query = `
      query {
        properties(city: "San Francisco", state: "CA", zipCode: 94102) {
          id
          city
          state
          zipCode
        }
      }
    `;

    const result = await graphql({
      schema,
      source: query,
      contextValue: createMockContext(mockPrisma),
    });

    expect(result.errors).toBeUndefined();
    expect(mockPrisma.property.findMany).toHaveBeenCalledWith({
      where: {
        city: "San Francisco",
        state: "CA",
        zipCode: 94102,
      },
    });
    expect(result.data?.properties).toHaveLength(1);
    expect(result.data?.properties).toMatchSnapshot();
  });
});
