
-- Enable Row Level Security for all tables
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
CREATE POLICY profiles_select_policy ON public.profiles
  FOR SELECT USING (true);  -- Anyone can view profiles

CREATE POLICY profiles_insert_policy ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);  -- Users can only insert their own profile

CREATE POLICY profiles_update_policy ON public.profiles
  FOR UPDATE USING (auth.uid() = id);  -- Users can only update their own profile

CREATE POLICY profiles_delete_policy ON public.profiles
  FOR DELETE USING (auth.uid() = id);  -- Users can only delete their own profile

-- Products table policies
CREATE POLICY products_select_policy ON public.products
  FOR SELECT USING (true);  -- Anyone can view products

CREATE POLICY products_insert_policy ON public.products
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);  -- Farmers can only insert their own products

CREATE POLICY products_update_policy ON public.products
  FOR UPDATE USING (auth.uid() = farmer_id);  -- Farmers can only update their own products

CREATE POLICY products_delete_policy ON public.products
  FOR DELETE USING (auth.uid() = farmer_id);  -- Farmers can only delete their own products

-- Auctions table policies
CREATE POLICY auctions_select_policy ON public.auctions
  FOR SELECT USING (true);  -- Anyone can view auctions

CREATE POLICY auctions_insert_policy ON public.auctions
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);  -- Farmers can only insert their own auctions

CREATE POLICY auctions_update_policy ON public.auctions
  FOR UPDATE USING (auth.uid() = farmer_id);  -- Farmers can only update their own auctions

CREATE POLICY auctions_delete_policy ON public.auctions
  FOR DELETE USING (auth.uid() = farmer_id);  -- Farmers can only delete their own auctions

-- Bids table policies
CREATE POLICY bids_select_policy ON public.bids
  FOR SELECT USING (true);  -- Anyone can view bids

CREATE POLICY bids_insert_policy ON public.bids
  FOR INSERT WITH CHECK (auth.uid() = bidder_id);  -- Users can only insert their own bids

CREATE POLICY bids_update_policy ON public.bids
  FOR UPDATE USING (auth.uid() = bidder_id);  -- Users can only update their own bids

CREATE POLICY bids_delete_policy ON public.bids
  FOR DELETE USING (auth.uid() = bidder_id);  -- Users can only delete their own bids

-- Orders table policies
CREATE POLICY orders_trader_select_policy ON public.orders
  FOR SELECT USING (auth.uid() = trader_id);  -- Traders can view their orders

CREATE POLICY orders_farmer_select_policy ON public.orders
  FOR SELECT USING (auth.uid() = farmer_id);  -- Farmers can view orders for their products

CREATE POLICY orders_insert_policy ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = trader_id);  -- Only traders can create orders

CREATE POLICY orders_trader_update_policy ON public.orders
  FOR UPDATE USING (auth.uid() = trader_id);  -- Traders can update their orders

CREATE POLICY orders_farmer_update_policy ON public.orders
  FOR UPDATE USING (auth.uid() = farmer_id);  -- Farmers can update orders for their products

CREATE POLICY orders_trader_delete_policy ON public.orders
  FOR DELETE USING (auth.uid() = trader_id);  -- Traders can delete their orders

-- Appointments table policies
CREATE POLICY appointments_trader_select_policy ON public.appointments
  FOR SELECT USING (auth.uid() = trader_id);  -- Traders can view their appointments

CREATE POLICY appointments_farmer_select_policy ON public.appointments
  FOR SELECT USING (auth.uid() = farmer_id);  -- Farmers can view appointments with them

CREATE POLICY appointments_insert_policy ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = trader_id OR auth.uid() = farmer_id);  -- Either party can create appointments

CREATE POLICY appointments_update_policy ON public.appointments
  FOR UPDATE USING (auth.uid() = trader_id OR auth.uid() = farmer_id);  -- Either party can update appointments

CREATE POLICY appointments_delete_policy ON public.appointments
  FOR DELETE USING (auth.uid() = trader_id OR auth.uid() = farmer_id);  -- Either party can delete appointments

-- Business details table policies
CREATE POLICY business_details_select_policy ON public.business_details
  FOR SELECT USING (true);  -- Anyone can view business details

CREATE POLICY business_details_insert_policy ON public.business_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);  -- Users can only insert their own business details

CREATE POLICY business_details_update_policy ON public.business_details
  FOR UPDATE USING (auth.uid() = user_id);  -- Users can only update their own business details

CREATE POLICY business_details_delete_policy ON public.business_details
  FOR DELETE USING (auth.uid() = user_id);  -- Users can only delete their own business details

-- Farm details table policies
CREATE POLICY farm_details_select_policy ON public.farm_details
  FOR SELECT USING (true);  -- Anyone can view farm details

CREATE POLICY farm_details_insert_policy ON public.farm_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);  -- Users can only insert their own farm details

CREATE POLICY farm_details_update_policy ON public.farm_details
  FOR UPDATE USING (auth.uid() = user_id);  -- Users can only update their own farm details

CREATE POLICY farm_details_delete_policy ON public.farm_details
  FOR DELETE USING (auth.uid() = user_id);  -- Users can only delete their own farm details

-- Notification settings table policies
CREATE POLICY notification_settings_select_policy ON public.notification_settings
  FOR SELECT USING (auth.uid() = user_id);  -- Users can only view their own notification settings

CREATE POLICY notification_settings_insert_policy ON public.notification_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);  -- Users can only insert their own notification settings

CREATE POLICY notification_settings_update_policy ON public.notification_settings
  FOR UPDATE USING (auth.uid() = user_id);  -- Users can only update their own notification settings

CREATE POLICY notification_settings_delete_policy ON public.notification_settings
  FOR DELETE USING (auth.uid() = user_id);  -- Users can only delete their own notification settings
