-- 1. Create a function to handle new user signups and insert them into user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role, first_name)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'role', 'customer'), 
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Create a default Tenant (Company)
INSERT INTO public.tenants (id, name, slug, status)
VALUES ('00000000-0000-0000-0000-000000000001', 'SS Build Pvt Ltd', 'ssbuild', 'active')
ON CONFLICT DO NOTHING;
