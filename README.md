# VenConnect - Enterprise Claude Interface Platform

Enterprise-grade web platform enabling teams in Vietnam and Australia to access Claude 4 Sonnet via Replicate API with full compliance for both jurisdictions.

## 🚀 Features

- **Advanced AI Chat**: Real-time streaming responses with Claude 4 Sonnet
- **Multi-Region Support**: Optimised for teams in Vietnam and Australia
- **Enterprise Security**: Auth0 integration, MFA, RBAC, and audit logging
- **Usage Analytics**: Track costs in VND/AUD with detailed analytics
- **File Upload Support**: Handle PDFs, docs, images up to 10MB
- **Dark/Light Themes**: With regional colour schemes

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 15+
- Redis 7+
- Auth0 account
- Replicate API access
- AWS account (for production)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/venconnect.git
cd venconnect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
venconnect/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Main application pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── chat/             # Chat interface components
│   ├── admin/            # Admin dashboard components
│   └── layout/           # Layout components
├── lib/                   # Utilities and libraries
│   ├── api/              # API client functions
│   ├── auth/             # Authentication helpers
│   └── replicate/        # Replicate API integration
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── public/               # Static assets
```

## 🔧 Configuration

### Auth0 Setup

1. Create an Auth0 application
2. Configure callback URLs:
   - Development: `http://localhost:3000/api/auth/callback`
   - Production: `https://yourdomain.com/api/auth/callback`
3. Enable MFA in Auth0 dashboard
4. Set up RBAC with roles: `user`, `admin`, `super_admin`

### Replicate API

1. Get your API token from [Replicate](https://replicate.com)
2. Access Claude 4 Sonnet: https://replicate.com/anthropic/claude-4-sonnet
3. Configure rate limits and usage quotas

### Multi-Region Setup

- **Australia**: Primary deployment in AWS Sydney (ap-southeast-2)
- **Vietnam**: Read replicas in AWS Singapore (ap-southeast-1)
- Configure GeoDNS for optimal routing

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Docker Deployment

```bash
docker build -t venconnect .
docker run -p 3000:3000 venconnect
```

### AWS Deployment

Deploy to EKS clusters in Sydney and Singapore regions with:
- Application Load Balancers
- Auto-scaling groups
- RDS PostgreSQL with read replicas
- ElastiCache Redis clusters

## 📊 Usage

### For Users
1. Log in with your corporate account
2. Select your preferred model version
3. Start chatting with Claude 4 Sonnet
4. Upload files for context
5. View conversation history

### For Admins
1. Access admin dashboard at `/admin`
2. Manage users and permissions
3. Monitor usage and costs
4. Export compliance reports
5. Configure system settings

## 🔒 Security

- All data encrypted at rest (AES-256)
- TLS 1.3 for all communications
- Regular security audits
- Compliance with Australian Privacy Principles
- Vietnam data localisation compliance

## 📈 Performance

- Target: <200ms response time (95th percentile)
- Support for 100+ concurrent users
- 99.5% uptime SLA
- Automatic failover between regions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential.

## 🆘 Support

- Internal documentation: `/docs`
- Email: support@venconnect.com
- Slack: #venconnect-support

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- AI powered by [Claude 4 Sonnet on Replicate](https://replicate.com/anthropic/claude-4-sonnet)
