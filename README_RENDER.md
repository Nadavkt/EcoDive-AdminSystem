# Deploy Server to Render

## Steps

1. Push this repo to GitHub.
2. In Render, create a new Web Service from your repo. Render will detect `render.yaml` and provision the service using the `Server/` subfolder.
3. Set environment variables:
   - `DATABASE_URL`: your Render PostgreSQL (or AWS RDS) connection string
   - `NODE_ENV=production`
4. Render will run `npm install` and `npm start` in `Server/`.
5. After deploy, the `postDeployCommand` runs `npm run migrate` to apply SQL migrations.

## Health Check

- Render uses `/healthz` which is implemented in `Server/index.js`.

## File uploads

- This app serves `uploads/` from disk. On Render's ephemeral filesystem, files reset on redeploy.
- For persistence, consider moving uploads to S3 and storing object keys in DB.
