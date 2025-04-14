
import { PostgrestError, PostgrestResponse } from "@supabase/supabase-js";
import { safeTable } from "@/integrations/supabase/client";

// Generic type for handling data safely from Supabase queries
export type SafeQueryResult<T> = {
  data: T[] | null;
  error: PostgrestError | null;
};

// Helper function to safely query any table
export const queryTable = async <T>(
  tableName: string,
  queryFn: (table: any) => any
): Promise<SafeQueryResult<T>> => {
  try {
    const table = safeTable(tableName);
    const response = await queryFn(table);
    return {
      data: response.data as T[] | null,
      error: response.error
    };
  } catch (err) {
    console.error(`Error querying table ${tableName}:`, err);
    return {
      data: null,
      error: {
        message: `Error querying table ${tableName}`,
        details: "",
        hint: "",
        code: ""
      }
    };
  }
};

// Helper to safely insert data into any table
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
      error: response.error
    };
  } catch (err) {
    console.error(`Error inserting into table ${tableName}:`, err);
    return {
      data: null,
      error: {
        message: `Error inserting into table ${tableName}`,
        details: "",
        hint: "",
        code: ""
      }
    };
  }
};

// Helper to safely update data in any table
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
      error: response.error
    };
  } catch (err) {
    console.error(`Error updating table ${tableName}:`, err);
    return {
      data: null,
      error: {
        message: `Error updating table ${tableName}`,
        details: "",
        hint: "",
        code: ""
      }
    };
  }
};

// Helper to safely delete data from any table
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
      error: response.error
    };
  } catch (err) {
    console.error(`Error deleting from table ${tableName}:`, err);
    return {
      data: null,
      error: {
        message: `Error deleting from table ${tableName}`,
        details: "",
        hint: "",
        code: ""
      }
    };
  }
};

// Type guard to check if an object has a specific property
export function hasProperty<T extends object, K extends PropertyKey>(
  obj: T, 
  prop: K
): obj is T & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

// Safely handle relations that might have errors
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
