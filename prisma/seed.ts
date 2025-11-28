import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../src/config";
import { PrismaClient, USState } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: config.databaseUrl });
const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});

async function main() {
  // Cleanup
  // await prisma.weatherData.deleteMany();
  // await prisma.property.deleteMany();

  const properties = [
    {
      city: "San Francisco",
      lat: 37.782366031390154,
      lng: -122.46198178917844,
      state: USState.CA,
      street: "334-336 4th Ave",
      zipCode: 94118,
    },
    {
      city: "New York",
      street: "1324 Eastern Pkwy #2",
      state: USState.NY,
      zipCode: 11233,
      lat: 40.66798468226293,
      lng: -73.92454140272604,
    },
    {
      city: "New York",
      street: "149 Pembroke St, Brooklyn",
      state: USState.NY,
      zipCode: 11235,
      lat: 40.57964195849016,
      lng: -73.93675998878766,
    },
    {
      city: "Dallas",
      street: "5828 Prospect Ave",
      state: USState.TX,
      zipCode: 75206,
      lat: 32.814492400807595,
      lng: -96.76684993239417,
    },
  ];

  for (const property of properties) {
    const created = await prisma.property.create({
      data: {
        ...property,
        weatherData: {
          create: {
            observationTime: '10:00 AM',
            temperature: 20,
            weatherCode: 1000,
            weatherIcons: ["01d"],
            weatherDescriptions: ["Clear sky"],
            astroSunrise: '6:00 AM',
            astroSunset: '6:00 PM',
            astroMoonrise: '6:00 PM',
            astroMoonset: '6:00 AM',
            astroMoonPhase: "Full Moon",
            astroMoonIllumination: 100,
            airQualityCo: 10,
            airQualityNo2: 10,
            airQualityO3: 10,
            airQualitySo2: 10,
            airQualityPm25: 10,
            airQualityPm10: 10,
            airQualityUsEpaIndex: 10,
            airQualityGbDefraIndex: 10,
            windSpeed: 10,
            windDegree: 10,
            windDir: "N",
            pressure: 10,
            precip: 10,
            humidity: 10,
            cloudcover: 10,
            feelslike: 10,
            uvIndex: 10,
            visibility: 10,
          },
        },
      },
    });
    console.log(`Created property: ${created.street}, ${created.city}`);
  }

  console.log("Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
