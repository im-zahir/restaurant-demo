# Restaurant Website System — Refined Master Plan

Build a conversion-focused, WhatsApp-native restaurant website system with a premium "wow-factor" design, featuring dynamic menus, table bookings, and a Supabase-integrated admin dashboard.

![Mockup Concept](C:\Users\LAPTOP UNIVERSE\.gemini\antigravity\brain\65b2c32b-cc96-4b68-ac96-2d9cc0b96835\restaurant_website_mockup_1774865524297.png)

## User Review Required

> [!IMPORTANT]
> This project uses **Supabase** for the database, storage, and authentication. You will need to provide a Supabase URL and Anon Key later for the dynamic features to work.
> [!NOTE]
> The initial build will focus on the **MVP Template** (UI/UX, Static Menu, WhatsApp Cart) first, then integrate Supabase for dynamic management.

## Proposed Changes

### Core Foundation (Next.js & Tailwind)

- Initialize the Next.js project using standard defaults for scalability.
- Establish a **design system** in `globals.css` with a focus on dark mode, luxury gold/black or vibrant culinary color palettes, and glassmorphism.

### Component Architecture

#### 1. Landing & Navigation
- **[NEW] `Navbar.tsx`**: A sticky, glassmorphic navigation bar.
- **[NEW] `Hero.tsx`**: High-impact section with premium food imagery and primary CTAs.

#### 2. Menu & Ordering System
- **[NEW] `MenuGrid.tsx`**: Dynamic grid with category filtering and search.
- **[NEW] `MenuCard.tsx`**: Individual item cards with "Add to Cart" functionality and visual tags (Best Seller, Spicy).
- **[NEW] `CartSheet.tsx`**: A floating cart that calculates totals in BDT and generates the pre-filled WhatsApp message.

#### 3. Table Booking
- **[NEW] `BookingForm.tsx`**: A professional form for table reservations, designed for high conversion.

### Backend & Data (Supabase)

- **[NEW] `lib/supabase.ts`**: Supabase client initialization using the provided credentials.
- **[NEW] `lib/database.types.ts`**: TypeScript definitions for the Supabase tables based on your schema.
- **[MODIFY] `components/MenuGrid.tsx`**: Update to fetch data from Supabase `menu_items`.
- **[MODIFY] `components/BookingForm.tsx`**: Implement submission logic to save reservations to Supabase `bookings`.

---

## Technical Details

- **Supabase URL**: `https://jquresfrwiqjmdfrpsnm.supabase.co`
- **Tables**:
    - `menu_items`: Dynamic menu data.
    - `categories`: Category management.
    - `bookings`: Reservation records.

---

### Admin Dashboard (Phase 3)

- **[NEW] `src/app/admin/layout.tsx`**: Shared sidebar and navigation for the admin area.
- **[NEW] `src/app/admin/page.tsx`**: Dashboard overview with real-time stats.
- **[NEW] `src/app/admin/menu/page.tsx`**: Full CRUD interface for menu items (Add, Edit, Delete).
- **[NEW] `src/app/admin/bookings/page.tsx`**: Reservation manager with status toggles (Confirm/Cancel).

### Logic & Features

- **Auth Strategy**: For the showcase, a simple **Password Protection** layer (`admin123`) using a client-side route guard.
- **Real-time Updates**: Reflect database changes instantly on the frontend.

---

## Technical Details

- **Admin Password**: `admin123` (Configurable in .env).
- **CRUD Operations**: Directly interacting with Supabase tables.

---

## Open Questions

- **Image Uploads**: Should I implement a direct image upload to Supabase Storage, or let you paste image URLs for now?
- **Notifications**: Would you like a simple browser notification or an indicator when a new booking arrives?

## Verification Plan

### Automated Tests
- Verification of the Admin Login flow.
- CRUD operation checks for Menu Items.

### Manual Verification
- Verifying that Status updates in Admin reflect in the database.
- Testing the UI responsiveness of the Admin Panel on tablets.
