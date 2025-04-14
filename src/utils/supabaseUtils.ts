import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type SafeQueryResult<T> = {
  data: T[] | null;
  error: PostgrestErrorWithName | null;
};

export type PostgrestErrorWithName = PostgrestError & {
  name?: string;
};

export const safeTable = <T = any>(tableName: string) => {
  return supabase.from(tableName as any);
};

export const queryTable = async <T>(
  tableName: string,
  queryFn: (table: any) => any
): Promise<SafeQueryResult<T>> => {
  try {
    const table = safeTable(tableName);
    const response = await queryFn(table);
    return {
      data: response.data as T[] | null,
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

export const insertIntoTable = async <T>(
  tableName: string,
  data: any,
  options: { returning?: boolean } = { returning: true }
): Promise<SafeQueryResult<T>> => {
  try {
    const table = safeTable(tableName);
    const response = await table.insert(data, options);
    return {
      data: response.data as T[] | null,
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

export const updateTable = async <T>(
  tableName: string,
  data: any,
  matchColumn: string,
  matchValue: string | number,
  options: { returning?: boolean } = { returning: true }
): Promise<SafeQueryResult<T>> => {
  try {
    const table = safeTable(tableName);
    const response = await table.update(data, options).eq(matchColumn, matchValue);
    return {
      data: response.data as T[] | null,
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

export const deleteFromTable = async <T>(
  tableName: string,
  matchColumn: string,
  matchValue: string | number,
  options: { returning?: boolean } = { returning: true }
): Promise<SafeQueryResult<T>> => {
  try {
    const table = safeTable(tableName);
    const response = await table.delete(options).eq(matchColumn, matchValue);
    return {
      data: response.data as T[] | null,
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

export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T, 
  prop: K
): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

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

export const getCategories = async () => {
  const { data, error } = await queryTable('categories', table => table.select('*'));
  return { data, error };
};
