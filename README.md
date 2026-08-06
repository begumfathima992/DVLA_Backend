# PrestigeWorkshops API v2

Production-focused Express, Sequelize and MySQL backend aligned with the `prestigeworkshops-premium-responsive-v9` frontend.

## Included modules

- Authentication: first-admin registration, login, logout and current user
- Admin-managed workshop team accounts and roles
- Dashboard metrics and recent activity
- Customers and customer search
- Vehicles, customer vehicles and UK DVLA lookup
- Estimates with line items, per-line VAT and approval workflow
- Job sheets generated from approved estimates
- Invoices, invoice items, payments and invoice-from-job-sheet
- Workshop settings
- Website contact enquiries
- DVLA lookup audit history
- Central Joi validation and central API error handling

## Requirements

- Node.js 20 or newer
- MySQL 8 recommended
- A DVLA Vehicle Enquiry API key

## Setup

```bash
cp .env.example .env
npm install
npm run db:migrate
npm start
```

Create the first admin account once:

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Workshop Admin",
  "email": "admin@example.com",
  "password": "ChangeMe123",
  "role": "Admin"
}
```

After the first user exists, public registration is blocked unless `ALLOW_PUBLIC_REGISTRATION=true`.

## Important deployment settings

- Set a random `JWT_SECRET` of at least 32 characters.
- Put the DVLA key in `DVLA_API_KEY`; no API key is hard-coded in source.
- Set `CORS_ORIGIN` to comma-separated allowed frontend domains.
- Run migrations before restarting the API.
- The API intentionally does not use `sequelize.sync()` in production.

## Commands

```bash
npm run dev
npm run start
npm run check
npm run db:migrate
npm run db:migrate:status
npm run db:migrate:undo
```

## Response format

Successful responses use:

```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {}
}
```

Validation errors use:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "email", "message": "email must be a valid email", "type": "string.email" }
  ]
}
```

See `docs/API_REFERENCE.md`, `docs/FRONTEND_INTEGRATION.md` and `docs/IMPLEMENTATION_SUMMARY.md`.
