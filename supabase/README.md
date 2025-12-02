# Supabase Migrations

This directory contains SQL migration files for the InnKeeper database schema.

## How to Run Migrations

### Option 1: Supabase Dashboard (Easiest)
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Click **Run**

### Option 2: Supabase CLI (Recommended for Development)
If you have the Supabase CLI installed:

```bash
# Link to your project
supabase link --project-ref pjraemipdexyalunriyh

# Run migrations
supabase db push
```

### Option 3: Direct SQL Execution
You can also run migrations programmatically using the Supabase Management API, but this requires:
- Service role key (not anon key)
- More complex setup

For now, use Option 1 (Dashboard) - it's the simplest and most reliable.

## Migration Files

- `20240101000000_initial_schema.sql` - Creates all base tables, indexes, and RLS policies

## Notes

- Supabase uses PostgreSQL, so all migrations are SQL
- The REST API is for data operations (CRUD), not schema changes
- Schema changes must be done through SQL migrations
- Migrations are run once and tracked by Supabase

