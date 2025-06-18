#!/bin/bash

# VenConnect Supabase Setup Script

echo "🚀 VenConnect Supabase Setup"
echo "============================"
echo ""
echo "This script will help you set up Supabase for VenConnect"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Create a Supabase project at https://app.supabase.com"
echo "   - Choose Sydney (ap-southeast-2) region"
echo "   - Save your database password"
echo ""
echo "2. Get your API keys from Settings → API and add to .env.local:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""
echo "3. Run the database schema:"
echo "   - Go to SQL Editor in Supabase"
echo "   - Copy contents of /supabase/schema.sql"
echo "   - Click Run"
echo ""
echo "4. Set up Storage:"
echo "   - Go to Storage → New bucket"
echo "   - Name: 'attachments'"
echo "   - Public: No"
echo ""
echo "5. Configure Authentication:"
echo "   - Enable Email provider"
echo "   - Add redirect URLs"
echo "   - Enable MFA"
echo ""
echo "6. Test your setup:"
echo "   npm run dev"
echo "   Visit http://localhost:3000"
echo ""
echo "📚 Full documentation: /docs/SUPABASE_SETUP.md"
echo ""

# Optional: Install Supabase CLI
read -p "Would you like to install Supabase CLI? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Installing Supabase CLI..."
    npm install -g supabase
    echo "✅ Supabase CLI installed"
    echo ""
    echo "You can now use:"
    echo "  supabase login"
    echo "  supabase link --project-ref <your-project-ref>"
    echo "  supabase gen types typescript --linked > types/database.ts"
fi

echo ""
echo "✨ Setup guide complete!"
