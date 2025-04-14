
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications (user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications (is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications (type);

-- Add trigger to update timestamps
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add RLS policies
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only view their own notifications
CREATE POLICY notifications_select_policy ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only insert their own notifications
CREATE POLICY notifications_insert_policy ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own notifications
CREATE POLICY notifications_update_policy ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own notifications
CREATE POLICY notifications_delete_policy ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);
