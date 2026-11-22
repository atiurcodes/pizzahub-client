# PizzaHub — Client (Frontend)

> **PizzaHub** is a full-stack, role-based pizza ordering and delivery platform connecting neighborhood pizza artisans (Vendors), hungry customers (Customers), and platform moderators (Admins). Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Better Auth, and Stripe.

---

## 🔗 Project Links & Submission Details

- **Live Deployment:** [https://pizzahub-client.vercel.app](https://pizzahub-client.vercel.app) *(Update with your live URL)*
- **Client Repository:** [https://github.com/your-username/pizzahub-client](https://github.com/your-username/pizzahub-client)
- **Server Repository:** [https://github.com/your-username/pizzahub-server](https://github.com/your-username/pizzahub-server)

### Test Credentials & Guide

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@pizzahub.com` | *(Your seeded Admin password)* | Platform analytics, user block/unblock, menu approval/deletion, read-only Stripe transactions ledger |
| **Vendor** | *(Register or seeded)* | `Pizza@123` | Add menu items (ImgBB upload, Free: max 3, Premium: unlimited), accept/decline customer orders, Stripe upgrade |
| **Customer** | *(Register or seeded)* | `Pizza@123` | Browse menu, filter/sort, order pizzas with delivery date & address, cancel pending orders, live order timeline |

> **Stripe Test Card for Vendor Upgrades:** `4242 4242 4242 4242` (Exp: Any future date, CVC: `123`, ZIP: `90210`).

---

## 🍕 Key Features & Architecture

### 1. Public Experience
- **Interactive Landing Page (`/`):**
  - Warm wood-fired pizza aesthetic with high-resolution visual imagery.
  - **Dynamic Section 1 — Featured Menu Items:** Live items from MongoDB, prioritizing verified Premium vendors with "★ Premium" badges.
  - **Dynamic Section 2 — 6 Pizza Categories:** Interactive exploration across *Classic Pizzas*, *Vegetarian Pizzas*, *Meat Lovers*, *Specialty / Gourmet Pizzas*, *Sides & Appetizers*, and *Beverages & Desserts*.
  - **Extra Section 1 (Required):** *Why Choose PizzaHub?* (48-hr slow fermentation, verified kitchens, real-time tracking, hot delivery).
  - **Extra Section 2:** *How PizzaHub Works* (3-step ordering journey).
  - **Global Layout:** Responsive Navbar with profile dropdown, and global Footer with modern **X logo** (NOT the old bird) and contact details.
- **Browse Menu (`/menu`):**
  - Real-time search by item keywords.
  - Filter by Category and Location.
  - **Price Sorting:** Low-to-High and High-to-Low via backend API query params.

### 2. Customer Experience
- **Pizza Details & Ordering (`/menu/[id]`):** Multi-image gallery, pizzeria information, and clean customer delivery order form.
- **Customer Dashboard (`/dashboard/customer`):**
  - Live order KPI cards and order status breakdown charts.
  - **My Orders (`/dashboard/customer/orders`):** Filter by status (`Pending`, `Accepted`, `Rejected`, `Cancelled`), search by pizza/restaurant, and cancel own `pending` orders.
  - **Order Status Timeline:** Interactive visual timeline (`Pending → Accepted / Rejected / Cancelled`) showing real-time baking and delivery progress.
  - **Customer Profile Settings (`/dashboard/customer/profile`):** Update display name and avatar (with locked role and email).

### 3. Vendor Experience
- **Vendor Dashboard (`/dashboard/vendor`):** Real-time analytics, revenue, and order trends.
- **Add Menu Item (`/dashboard/vendor/add-item`):** File upload directly to ImgBB CDN, plan limit enforcement (**Free: max 3 active items**, **Premium: unlimited**).
- **My Menu Items (`/dashboard/vendor/menu-items`):** Complete CRUD management, availability toggles, and status badges.
- **Customer Orders (`/dashboard/vendor/orders`):** Review incoming delivery orders, accept or decline requests (strictly once per pending order).
- **Subscription Management (`/dashboard/vendor/subscription`):** Free vs. Premium comparison + live Stripe Checkout modal.
- **Vendor Profile Settings (`/dashboard/vendor/profile`):** Manage restaurant brand identity, business name, and contact details.

### 4. Admin Experience
- **Platform Analytics (`/dashboard/admin`):** Live counts of users, menu approvals, and transactions.
- **Manage Users (`/dashboard/admin/users`):** Search, role filtering, and instantaneous user block / unblock actions.
- **Moderate Menu Items (`/dashboard/admin/menu-items`):** Approve pending pizzas, reject, toggle availability, or delete items.
- **Transactions Ledger (`/dashboard/admin/transactions`):** Read-only financial ledger of verified Stripe subscription checkout sessions.
- **Admin Profile Settings (`/dashboard/admin/profile`):** Administrator profile display and system privileges contract.

---

## 🏆 Challenge Requirements Implementation

### 1. Search, Filter & Price Sorting API Query Parameters
The `/menu` browse page communicates with the Express backend via REST query parameters:

```http
GET /api/customer/menu?search=pepperoni&category=Classic%20Pizzas&location=Downtown&sort=price-asc
```

| Query Parameter | Allowed Values | Functionality |
| :--- | :--- | :--- |
| `search` | String (e.g. `margherita`) | Case-insensitive regex search across `itemName` and `description` |
| `category` | Any of the 6 exact categories | Matches exact pizza category |
| `location` | String (e.g. `Brooklyn`) | Case-insensitive substring match on pizzeria location |
| `sort` | `price-asc` \| `price-desc` \| `name-asc` \| `newest` | Sorts items by price ascending or descending; newest by default |
| `sortBy` + `sortOrder` | `sortBy=price&sortOrder=asc` | Alternative challenge query syntax supported by the backend |

### 2. Express JWT + Middleware Security Flow
1. **Token Retrieval:** When authenticated via Better Auth (Email/Password or Google OAuth), a signed HS256 JWT is read from the session cookie via `/api/auth/jwt`.
2. **Authorization Header:** Client API requests attach the token via standard `Authorization: Bearer <token>`.
3. **Backend Middleware (`verifyJWT`):**
   - Extracts and verifies the signature using `BETTER_AUTH_SECRET`.
   - Checks expiration time (`exp`). Returns `401 Unauthorized` if invalid or expired.
   - Derives verified user identity (`id`, `email`, `role`, `isBlocked`, `subscriptionPlan`) directly from the token and database.
4. **Role Middleware (`verifyRole`):**
   - Enforces role-based permissions (`verifyAdmin`, `verifyVendor`, `verifyCustomer`). Returns `403 Forbidden` if unauthorized.
   - Rejects blocked users (`isBlocked: true`).
5. **Database-Level Hardening:** User updates on the profile routes strip `role`, `isBlocked`, `subscriptionPlan`, and `subscriptionExpiresAt` to prevent client tampering.

---

## 🌟 Optional Features Implemented (2 of 5)

1. **Dark / Light Mode Toggle:**
   - Powered by `next-themes` and Tailwind CSS v4 variables.
   - Persists theme selection in `localStorage`.
   - Accessible toggle placed in both the public Navbar and the Dashboard layout.
2. **Order Status Timeline:**
   - Visual multi-step timeline located on the Order Details modal (`/dashboard/customer/orders`).
   - Reflects the live lifecycle of an order: `Pending Review → Accepted & Baking → Out for Delivery` or `Cancelled / Rejected`.

---

## 💻 Tech Stack

- **Framework:** Next.js 16.4.5 (App Router), React 19.3.1, TypeScript 5
- **Styling:** Tailwind CSS v4, Lucide React Icons
- **UI Components:** ShadCN UI (`base-nova` style on `@base-ui/react`), Framer Motion / Motion
- **Authentication:** Better Auth (Email/Password + Google OAuth)
- **Image Hosting:** ImgBB API
- **Payments:** Stripe Checkout & Webhook verification
- **Notifications:** Toast notifications (`sonner` / `@base-ui/react toast`)

---

## ⚙️ Environment Variables (`.env`)

Create a `.env` (or `.env.local`) file in `pizzahub-client`:

```env
# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

# Better Auth Configuration
BETTER_AUTH_SECRET=your_super_secret_jwt_key
BETTER_AUTH_URL=http://localhost:3000

# MongoDB Connection (for Better Auth adapter)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/pizzahubdb?retryWrites=true&w=majority

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe Configuration (Vendor Upgrades)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# ImgBB API Key (Vendor Pizza Image Uploads)
NEXT_PUBLIC_IMGBB_API_KEY=your_32_character_imgbb_api_key
```

---

## 🚀 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Check types and linting
npm run typecheck
npm run lint

# 4. Production build check
npm run build
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
Ensure your companion `pizzahub-server` is running on port `5000`.
