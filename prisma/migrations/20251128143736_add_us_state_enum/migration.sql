-- CreateEnum
CREATE TYPE "USState" AS ENUM ('AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC');

-- AlterTable: Convert the state column from TEXT to USState enum
-- Step 1: Add a temporary column with the enum type
ALTER TABLE "Property" ADD COLUMN "state_new" "USState";

-- Step 2: Copy and cast existing data to the new column (convert to uppercase to match enum values)
UPDATE "Property" SET "state_new" = UPPER("state")::"USState";

-- Step 3: Drop the old column
ALTER TABLE "Property" DROP COLUMN "state";

-- Step 4: Rename the new column to the original name
ALTER TABLE "Property" RENAME COLUMN "state_new" TO "state";

-- Step 5: Make the column NOT NULL
ALTER TABLE "Property" ALTER COLUMN "state" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Property_state_idx" ON "Property"("state");
