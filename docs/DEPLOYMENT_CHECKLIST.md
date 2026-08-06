# Deployment checklist

## Before deployment

1. Back up the current MySQL database.
2. Use Node.js 20 or newer.
3. Copy `.env.example` to `.env` and replace every placeholder.
4. Set `CORS_ORIGIN` to the exact production frontend origins.
5. Use a unique `JWT_SECRET` of at least 32 characters.
6. Put the DVLA key only in `DVLA_API_KEY`.

## Install and verify

```bash
npm install
npm run check
npm run db:migrate:status
npm run db:migrate
npm start
```

## First account

Create the first account with `POST /api/auth/register`. The first account is always created as `Admin`. Afterwards, create staff through the protected `/api/users` API.

## Smoke checks

```bash
curl https://api.prestigeworkshops.com/health
```

Then verify:

- Login and `/api/auth/me`
- Create customer and vehicle
- DVLA lookup
- Create and approve estimate
- Confirm one job sheet is generated
- Create invoice from the job sheet
- Record a partial payment and confirm payment history
- Submit a public contact enquiry
- Load dashboard metrics

## Existing database note

The hardening migrations add unique constraints for customer email, customer phone, customer code, registration number, estimate job number and one job sheet per estimate. Resolve genuine duplicate legacy values before migration if MySQL reports a unique-index conflict.
