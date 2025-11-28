import { GraphQLError } from "graphql";
import { z } from "zod";

const createPropertySchema = z.object({
  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be at most 100 characters"),
  street: z
    .string()
    .min(1, "Street is required")
    .max(200, "Street must be at most 200 characters"),
  zipCode: z
    .number()
    .int("Zip code must be an integer")
    .min(501, "Invalid US zip code")
    .max(99950, "Invalid US zip code"),
  lat: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  lng: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;

export const validateCreatePropertyInput = (
  input: unknown
): CreatePropertyInput => {
  const result = createPropertySchema.safeParse(input);

  if (!result.success) {
    throw new GraphQLError(`Validation error: ${result.error.message}`);
  }

  return result.data;
};
