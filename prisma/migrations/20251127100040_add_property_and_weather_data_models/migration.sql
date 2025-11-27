-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeatherData" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "observationTime" TEXT NOT NULL,
    "temperature" INTEGER NOT NULL,
    "weatherCode" INTEGER NOT NULL,
    "weatherIcons" TEXT[],
    "weatherDescriptions" TEXT[],
    "astroSunrise" TEXT NOT NULL,
    "astroSunset" TEXT NOT NULL,
    "astroMoonrise" TEXT NOT NULL,
    "astroMoonset" TEXT NOT NULL,
    "astroMoonPhase" TEXT NOT NULL,
    "astroMoonIllumination" INTEGER NOT NULL,
    "airQualityCo" DOUBLE PRECISION NOT NULL,
    "airQualityNo2" DOUBLE PRECISION NOT NULL,
    "airQualityO3" DOUBLE PRECISION NOT NULL,
    "airQualitySo2" DOUBLE PRECISION NOT NULL,
    "airQualityPm25" DOUBLE PRECISION NOT NULL,
    "airQualityPm10" DOUBLE PRECISION NOT NULL,
    "airQualityUsEpaIndex" INTEGER NOT NULL,
    "airQualityGbDefraIndex" INTEGER NOT NULL,
    "windSpeed" INTEGER NOT NULL,
    "windDegree" INTEGER NOT NULL,
    "windDir" TEXT NOT NULL,
    "pressure" INTEGER NOT NULL,
    "precip" INTEGER NOT NULL,
    "humidity" INTEGER NOT NULL,
    "cloudcover" INTEGER NOT NULL,
    "feelslike" INTEGER NOT NULL,
    "uvIndex" INTEGER NOT NULL,
    "visibility" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WeatherData_propertyId_key" ON "WeatherData"("propertyId");

-- AddForeignKey
ALTER TABLE "WeatherData" ADD CONSTRAINT "WeatherData_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
