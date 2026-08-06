# Frontend integration changes

The backend is compatible with the current admin API paths, but three frontend areas still need to be connected to use all new backend features.

## 1. Vehicle lookup

Replace hard-coded localhost URLs with the shared Axios instance:

```js
await apiInstance.post("/dvla/search", { registrationNumber });
```

The public vehicle page may use:

```js
await fetch(`${API_BASE_URL}/api/save-vehicle`, { ... });
```

## 2. Contact form

Submit the public form to:

```http
POST /api/contact-enquiries
```

Payload:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.co.uk",
  "phone": "+44 7700 900123",
  "registration": "AB12 CDE",
  "service": "Interim or full service",
  "message": "Vehicle details and preferred booking date",
  "consent": true
}
```

## 3. Invoice page

The current invoice UI uses `localStorage`. Replace `invoiceStore.js` calls with:

- `GET /api/invoices`
- `POST /api/invoices`
- `PUT /api/invoices/:invoiceNumber`
- `POST /api/invoices/:invoiceNumber/payment`
- `DELETE /api/invoices/:invoiceNumber`

The backend accepts the invoice UI's existing field names, so the form payload does not need to be redesigned.

## 4. Dashboard

Replace sample dashboard numbers with:

```http
GET /api/dashboard
```

The response contains `metrics`, `jobStatusData`, `revenueData` and `activities`.
