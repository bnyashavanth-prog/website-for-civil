-- Initial Schema for SS Build Private Limited Platform

-- 1. Tenants Table
CREATE TABLE public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
    owner_admin_id UUID, -- References auth.users later
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Profiles
-- Extends auth.users to store role and tenant linkage
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY, -- References auth.users(id)
    tenant_id UUID REFERENCES public.tenants(id),
    role TEXT NOT NULL CHECK (role IN ('customer', 'driver', 'accounts', 'operations', 'super_admin', 'developer')),
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Helper Functions
CREATE OR REPLACE FUNCTION auth.current_tenant_id() RETURNS UUID AS $$
  SELECT tenant_id FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION auth.current_user_role() RETURNS TEXT AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Categories (Materials)
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Subcategories
CREATE TABLE public.subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    name TEXT NOT NULL,
    unit TEXT NOT NULL, -- e.g. 'ton', 'cft'
    price_per_unit NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Trucks
CREATE TABLE public.trucks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    registration_number TEXT NOT NULL,
    capacity_type TEXT NOT NULL, -- e.g. '10_wheel', '14_wheel'
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_transit', 'maintenance', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Drivers
CREATE TABLE public.drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    user_id UUID REFERENCES public.user_profiles(id),
    license_number TEXT NOT NULL,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'on_trip', 'off_duty')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bookings
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    customer_id UUID NOT NULL REFERENCES public.user_profiles(id),
    booking_type TEXT NOT NULL CHECK (booking_type IN ('material', 'truck_only')),
    subcategory_id UUID REFERENCES public.subcategories(id),
    quantity NUMERIC(10, 2),
    delivery_location TEXT NOT NULL,
    delivery_date TIMESTAMPTZ NOT NULL,
    estimated_price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'delivered', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Trips / Deliveries
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    booking_id UUID NOT NULL REFERENCES public.bookings(id),
    truck_id UUID REFERENCES public.trucks(id),
    driver_id UUID REFERENCES public.drivers(id),
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'en_route', 'arrived', 'completed', 'failed')),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. GPS Location
CREATE TABLE public.gps_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    trip_id UUID NOT NULL REFERENCES public.trips(id),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    speed NUMERIC(5, 2),
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Site Media (Admin uploaded images)
CREATE TABLE public.site_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    slot_key TEXT NOT NULL, -- e.g. 'hero_1', 'gallery_3'
    category_id UUID REFERENCES public.categories(id),
    image_url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES public.user_profiles(id),
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Error Logs (for Developer Console)
CREATE TABLE public.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id),
    source TEXT NOT NULL, -- 'frontend', 'backend', 'api'
    severity TEXT NOT NULL, -- 'info', 'warning', 'error', 'critical'
    message TEXT NOT NULL,
    stack_trace TEXT,
    context JSONB,
    resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-----------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) SETUP
-----------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gps_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- 1. Tenants Table Policies
CREATE POLICY "Developers can see all tenants" ON public.tenants
  FOR ALL USING (auth.current_user_role() = 'developer');

CREATE POLICY "Users can view their own tenant" ON public.tenants
  FOR SELECT USING (id = auth.current_tenant_id());

-- 2. User Profiles Policies
CREATE POLICY "Users can view users in same tenant" ON public.user_profiles
  FOR SELECT USING (tenant_id = auth.current_tenant_id() OR auth.current_user_role() = 'developer');

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (id = auth.uid());

-- Categories
CREATE POLICY "Tenant isolation for categories" ON public.categories
  FOR ALL USING (tenant_id = auth.current_tenant_id() OR auth.current_user_role() = 'developer');

-- Subcategories
CREATE POLICY "Tenant isolation for subcategories" ON public.subcategories
  FOR ALL USING (tenant_id = auth.current_tenant_id() OR auth.current_user_role() = 'developer');

-- Trucks
CREATE POLICY "Tenant isolation for trucks" ON public.trucks
  FOR ALL USING (tenant_id = auth.current_tenant_id() OR auth.current_user_role() = 'developer');

-- Bookings (Customers only see their own, Admins see all in tenant)
CREATE POLICY "Customers see own bookings, admins see tenant bookings" ON public.bookings
  FOR ALL USING (
    (tenant_id = auth.current_tenant_id() AND customer_id = auth.uid()) OR
    (tenant_id = auth.current_tenant_id() AND auth.current_user_role() IN ('operations', 'super_admin', 'accounts')) OR
    auth.current_user_role() = 'developer'
  );

-- Trips
CREATE POLICY "Tenant isolation for trips" ON public.trips
  FOR ALL USING (tenant_id = auth.current_tenant_id() OR auth.current_user_role() = 'developer');

-- GPS Locations
CREATE POLICY "Tenant isolation for GPS" ON public.gps_locations
  FOR ALL USING (tenant_id = auth.current_tenant_id() OR auth.current_user_role() = 'developer');

-- Site Media
CREATE POLICY "Public read for site media" ON public.site_media
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage site media" ON public.site_media
  FOR ALL USING (
    (tenant_id = auth.current_tenant_id() AND auth.current_user_role() IN ('operations', 'super_admin')) OR
    auth.current_user_role() = 'developer'
  );

-- Error Logs (Developers only)
CREATE POLICY "Only developers can access error logs" ON public.error_logs
  FOR ALL USING (auth.current_user_role() = 'developer');
