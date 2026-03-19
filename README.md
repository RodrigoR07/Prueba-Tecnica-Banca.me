# Empresa X — Credit Management MVP

A web application for managing credit requests, built with React + Vite + Material UI.

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation
```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

### Running the app
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

---

## Mock Services

Since this is an MVP, no real backend exists. All services return simulated responses and persist data using the browser's `localStorage`.

### `authService` — Authentication
Simulates user login and registration. Contains two hardcoded users:
- `ana@empresax.com` (collaborator)
- `carlos@empresax.com` (admin)

Any password is accepted. A fake JWT token is generated and stored in `localStorage` on login.

---

### `leadService` — Lead Management
Simulates a database of credit applicants. Preloaded with 4 sample leads covering all possible statuses (`pending`, `in_review`, `approved`, `rejected`).

Supports full CRUD-like operations: listing, fetching by ID, creating new leads, and updating status. All changes persist in `localStorage`.

---

### `identityService` — Identity Verification
Simulates two external government API calls:

**RUT pre-qualification** — checks whether the applicant is eligible for a credit based on their national ID (RUT). Only the following RUTs qualify in the mock:
```
12345678-9 · 98765432-1 · 11111111-1 · 22222222-2 · 33333333-3 · 15000000-0
```

**ClaveÚnica verification** — simulates authentication against Chile's government identity provider (used by SII, AFC, and SUSESO). Each qualifying RUT has a fixed password in the mock:
```
12345678-9 → 1234
11111111-1 → 0000
15000000-0 → 9999
```

Both calls include an artificial delay (1.8s – 2s) to simulate real network latency.

---

### `evaluationService` — Credit Evaluation History
Simulates saving and retrieving credit evaluation records per lead. Stores the full evaluation result, the collaborator's decision, and a timestamp. All data persists in `localStorage`.

---

### `contractService` — Contract Generation
Simulates generating a digital contract for an approved lead. Returns a contract object with:
- A unique contract ID
- Monthly payment estimate (based on 24-month term at 1.8% monthly interest)
- Total cost
- CAE (Costo Anual Equivalente)
- 5 standard clauses
- A signature token for the client

No PDF is actually generated. In production, this would connect to a document generation service such as DocuSign or a custom PDF generator.

---

### `emailService` — Email Notifications
Simulates sending transactional emails to applicants. Three email types are supported:

| Method | Trigger | Description |
|---|---|---|
| `sendConfirmationEmail` | After form submission | Confirms the request was received |
| `sendContractEmail` | After collaborator approves | Sends the digital contract for signature |
| `sendRejectionEmail` | After collaborator rejects | Notifies the applicant of the rejection |

No real emails are sent. All calls log to the browser console and return a mock success response. In production, this would connect to a provider such as SendGrid or AWS SES.

---

## Credit Scoring Engine

The `creditEngine.js` utility is not a mock — it contains real business logic that runs entirely on the frontend.

It evaluates four rules and produces a score from 0 to 100:

| Rule | Condition | Outcome if failed |
|---|---|---|
| Minimum income | `income >= amount / 2` | Rejection |
| DTI ratio | `debts / income <= 0.40` | Rejection |
| Expense ratio | `expenses / income <= 0.70` | Rejection |
| Net income | `income - expenses - debts >= amount / 24` | Rejection |

Score labels:

| Score | Label |
|---|---|
| 80 – 100 | Excellent |
| 60 – 79 | Good |
| 40 – 59 | Fair |
| 0 – 39 | High risk |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| UI Library | Material UI v5 |
| Routing | React Router v6 |
| Forms | React Hook Form |
| Fonts | DM Sans (via @fontsource) |
| State | React Context API |
| Persistence | localStorage (mock only) |