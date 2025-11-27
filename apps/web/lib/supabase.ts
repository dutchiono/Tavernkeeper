// Supabase REST API client - direct API calls, no dependencies needed
// This replaces Prisma and the Supabase client library
const SUPABASE_URL = process.env.SUPABASE_PROJECT_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_API_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables. Please set SUPABASE_PROJECT_URL and SUPABASE_API_KEY');
}

const API_BASE = `${SUPABASE_URL}/rest/v1`;

export interface SupabaseResponse<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

async function supabaseRequest<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  table: string,
  options: {
    select?: string;
    eq?: { column: string; value: string | number };
    in?: { column: string; values: (string | number)[] };
    order?: { column: string; ascending?: boolean };
    limit?: number;
    single?: boolean;
    body?: unknown;
  } = {}
): Promise<SupabaseResponse<T>> {
  // Construct URL: /rest/v1/table_name (not /rest/v1/method)
  const url = new URL(`${API_BASE}/${table}`);

  // Add query parameters
  if (options.select) {
    url.searchParams.set('select', options.select);
  }
  if (options.eq) {
    url.searchParams.set(`${options.eq.column}`, `eq.${options.eq.value}`);
  }
  if (options.in) {
    url.searchParams.set(`${options.in.column}`, `in.(${options.in.values.join(',')})`);
  }
  if (options.order) {
    url.searchParams.set('order', `${options.order.column}.${options.order.ascending ? 'asc' : 'desc'}`);
  }
  if (options.limit) {
    url.searchParams.set('limit', options.limit.toString());
  }

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': options.single ? 'return=representation' : 'return=representation',
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      return { data: null, error: { message: error.message || response.statusText, code: response.status.toString() } };
    }

    const data = await response.json();
    return { data: options.single ? (Array.isArray(data) ? data[0] : data) : data, error: null };
  } catch (error) {
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Unknown error' }
    };
  }
}

// Query builder that matches Supabase client API
export const supabase = {
  from: <T = Record<string, unknown>>(table: string) => ({
    select: (columns = '*') => ({
      eq: (column: string, value: string | number) => ({
        single: () => supabaseRequest<T>('GET', table, { select: columns, eq: { column, value }, single: true }),
        order: (orderColumn: string, options?: { ascending?: boolean }) => ({
          limit: (limit: number) => supabaseRequest<T[]>('GET', table, {
            select: columns,
            eq: { column, value },
            order: { column: orderColumn, ascending: options?.ascending ?? true },
            limit
          }),
        }),
        limit: (limit: number) => supabaseRequest<T[]>('GET', table, {
          select: columns,
          eq: { column, value },
          limit
        }),
      }),
      in: (column: string, values: (string | number)[]) => ({
        order: (orderColumn: string, options?: { ascending?: boolean }) => ({
          limit: (limit: number) => supabaseRequest<T[]>('GET', table, {
            select: columns,
            in: { column, values },
            order: { column: orderColumn, ascending: options?.ascending ?? true },
            limit
          }),
        }),
      }),
      order: (column: string, options?: { ascending?: boolean }) => ({
        limit: (limit: number) => supabaseRequest<T[]>('GET', table, {
          select: columns,
          order: { column, ascending: options?.ascending ?? true },
          limit
        }),
      }),
      limit: (limit: number) => supabaseRequest<T[]>('GET', table, {
        select: columns,
        limit
      }),
      single: () => supabaseRequest<T>('GET', table, { select: columns, single: true }),
    }),
    insert: (data: unknown) => ({
      select: (columns = '*') => ({
        single: () => supabaseRequest<T>('POST', table, { body: data, select: columns, single: true }),
      }),
      single: () => supabaseRequest<T>('POST', table, { body: data, single: true }),
    }),
    update: (data: unknown) => ({
      eq: (column: string, value: string | number) => supabaseRequest<T>('PATCH', table, {
        body: data,
        eq: { column, value }
      }),
    }),
    delete: () => ({
      eq: (column: string, value: string | number) => supabaseRequest('DELETE', table, {
        eq: { column, value }
      }),
    }),
  }),
};
