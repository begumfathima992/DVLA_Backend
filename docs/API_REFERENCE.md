# API reference

Base path: `/api`

All protected routes require:

```http
Authorization: Bearer <token>
```

## Public routes

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Database and DVLA configuration health |
| POST | `/api/auth/register` | Create the first admin, or register a Technician when public registration is enabled |
| POST | `/api/auth/login` | Login |
| POST | `/api/dvla/search` | UK DVLA vehicle lookup |
| POST | `/api/save-vehicle` | Legacy public DVLA lookup alias used by the UI |
| POST | `/api/contact-enquiries` | Submit the website contact form |
| POST | `/api/contact` | Contact-form compatibility alias |

Authentication and public lookup routes are rate-limited.

## Authentication

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/auth/me` | Authenticated |
| POST | `/api/auth/logout` | Authenticated |

## Dashboard

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/dashboard` | Authenticated |
| GET | `/api/Dashboard` | Authenticated compatibility alias |

The dashboard returns customer, vehicle, estimate, job, invoice, outstanding balance, contact enquiry and payment-based revenue metrics.

## Team users

All user-management endpoints require the `Admin` role.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users?search=&role=&isActive=&page=1&limit=50` | List staff accounts |
| POST | `/api/users` | Create Admin, Manager or Technician |
| PATCH | `/api/users/:id` | Update profile, role or active state |
| PATCH | `/api/users/:id/password` | Reset password and revoke the current session |
| DELETE | `/api/users/:id` | Delete a staff account |

The API prevents self-deactivation, self-deletion and removal of the final active admin.

## Customers

| Method | Endpoint |
|---|---|
| GET | `/api/customer?search=&page=1&limit=50` |
| POST | `/api/customer` |
| GET | `/api/customer/:id` |
| PUT/PATCH | `/api/customer/:id` |
| DELETE | `/api/customer/:id` |

## Vehicles

| Method | Endpoint |
|---|---|
| GET | `/api/vehicle?search=&customerId=&page=1&limit=50` |
| POST | `/api/vehicle` |
| GET | `/api/vehicle/customer/:customerId` |
| GET | `/api/vehicle/:id` |
| PUT/PATCH | `/api/vehicle/:id` |
| DELETE | `/api/vehicle/:id` |

The existing frontend request `/api/vehicle/:customerId?id=:customerId` remains supported as a compatibility alias.

## DVLA lookup history

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/dvla/history?search=&status=&page=1&limit=50` | Authenticated |

Every lookup stores the registration, result status, upstream response/error, request IP and user agent for audit purposes.

## Estimates

| Method | Endpoint |
|---|---|
| GET | `/api/estimate?status=&customerId=&vehicleId=&search=&page=1&limit=50` |
| POST | `/api/estimate` |
| GET | `/api/estimate/:id` |
| PUT/PATCH | `/api/estimate/:id` |
| DELETE | `/api/estimate/:id` |
| POST | `/api/estimate/status/:id` |
| PATCH | `/api/estimate/:id/status` |

Approving an estimate creates one idempotent job sheet with copied line items. Commercial fields are locked after approval.

## Job sheets

| Method | Endpoint |
|---|---|
| GET | `/api/jobSheets?status=&priority=&customerId=&vehicleId=&search=&page=1&limit=50` |
| POST | `/api/jobSheets` |
| GET | `/api/jobSheets/:id` |
| PUT/PATCH | `/api/jobSheets/:id` |
| POST | `/api/jobSheets/priority/:id` |
| POST | `/api/jobSheets/status/:id` |
| PATCH | `/api/jobSheets/:id/priority` |
| PATCH | `/api/jobSheets/:id/status` |

## Invoices

Both `/api/invoices` and `/api/invoice` are supported.

| Method | Endpoint |
|---|---|
| GET | `/api/invoices?status=&customerId=&vehicleId=&search=&page=1&limit=50` |
| POST | `/api/invoices` |
| GET | `/api/invoices/:id-or-invoiceNumber` |
| PUT/PATCH | `/api/invoices/:id-or-invoiceNumber` |
| DELETE | `/api/invoices/:id-or-invoiceNumber` |
| PATCH | `/api/invoices/:id-or-invoiceNumber/status` |
| POST | `/api/invoices/:id-or-invoiceNumber/payment` |
| POST | `/api/invoices/from-job-sheet/:jobSheetId` |

Invoice create/update accepts canonical API keys and the current frontend aliases:

- `customerName` or `customer`
- `vehicleRegistration` or `vehicle`
- `vehicleDescription` or `make`
- `invoiceDate` or `date`
- `dueDate` or `due`
- `paidAmount` or `paid`
- `vatPercentage` or `vatRate`
- line item `description/itemType/quantity/unitPrice` or `desc/type/qty/rate`

Responses also expose the frontend aliases `id`, `customer`, `vehicle`, `make`, `date`, `due`, `paid`, `vatRate`, `vatAmt`, `payDate` and `payMethod`.

Each payment is written to `invoice_payments`; the invoice response includes the complete `payments` audit history and the staff member who recorded each payment.

## Settings

Settings require `Admin` or `Manager` role.

| Method | Endpoint |
|---|---|
| GET | `/api/settings` |
| POST/PUT | `/api/settings` |

## Contact enquiries

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/contact-enquiries` | Public |
| GET | `/api/contact-enquiries?search=&status=&page=1&limit=50` | Admin/Manager |
| GET | `/api/contact-enquiries/:id` | Admin/Manager |
| PATCH | `/api/contact-enquiries/:id` | Admin/Manager |
| DELETE | `/api/contact-enquiries/:id` | Admin/Manager |

## Validation errors

Every route uses Joi before the controller. Unknown fields are removed and all validation failures are returned together:

```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "email must be a valid email",
      "type": "string.email"
    }
  ]
}
```
