
import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder, PostgrestQueryBuilder } from '@supabase/supabase-js';

/**
 * Type-safe wrapper for generic operations on tables that may not exist yet
 */
export function safeTableOperation<T = any>(tableName: string) {
  return {
    select: (columns: string = '*') => {
      try {
        return supabase
          .from(tableName)
          .select(columns) as unknown as PostgrestFilterBuilder<T>;
      } catch (error) {
        console.error(`Error selecting from table ${tableName}:`, error);
        return {
          eq: () => safeTableOperation<T>(tableName).select(),
          order: () => safeTableOperation<T>(tableName).select(),
          limit: () => safeTableOperation<T>(tableName).select(),
          single: async () => ({ data: null, error: { message: `Table ${tableName} does not exist` } }),
          then: (callback) => Promise.resolve().then(() => callback({ data: [], error: null }))
        } as unknown as PostgrestFilterBuilder<T>;
      }
    },
    insert: (values: any) => {
      try {
        return supabase
          .from(tableName)
          .insert(values) as unknown as PostgrestFilterBuilder<T>;
      } catch (error) {
        console.error(`Error inserting into table ${tableName}:`, error);
        return {
          select: () => safeTableOperation<T>(tableName).select(),
          single: async () => ({ data: null, error: { message: `Table ${tableName} does not exist` } })
        } as unknown as PostgrestFilterBuilder<T>;
      }
    },
    update: (values: any) => {
      try {
        return supabase
          .from(tableName)
          .update(values) as unknown as PostgrestFilterBuilder<T>;
      } catch (error) {
        console.error(`Error updating table ${tableName}:`, error);
        return {
          eq: () => safeTableOperation<T>(tableName).update(values),
          select: () => safeTableOperation<T>(tableName).select(),
          single: async () => ({ data: null, error: { message: `Table ${tableName} does not exist` } })
        } as unknown as PostgrestFilterBuilder<T>;
      }
    },
    delete: () => {
      try {
        return supabase
          .from(tableName)
          .delete() as unknown as PostgrestFilterBuilder<T>;
      } catch (error) {
        console.error(`Error deleting from table ${tableName}:`, error);
        return {
          eq: () => safeTableOperation<T>(tableName).delete(),
          single: async () => ({ data: null, error: { message: `Table ${tableName} does not exist` } })
        } as unknown as PostgrestFilterBuilder<T>;
      }
    }
  };
}
