<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PizzaHub — Agent Guidelines & Project Specification

> **Purpose:** Single source of truth for AI agents working on **PizzaHub — Pizza Ordering & Delivery Platform**. Follow every architectural, security, UI/UX, and business rule below strictly. Do not deviate from the database schema, role permissions, or payment rules.

---

## 1. Project Overview

**PizzaHub** is a full-stack, role-based pizza ordering and delivery platform connecting local pizza shops (Vendors), hungry customers (Customers), and platform moderators (Admins).

- **Originality Requirement:** Must be an original, recruiter-grade, functional web application — never clone or resemble course modules, conceptual sessions, or template assignments.
- **Repository Split:** Maintained as **two separate GitHub repositories**:
  - **Client (`pizzahub-client`)** — Next.js App Router frontend (this workspace).
  - **Server (`pizzahub-server`)** — Express.js + MongoDB REST API & Stripe webhook backend.

---

## 2. Tech Stack & Workspace Conventions

### Client (`pizzahub-client` — Current Workspace)
- **Framework:** Next.js `16.4.5` (App Router), React `19.3.1`, TypeScript `5`
- **Styling & UI:** Tailwind CSS `v4`, ShadCN UI (`style: "base-nova"`, built on `@base-ui/react`, NOT Radix UI — check component props like `render` instead of `asChild`), `lucide-react`, `next-themes`
- **Animations:** Framer Motion / `motion` (smooth, subtle animations on homepage sections only; no visual clutter)
- **Notifications:** Toast notifications (e.g., `sonner`) — **NEVER use browser `alert()`, `confirm()`, or `prompt()`**
- **Auth Client:** Better Auth client (Email/Password + Google OAuth)
- **Image Uploads:** ImgBB API (**required** as file upload for Vendor Menu Item images; optional for profile avatars)
- **Charts:** Data visualization library (e.g., Recharts / ShadCN Charts) for dashboard statistics
- **Path Aliases:** `@/components`, `@/components/ui`, `@/lib`, `@/hooks`
- **Scripts:**
  - `npm run dev` — Start local dev server
  - `npm run build` — Production build check
  - `npm run lint` — ESLint check
  - `npm run typecheck` — `tsc --noEmit`
  - `npm run format` — Prettier formatting

### Server (`pizzahub-server` — Companion Repo)
- **Runtime & Framework:** Express.js (TypeScript or JavaScript)
- **Database:** MongoDB (official driver or Mongoose) with Better Auth MongoDB adapter
- **Auth & Security:** Better Auth + JWT token verification middleware + role-based authorization middleware + Google OAuth
- **Payments:** Stripe Checkout + verified Stripe Webhooks (**Vendor subscriptions ONLY**)

---

## 3. Roles & Permissions Matrix

| Role | Capabilities | Restrictions |
| :--- | :--- | :--- |
| **Customer** | Browse/search/filter/sort menu; view item details; submit orders with delivery date, address & note; track order status; cancel own `pending` orders; update profile | Cannot access Vendor/Admin dashboards; cannot cancel non-pending or others' orders; cannot change own role |
| **Vendor (Restaurant)** | Manage restaurant profile (`businessName`, etc.); add/edit/delete/toggle own menu items (Free: max 3 active, Premium: unlimited); accept/reject own incoming `pending` orders (once); upgrade to Premium via Stripe | Cannot order their own menu items; cannot access Customer/Admin dashboards; cannot modify other vendors' items/orders; cannot self-approve items or self-activate Premium |
| **Admin** | View platform analytics; view/search/filter all users; block/unblock users; review/approve/reject/toggle/delete any menu item; view all subscription transactions (read-only) | Cannot register via public Sign Up (must be assigned/seeded securely); cannot place customer orders; **cannot edit payment/transaction records** |

### Strict Security Rules (Non-Negotiable)
1. **Server-Side Enforcement Everywhere:** Hiding UI links is never enough. Every private API route MUST verify JWT/session (`401 Unauthorized` if missing/invalid/expired) and role/ownership (`403 Forbidden` if unauthorized).
2. **Never Trust Client Identity:** Never trust `userId`, `role`, `isBlocked`, or `subscriptionPlan` passed in request bodies/params. Always derive from verified token/session + database lookup.
3. **Blocked User Enforcement:** Users with `isBlocked: true` MUST be blocked from accessing protected platform APIs and dashboard features.
4. **Cross-Role URL Isolation:** Manually navigating to another role's dashboard route MUST redirect or deny access cleanly.
5. **Profile Update Hardening:** Users updating their profile MUST NOT be able to mutate `role`, `isBlocked`, `subscriptionPlan`, or `subscriptionExpiresAt`.
6. **Reload Persistence:** Reloading any route in production MUST NOT throw 404/runtime errors, and reloading a private route while logged in MUST NOT wrongly redirect the user to Sign In.

---

## 4. Database Schema (MongoDB)

Better Auth manages its own auth collections. Use **strictly these 4 business collections** with proper references (do not create unnecessary collections unless justified by a chosen optional feature):

### 1. `users` (Managed/Extended via Better Auth)
- `name`: string
- `email`: string (unique)
- `image`: string (optional)
- `role`: `"vendor" | "customer" | "admin"`
- `isBlocked`: boolean (default: `false`)
- `businessName`: string (vendor only)
- `subscriptionPlan`: `"free" | "premium"` (default: `"free"`)
- `subscriptionExpiresAt`: Date | null

### 2. `menuItems`
- `vendorId`: ObjectId / string (ref: `users`)
- `itemName`: string
- `category`: `"Classic Pizzas" | "Vegetarian Pizzas" | "Meat Lovers" | "Specialty / Gourmet Pizzas" | "Sides & Appetizers" | "Beverages & Desserts"`
- `description`: string
- `price`: number
- `location`: string (restaurant area / city)
- `images`: string[] (ImgBB URLs; at least 1 required; multiple supported on details page)
- `status`: `"pending" | "approved" | "rejected" | "inactive"` (default: `"pending"`)
- `createdAt`: Date

### 3. `orders`
- `itemId`: ObjectId / string (ref: `menuItems`)
- `vendorId`: ObjectId / string (ref: `users`)
- `customerId`: ObjectId / string (ref: `users`)
- `deliveryDate`: Date / ISO string
- `deliveryAddress`: string
- `message`: string (optional special instructions)
- `status`: `"pending" | "accepted" | "rejected" | "cancelled"` (default: `"pending"`)
- `createdAt`: Date

### 4. `transactions`
- `vendorId`: ObjectId / string (ref: `users`)
- `plan`: `"premium"`
- `amount`: number
- `currency`: string
- `stripeSessionId`: string
- `stripeSubscriptionId`: string
- `status`: string (e.g., `"paid"`, `"failed"`, `"cancelled"`)
- `createdAt`: Date

---

## 5. Authentication Flow (Better Auth + JWT)

- **Sign Up (`/sign-up` or `/register`):**
  - Fields: Full Name, Email, Password, Profile Image (optional/skippable), Account Role (`Vendor` or `Customer` ONLY).
  - Password validation: Minimum **6 characters**, at least **1 uppercase** letter, at least **1 lowercase** letter.
  - Supports Email/Password registration + Google OAuth.
  - Admin accounts CANNOT be created through public registration.
  - Shows toast feedback and redirects to the role-appropriate destination.
- **Sign In (`/sign-in` or `/login`):**
  - Fields: Email, Password + Google OAuth button.
  - Shows toast feedback and redirects users based on their role.
- **JWT Verification (Challenge Requirement):**
  - Issue/obtain a JWT for authenticated users and attach/store it securely.
  - Express backend middleware MUST validate JWT signature & expiration on every protected route, rejecting invalid/expired tokens with `401`.
  - Document the full JWT + middleware flow in `README.md`.

---

## 6. Pages, Layout & Feature Specifications

### Global Layout
- **Navbar:**
  - Logo/brand: `PizzaHub` (consistent style/size across pages).
  - Logged out: `Home`, `Browse Menu`, `Sign In`, `Sign Up`.
  - Logged in: `Home`, `Browse Menu`, role-relevant links, and **Profile Dropdown** (user name, avatar, Dashboard, Profile Settings, Logout).
  - Must reactively update immediately upon login/logout/profile update.
- **Footer:**
  - PizzaHub logo & short description, important navigation links, contact info, social media links (**use the new X logo, NOT the old Twitter bird**), copyright notice.

### Public Pages
1. **Home (`/`):**
   - **Hero / Banner:** Clear headline (e.g., *"Hot & Fresh Pizza Delivered to Your Door"*), short description, primary CTA (`Explore Pizza Menu`), warm pizza-themed hero visual.
   - **Dynamic Section 1 — Featured Menu Items:** Minimum **6 items** from DB, strictly `approved` & active (prioritize `premium` vendors for featured placement + show "Premium" badge). Equal-height/width cards showing: image, name, category, price, location, vendor info, `View Details` button.
   - **Dynamic Section 2 — Pizza Categories:** Interactive exploration across the 6 exact categories:
     1. `Classic Pizzas`
     2. `Vegetarian Pizzas`
     3. `Meat Lovers`
     4. `Specialty / Gourmet Pizzas`
     5. `Sides & Appetizers`
     6. `Beverages & Desserts`
   - **Extra Section 1 (Required):** *Why Choose PizzaHub?*
   - **Extra Section 2 (Pick 1):** *How PizzaHub Works*, *Popular Pizza Combos*, *Customer Testimonials*, or *Pizza Lovers' Tips*.
   - **Animations:** Subtle, smooth Framer Motion / Motion transitions on suitable sections.
2. **Browse Menu (`/menu`):**
   - Publicly accessible without login.
   - Displays **only** `approved` and active items in a responsive, uniform card grid.
   - **Search, Filter & Sort (Challenge Requirement):**
     - Advanced search by item name / keywords
     - Filter by `category` and `location`
     - **Sort by `price` ascending and descending** (via backend API query parameters; document query params in `README.md`)
   - Meaningful loading skeleton/loader and clear empty state.
   - Clicking `View Details` or trying to order while logged out redirects to Sign In.
3. **Sign In & Sign Up Pages.**

### Private Pages
1. **Item Details (`/menu/[id]`):**
   - Redirect to Sign In if unauthenticated.
   - Displays: item name, multiple images gallery, category, description, price, location, vendor info (with Premium badge if applicable), and Order form/option.
   - Gracefully handles invalid/non-existent item IDs.
   - Only `approved` & active items can be ordered.
   - Vendors cannot order their own items; Admins cannot place orders.
2. **Order Management Flow (Customer Ordering):**
   - **IMPORTANT:** Customer pizza orders do **NOT** use Stripe. Show an order submission form/button only.
   - Form fields: `Delivery Date`, `Delivery Address`, `Additional Message / Special Instructions`.
   - Auto-bound server-side: `customerId`, `vendorId`, `itemId`, default `status: "pending"`.
   - Business rules:
     - Prevent vendors from ordering their own item.
     - Prevent duplicate active orders for the same `itemId` + `deliveryDate` by the same customer.
     - Clear toast success/error feedback.
3. **Payment Result Pages:**
   - `/payment/success` — Confirms Vendor Premium checkout completion (reflects server/webhook state, never trusts client query param alone to upgrade).
   - `/payment/cancel` — Graceful cancellation message with link back to Vendor Subscription page.
4. **Profile Settings:**
   - Editable: `name`, `image` (optional), and `businessName` (for vendors).
   - Blocked from editing: `role`, `subscriptionPlan`, `isBlocked`.

### Role-Based Dashboards
Use a dedicated, full-width responsive **Dashboard Layout** (collapsible mobile/tablet sidebar + main content area, role-specific navigation, KPI stat cards, charts/graphs, and user profile block).

- **Vendor Dashboard (`/dashboard/vendor/...`):**
  - **Overview:** Total menu items, active menu items, pending customer orders, accepted orders, current subscription plan + visual charts.
  - **Add Menu Item:** Name, Category, Description, Price, Location, Item Image (**required file upload via ImgBB**). Saves with `status: "pending"`. Enforces plan limit: **Free = max 3 active items**, **Premium = unlimited** (prompt upgrade if limit reached).
  - **My Menu Items:** Own items only with status badges (`pending`, `approved`, `rejected`, `inactive`); view, edit, delete, toggle availability. Rejected items must never appear publicly.
  - **Customer Orders:** Lists customer info, item info, delivery date, delivery address, message, status. Actions: `Accept` / `Reject` (only for `pending` orders, only once, only for vendor's own orders).
  - **Subscription:** Free vs. Premium comparison + `Upgrade to Premium` CTA launching Stripe Checkout.
  - **Profile Settings.**

- **Customer Dashboard (`/dashboard/customer/...`):**
  - **Overview:** Total, pending, accepted, and rejected orders + visual charts.
  - **My Orders:** Item name & image, vendor info, delivery date, delivery address, status, request date. View order details & cancel own `pending` orders only.
  - **Profile Settings.**

- **Admin Dashboard (`/dashboard/admin/...`):**
  - **Overview:** Total users, total vendors, total customers, total menu items, pending menu items, total transactions + visual charts.
  - **Manage Users:** View all users & details, search by name/email, filter by role, Block / Unblock users.
  - **Manage Menu Items:** View, search, filter all items; approve/reject pending items; toggle/change published item statuses; delete inappropriate items.
  - **Transactions:** Vendor info, subscription plan, amount, status, transaction date. **Strictly read-only** (Admin cannot edit payment statuses/records).

---

## 7. Vendor Subscription Payment (Stripe Checkout + Webhooks)

Stripe is used **exclusively for Vendor Free → Premium upgrades**.

- **Free Plan:** Max 3 active menu items, basic vendor dashboard, order management.
- **Premium Plan:** Unlimited active menu items, "Premium" vendor badge, featured homepage placement, all Free features.
- **Payment Flow & Security Rules:**
  1. Authenticated Vendor clicks `Upgrade to Premium` → Client calls backend endpoint.
  2. Backend verifies Vendor JWT/role (prevents creating sessions for another vendor) and creates a Stripe Checkout Session with metadata (`vendorId`, `plan`).
  3. Vendor completes or cancels checkout on Stripe hosted page → redirected to `/payment/success` or `/payment/cancel`.
  4. **Webhook Activation Only:** NEVER upgrade `subscriptionPlan` from the frontend success route. Only activate `premium`, set `subscriptionExpiresAt`, and write to `transactions` after verifying the Stripe webhook signature (`stripe.webhooks.constructEvent`) on the server.
  5. Handle subscription cancellation and expiration properly (revert/enforce limits when expired).
  6. Keep Stripe secret key and webhook signing secret strictly in server `.env`.

---

## 8. UI/UX & Design Standards

- **Visual Theme:** Warm, appetizing pizza aesthetic — warm reds, rich oranges, and cream backgrounds (with clean typography and high contrast suitable for recruiters).
- **Consistency:**
  - Identical main heading hierarchy (font, size, weight, color) across all sections.
  - Consistent button variants/styles matching the homepage.
  - Uniform image aspect ratios (`aspect-[4/3]` or `aspect-square`) and equal card heights/widths across all menu grids.
  - Balanced spacing, clean alignment, no crowded layouts.
- **Responsiveness:** Mobile-first, fully responsive across mobile, tablet, and desktop (including dashboard sidebars, tables, and charts).
- **Loading & Error States:**
  - Meaningful loaders/skeletons for menu fetches, dashboard analytics, form submissions, order placements, ImgBB uploads, and Stripe redirects.
  - Custom `not-found.tsx` (404 page) + clean error boundaries (`error.tsx`).
  - Graceful handling of API failures, invalid forms, 401/403 responses, missing DB records, and failed image uploads.

---

## 9. Optional Features (Implement at Least 2 of 5)

Pick and implement **at least 2** of the following cleanly:
1. **Dark / Light Mode Toggle** *(recommended — `next-themes` is already installed in `package.json`)*
2. **Order Status Timeline** on the order details page (`Pending → Accepted / Rejected / Cancelled`)
3. **Favorites / Wishlist** for customers
4. **Reviews & Ratings** for menu items and restaurants
5. **Email Notifications** when an order is accepted or rejected

---

## 10. Environment Variables, Git & Deployment Checklist

### Secrets & Environment Variables
- **NEVER commit `.env`, `.env.local`, or secret keys to GitHub.**
- Keep Better Auth secrets, MongoDB URI, Google OAuth credentials, Stripe keys/webhook secret, and ImgBB API key in environment variables.
- Document all required environment variable **names** (never values) in `README.md`.

### Git Hygiene
- **Client Repo:** At least **20 meaningful, atomic commits** with descriptive messages.
- **Server Repo:** At least **12 meaningful, atomic commits** with descriptive messages.
- No filler/meaningless commits.

### Production & Submission Verification
- Zero CORS, 404, or 504 errors on production.
- Zero landing-page console/runtime errors.
- Reloading any public or private route works seamlessly without losing auth state or throwing errors.
- Stripe Checkout + live Webhook verified end-to-end in production.
- Working Admin credentials seeded and tested on the live deployment.
- Complete `README.md` covering: project overview, features, tech stack (npm packages), setup & local run instructions, live link, client/server repo links, env variable names, **and Challenge implementation details (search/sort API query params + Express JWT middleware flow)**.
- Prepare final submission details: Admin Email, Admin Password, Live Site Link, Server Repo, Client Repo, and test instructions (e.g., Stripe test card `4242...`).
