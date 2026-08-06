# Backend implementation summary

## UI-to-API coverage

- Existing customer, vehicle, estimate, job sheet and settings endpoints retained.
- Existing frontend compatibility paths retained for dashboard, customer vehicles, estimate status, job-sheet status and priority.
- Invoice localStorage flow replaced at backend level with invoice, invoice-item and payment APIs.
- Public website contact form API added.
- Public and authenticated DVLA lookup APIs added with lookup audit history.
- Dynamic dashboard endpoint added for live records and payment-based revenue.
- Admin team-user management API added.

## Database changes

New tables:

- `invoices`
- `invoice_items`
- `invoice_payments`
- `contact_enquiries`
- `vehicle_lookups`

Core schema hardening includes:

- Per-line VAT for estimates and job sheets
- Decimal quantities for labour hours such as `1.5`
- Estimate approval date and credit terms
- Active-user and last-login fields
- Correct date-only columns
- Missing indexes and unique constraints
- Wider money columns and consistent table naming
- Legacy-data backfills before non-null constraints

## Product safeguards

- Central Joi validation on body, params and query strings
- Central error mapping for Joi, Sequelize, malformed JSON and unknown routes
- Database transactions for estimates, job sheets, invoices and payments
- Customer/vehicle/estimate/job-sheet relationship checks
- Duplicate job-sheet and invoice prevention
- Overpayment prevention and immutable payment audit history
- Last-admin, self-delete and self-deactivation protection
- Public-registration role escalation prevention
- CORS allow-list, request IDs, security headers and rate limiting
- Environment validation; no committed `.env` or hard-coded DVLA key
