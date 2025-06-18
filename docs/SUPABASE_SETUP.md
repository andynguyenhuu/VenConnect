# Supabase Setup Guide for VenConnect

## 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Create a new project named "VenConnect"
3. Choose the **Sydney (ap-southeast-2)** region for Australian compliance
4. Save your database password securely

## 2. Get Your API Keys

Once your project is created:

1. Go to Settings → API
2. Copy these values to your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` = Your service role key (keep this secret!)

## 3. Run Database Migrations

1. Go to the SQL Editor in your Supabase dashboard
2. Click "New query"
3. Copy and paste the contents of `/supabase/schema.sql`
4. Click "Run" to create all tables and policies

## 4. Configure Authentication

### Option A: Use Supabase Auth (Recommended for simplicity)

1. Go to Authentication → Providers
2. Enable Email provider
3. Configure:
   - Enable email confirmations
   - Set redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://yourdomain.com/auth/callback`
4. Enable MFA in Authentication → Settings

### Option B: Use Auth0 (For enterprise features)

1. Keep Auth0 as primary auth
2. Use Supabase for database only
3. Sync users from Auth0 to Supabase users table

## 5. Set Up Storage Buckets

1. Go to Storage in Supabase dashboard
2. Create a new bucket called "attachments"
3. Set policies:
   - Allow authenticated users to upload files up to 10MB
   - Allow users to read their own files

```sql
-- Upload policy
CREATE POLICY "Users can upload attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'attachments' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Read policy
CREATE POLICY "Users can read own attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'attachments' AND (storage.foldername(name))[1] = auth.uid()::text);
```

## 6. Set Up Row Level Security (RLS)

RLS is already configured in the schema, but verify it's enabled:

1. Go to Database → Tables
2. For each table, ensure the shield icon is green (RLS enabled)
3. Check policies are created under each table

## 7. Configure Real-time Subscriptions

1. Go to Database → Replication
2. Enable replication for:
   - `messages` table (for real-time chat)
   - `api_usage` table (for live dashboard updates)

## 8. Create Database Functions

The schema already includes some functions, but add these for the app:

```sql
-- Get user's organisation
CREATE OR REPLACE FUNCTION get_user_organisation(user_id UUID)
RETURNS TABLE(
  organisation_id UUID,
  organisation_name TEXT,
  user_role user_role
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    uo.role
  FROM user_organisations uo
  JOIN organisations o ON uo.organisation_id = o.id
  WHERE uo.user_id = $1
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get conversation with messages
CREATE OR REPLACE FUNCTION get_conversation_details(conv_id UUID)
RETURNS TABLE(
  conversation JSONB,
  messages JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_jsonb(c.*) as conversation,
    COALESCE(
      jsonb_agg(
        to_jsonb(m.*) ORDER BY m.created_at
      ) FILTER (WHERE m.id IS NOT NULL),
      '[]'::jsonb
    ) as messages
  FROM conversations c
  LEFT JOIN messages m ON c.id = m.conversation_id
  WHERE c.id = conv_id
  GROUP BY c.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 9. Set Up Edge Functions (Optional)

For handling Replicate API calls server-side:

```typescript
// supabase/functions/chat/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { message, model, conversationId } = await req.json()
  
  // Call Replicate API
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: model,
      input: { prompt: message }
    })
  })
  
  // Save to database
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
  
  // Return response
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

## 10. Multi-Region Considerations

For Vietnam users, consider:

1. **Read Replicas**: Contact Supabase support for read replicas in Singapore
2. **Edge Functions**: Deploy to Singapore region as well
3. **CDN**: Use Supabase's CDN for static assets

## 11. Monitoring and Alerts

1. Go to Settings → Logs
2. Set up alerts for:
   - Failed authentication attempts
   - High API usage
   - Database errors
   - Storage quota warnings

## 12. Backup Strategy

1. Enable Point-in-Time Recovery (Settings → Database)
2. Set up daily backups
3. Download backups monthly for compliance

## Next Steps

1. Test authentication flow
2. Verify RLS policies work correctly
3. Test file uploads
4. Monitor performance metrics
5. Set up staging environment

## Useful Supabase CLI Commands

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Generate types from database
supabase gen types typescript --linked > types/database.ts

# Run migrations
supabase db push

# Create a migration
supabase migration new migration_name
```

## Security Checklist

- [ ] Enable RLS on all tables
- [ ] Set up proper authentication
- [ ] Configure CORS for your domains
- [ ] Enable 2FA for team members
- [ ] Set up API rate limiting
- [ ] Configure backup retention
- [ ] Test disaster recovery plan
