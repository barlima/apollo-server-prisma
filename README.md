# Apollo Server with Prisma

A GraphQL API built with Apollo Server, Prisma ORM, and PostgreSQL for managing property data with real-time weather information.

## Implementation

### Tech Stack

- **Apollo Server** - GraphQL server implementation
- **Pothos GraphQL** - Type-safe GraphQL schema builder
- **Prisma** - ORM for database access with PostgreSQL adapter
- **Express** - Web framework for Apollo Server integration
- **PostgreSQL** - Primary database
- **Zod** - Schema validation for external API responses
- **TypeScript** - Type-safe development
- **Vitest** - Unit testing framework
- **ESLint** - Code linting with TypeScript support

### Assumptions

- **Create request fails if weather request fails**: When creating a property, if the Weatherstack API call fails or returns invalid data, the entire property creation is aborted and no database entry is created. This ensures data consistency and prevents properties from existing without weather information.

- **Default to 0 in parseStringToFloat**: Air quality values from the Weatherstack API are returned as strings. If parsing fails or the value is invalid, the system defaults to 0. This approach prioritizes availability over strict validation, though it may require refinement based on business requirements.

- **Picking fields from the weather response**: Only fields documented in the Weatherstack API documentation are extracted and stored. The relevant fields are explicitly defined in [weatherstack.ts:25-55](src/lib/weatherstack/weatherstack.ts#L25-L55) to ensure the system only processes known, validated data points and maintains compatibility with the API schema.

## Running the Application

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
WEATHERSTACK_API_KEY=your_weatherstack_api_key
```

### Running Migrations

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate deploy
```

For development, you can also use:

```bash
npx prisma migrate dev
```

### Seed the Database

Populate the database with initial data:

```bash
npm run seed
```

### Starting the Server

Development mode with auto-reload:

```bash
npm run dev
```

Production build and start:

```bash
npm run build
npm start
```

The GraphQL server will be available at `http://localhost:4000/graphql`

## Additional Commands

### Testing

Run tests:

```bash
npm test
```

### Linting

Check for linting errors:

```bash
npm run lint
```
