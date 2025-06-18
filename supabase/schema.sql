-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE region AS ENUM ('AU', 'VN');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role user_role DEFAULT 'user' NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    region region NOT NULL,
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Organisations table (for multi-tenant support)
CREATE TABLE public.organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    region region NOT NULL,
    settings JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-Organisation relationship
CREATE TABLE public.user_organisations (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    organisation_id UUID REFERENCES public.organisations(id) ON DELETE CASCADE,
    role user_role DEFAULT 'user' NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, organisation_id)
);

-- Conversations table
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    organisation_id UUID REFERENCES public.organisations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    model_version TEXT NOT NULL DEFAULT 'claude-4-sonnet',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB,
    is_archived BOOLEAN DEFAULT FALSE
);

-- Messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    tokens_used INTEGER,
    cost_aud DECIMAL(10,6),
    cost_vnd DECIMAL(15,2),
    model_version TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB
);

-- File attachments table
CREATE TABLE public.attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API usage tracking
CREATE TABLE public.api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    organisation_id UUID REFERENCES public.organisations(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    tokens_used INTEGER,
    cost_aud DECIMAL(10,6),
    cost_vnd DECIMAL(15,2),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_org_id ON public.conversations(organisation_id);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at);
CREATE INDEX idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX idx_api_usage_created_at ON public.api_usage(created_at);
CREATE INDEX idx_api_usage_endpoint ON public.api_usage(endpoint);

-- Create views for analytics
CREATE VIEW public.daily_usage AS
SELECT 
    DATE(created_at) as date,
    user_id,
    organisation_id,
    COUNT(*) as api_calls,
    SUM(tokens_used) as total_tokens,
    SUM(cost_aud) as total_cost_aud,
    SUM(cost_vnd) as total_cost_vnd,
    AVG(response_time_ms) as avg_response_time
FROM public.api_usage
GROUP BY DATE(created_at), user_id, organisation_id;

CREATE VIEW public.user_statistics AS
SELECT 
    u.id,
    u.email,
    u.full_name,
    u.role,
    u.region,
    COUNT(DISTINCT c.id) as conversation_count,
    COUNT(DISTINCT m.id) as message_count,
    SUM(au.tokens_used) as total_tokens_used,
    SUM(au.cost_aud) as total_cost_aud,
    SUM(au.cost_vnd) as total_cost_vnd
FROM public.users u
LEFT JOIN public.conversations c ON u.id = c.user_id
LEFT JOIN public.messages m ON c.id = m.conversation_id
LEFT JOIN public.api_usage au ON u.id = au.user_id
GROUP BY u.id;

-- RLS Policies
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can read all users in their organisation
CREATE POLICY "Admins can read organisation users" ON public.users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_organisations uo
            WHERE uo.user_id = auth.uid()
            AND uo.role IN ('admin', 'super_admin')
            AND uo.organisation_id IN (
                SELECT organisation_id FROM public.user_organisations
                WHERE user_id = users.id
            )
        )
    );

-- Enable RLS on all tables
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can read own conversations" ON public.conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.conversations
    FOR UPDATE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can read messages in their conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create messages in their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.conversations c
            WHERE c.id = messages.conversation_id
            AND c.user_id = auth.uid()
        )
    );

-- Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, region)
    VALUES (
        NEW.id, 
        NEW.email,
        CASE 
            WHEN NEW.raw_user_meta_data->>'region' IS NOT NULL 
            THEN (NEW.raw_user_meta_data->>'region')::region
            ELSE 'AU'::region
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_organisations_updated_at
    BEFORE UPDATE ON public.organisations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to calculate costs
CREATE OR REPLACE FUNCTION calculate_costs(
    p_tokens INTEGER,
    p_model TEXT DEFAULT 'claude-4-sonnet'
) RETURNS TABLE(cost_aud DECIMAL, cost_vnd DECIMAL) AS $$
DECLARE
    v_cost_per_1k_tokens DECIMAL := 0.003; -- $3 per million tokens
    v_aud_to_vnd DECIMAL := 17150;
BEGIN
    cost_aud := (p_tokens::DECIMAL / 1000) * v_cost_per_1k_tokens;
    cost_vnd := cost_aud * v_aud_to_vnd;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;
