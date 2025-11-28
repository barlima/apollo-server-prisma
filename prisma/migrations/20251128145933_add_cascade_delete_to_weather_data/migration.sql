-- DropForeignKey
ALTER TABLE "WeatherData" DROP CONSTRAINT "WeatherData_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "WeatherData" ADD CONSTRAINT "WeatherData_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
