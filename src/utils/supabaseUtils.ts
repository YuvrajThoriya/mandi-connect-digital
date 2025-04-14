
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type SafeQueryResult<T> = {
  data: T[] | null;
  error: PostgrestErrorWithName | null;
};

export type PostgrestErrorWithName = PostgrestError & {
  name?: string;
};

// Helper to safely handle type conversions from Supabase responses
export function ensureType<T>(data: any): T[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data as T[];
  }
  return [data] as T[];
}

// Get a typed reference to a table (allows using any table name)
export const safeTable = <T = any>(tableName: string) => {
  // @ts-ignore - We're intentionally allowing any table name
  return supabase.from(tableName);
};

// Type-safe query operation
export const queryTable = async <T>(
  tableName: string,
  queryFn: (table: any) => any
): Promise<SafeQueryResult<T>> => {
  try {
    const table = safeTable(tableName);
    const response = await queryFn(table);
    
    return {
      data: response.data ? ensureType<T>(response.data) : null,
      error: response.error ? { ...response.error, name: 'QueryError' } : null
    };
  } catch (err) {
    console.error(`Error querying table ${tableName}:`, err);
    return {
      data: null,
      error: {
        message: `Error querying table ${tableName}`,
        details: '',
        hint: '',
        code: '',
        name: 'QueryError'
      }
    };
  }
};

// Type-safe insert operation
export const insertIntoTable = async <T>(
  tableName: string,
  data: any
): Promise<SafeQueryResult<T>> => {
  try {
    const table = safeTable(tableName);
    const response = await table.insert(data);
    
    return {
      data: response.data ? ensureType<T>(response.data) : null,
      error: response.error ? { ...response.error, name: 'InsertError' } : null
    };
  } catch (err) {
    console.error(`Error inserting into table ${tableName}:`, err);
    return {
      data: null,
      error: {
        message: `Error inserting into table ${tableName}`,
        details: '',
        hint: '',
        code: '',
        name: 'InsertError'
      }
    };
  }
};

// Type-safe update operation
export const updateTable = async <T>(
  tableName: string,
  data: any,
  matchColumn: string,
  matchValue: string | number
): Promise<SafeQueryResult<T>> => {
  try {
    const table = safeTable(tableName);
    const response = await table.update(data).eq(matchColumn, matchValue);
    
    return {
      data: response.data ? ensureType<T>(response.data) : null,
      error: response.error ? { ...response.error, name: 'UpdateError' } : null
    };
  } catch (err) {
    console.error(`Error updating table ${tableName}:`, err);
    return {
      data: null,
      error: {
        message: `Error updating table ${tableName}`,
        details: '',
        hint: '',
        code: '',
        name: 'UpdateError'
      }
    };
  }
};

// Type-safe delete operation
export const deleteFromTable = async <T>(
  tableName: string,
  matchColumn: string,
  matchValue: string | number
): Promise<SafeQueryResult<T>> => {
  try {
    const table = safeTable(tableName);
    const response = await table.delete().eq(matchColumn, matchValue);
    
    return {
      data: response.data ? ensureType<T>(response.data) : null,
      error: response.error ? { ...response.error, name: 'DeleteError' } : null
    };
  } catch (err) {
    console.error(`Error deleting from table ${tableName}:`, err);
    return {
      data: null,
      error: {
        message: `Error deleting from table ${tableName}`,
        details: '',
        hint: '',
        code: '',
        name: 'DeleteError'
      }
    };
  }
};

// Property checking utility
export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T, 
  prop: K
): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// Ensure object has required property with fallback
export function ensureObjectWithProperty<T extends object, K extends PropertyKey>(
  obj: any,
  prop: K,
  defaultValue: any = { [prop]: "Unknown" }
): T & Record<K, unknown> {
  if (obj && typeof obj === 'object' && !obj.error && hasProperty(obj, prop)) {
    return obj as T & Record<K, unknown>;
  }
  return defaultValue as T & Record<K, unknown>;
}

// Get categories helper
export const getCategories = async () => {
  try {
    const response = await safeTable('categories').select('*');
    if (response.data) {
      return { data: response.data as any[], error: null };
    }
    return { data: [], error: response.error };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return { data: [], error };
  }
};
