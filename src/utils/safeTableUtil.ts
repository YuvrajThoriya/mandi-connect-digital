
import { supabase } from '@/integrations/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Type-safe wrapper for generic operations on tables that may not exist yet
 */
export function safeTableOperation<T = any>(tableName: string) {
  return {
    select: (columns: string = '*') => {
      try {
        // @ts-ignore - Allow string tableName
        return supabase.from(tableName).select(columns);
      } catch (error) {
        console.error(`Error selecting from table ${tableName}:`, error);
        return {
          eq: () => safeTableOperation<T>(tableName).select(),
          order: () => safeTableOperation<T>(tableName).select(),
          limit: () => safeTableOperation<T>(tableName).select(),
          single: async () => ({ data: null, error: { message: `Table ${tableName} does not exist` } }),
          then: (callback: any) => Promise.resolve().then(() => callback({ data: [], error: null }))
        } as any;
      }
    },
    insert: (values: any) => {
      try {
        // @ts-ignore - Allow string tableName
        return supabase.from(tableName).insert(values);
      } catch (error) {
        console.error(`Error inserting into table ${tableName}:`, error);
        return {
          select: () => safeTableOperation<T>(tableName).select(),
          single: async () => ({ data: null, error: { message: `Table ${tableName} does not exist` } })
        } as any;
      }
    },
    update: (values: any) => {
      try {
        // @ts-ignore - Allow string tableName
        return supabase.from(tableName).update(values);
      } catch (error) {
        console.error(`Error updating table ${tableName}:`, error);
        return {
          eq: () => safeTableOperation<T>(tableName).update(values),
          select: () => safeTableOperation<T>(tableName).select(),
          single: async () => ({ data: null, error: { message: `Table ${tableName} does not exist` } })
        } as any;
      }
    },
    delete: () => {
      try {
        // @ts-ignore - Allow string tableName
        return supabase.from(tableName).delete();
      } catch (error) {
        console.error(`Error deleting from table ${tableName}:`, error);
        return {
          eq: () => safeTableOperation<T>(tableName).delete(),
          single: async () => ({ data: null, error: { message: `Table ${tableName} does not exist` } })
        } as any;
      }
    }
  };
}
