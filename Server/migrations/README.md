Migrations

How to run locally:

1. Ensure a `.env` file exists in `Server/` with `DATABASE_URL` pointing to your Postgres.
2. From `Server/`, run: `npm run migrate`

Deploying to AWS RDS:

- Create an RDS PostgreSQL instance and obtain its connection string.
- Set the `DATABASE_URL` env var on your server (e.g., in ECS task definition or EC2 env) to the RDS URL.
- Run `npm run migrate` during deployment.

Migration ordering:

- Files are applied in lexicographical order. Use numeric prefixes like `0001_`, `0002_`.


