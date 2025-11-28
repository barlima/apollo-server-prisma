import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import { ExecutionResult, graphql } from "graphql";
import { createMockPrisma, createMockContext } from "../../utils/test";
import "../../graphql";
import { builder } from "../../lib/builder";
import { Property } from "../../generated/prisma/client";

type PropertiesQueryResponse = ExecutionResult<{
  properties: { edges: { node: Property }[] };
}>;

describe("properties resolver", () => {
  let schema: ReturnType<typeof builder.toSchema>;
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

  beforeAll(() => {
    schema = builder.toSchema();
  });

  beforeEach(() => {
    mockPrisma = createMockPrisma();
  });

  it("should return all properties when no filters are applied", async () => {
    mockPrisma.property.findMany.mockResolvedValue(mockProperties);

    const query = `
      query {
        properties {
          edges {
            node {
              id
              city
              state
              zipCode
            }
          }
        }
      }
    `;

    const result = (await graphql({
      schema,
      source: query,
      contextValue: createMockContext(mockPrisma),
    })) as PropertiesQueryResponse;

    expect(result.errors).toBeUndefined();
    expect(mockPrisma.property.findMany).toHaveBeenCalled();

    const callArgs = mockPrisma.property.findMany.mock.calls[0][0];

    expect(callArgs.where).toEqual({
      city: undefined,
      state: undefined,
      zipCode: undefined,
    });

    expect(result.data?.properties.edges).toHaveLength(3);
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
          edges {
            node {
              id
              city
              state
              zipCode
            }
          }
        }
      }
    `;

    const result = (await graphql({
      schema,
      source: query,
      contextValue: createMockContext(mockPrisma),
    })) as PropertiesQueryResponse;

    expect(result.errors).toBeUndefined();
    expect(mockPrisma.property.findMany).toHaveBeenCalled();
    expect(result.data?.properties.edges).toHaveLength(2);
    expect(result.data?.properties).toMatchSnapshot();
  });

  it("should filter by state when state is provided", async () => {
    mockPrisma.property.findMany.mockResolvedValue(mockProperties);

    const query = `
      query {
        properties(state: "CA") {
          edges {
            node {
              id
              city
              state
              zipCode
            }
          }
        }
      }
    `;

    const result = (await graphql({
      schema,
      source: query,
      contextValue: createMockContext(mockPrisma),
    })) as PropertiesQueryResponse;

    expect(result.errors).toBeUndefined();
    expect(mockPrisma.property.findMany).toHaveBeenCalled();
    expect(result.data?.properties.edges).toHaveLength(3);
    expect(result.data?.properties).toMatchSnapshot();
  });

  it("should filter by all arguments when all are provided", async () => {
    const filteredProperties = mockProperties.filter(
      (p) =>
        p.city === "San Francisco" && p.state === "CA" && p.zipCode === 94102
    );
    mockPrisma.property.findMany.mockResolvedValue(filteredProperties);

    const query = `
      query {
        properties(city: "San Francisco", state: "CA", zipCode: 94102) {
          edges {
            node {
              id
              city
              state
              zipCode
            }
          }
        }
      }
    `;

    const result = (await graphql({
      schema,
      source: query,
      contextValue: createMockContext(mockPrisma),
    })) as PropertiesQueryResponse;

    expect(result.errors).toBeUndefined();
    expect(mockPrisma.property.findMany).toHaveBeenCalled();
    expect(result.data?.properties.edges).toHaveLength(1);
    expect(result.data?.properties).toMatchSnapshot();
  });

  it("should support cursor pagination with first argument", async () => {
    mockPrisma.property.findMany.mockResolvedValue(mockProperties.slice(0, 2));

    const query = `
      query {
        properties(first: 2) {
          edges {
            node {
              id
              city
            }
          }
        }
      }
    `;

    const result = (await graphql({
      schema,
      source: query,
      contextValue: createMockContext(mockPrisma),
    })) as PropertiesQueryResponse;

    expect(result.errors).toBeUndefined();
    expect(result.data?.properties.edges).toHaveLength(2);
    expect(result.data?.properties).toMatchSnapshot();
  });
});
