# FOSS Andhra Website

Official website for FOSS Andhra - Promoting Free and Open Source Software in Andhra Pradesh.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

## 🌟 Features

- **Event Management**: Browse and register for FOSS events with Hi Events integration
- **Membership System**: Join the FOSS Andhra community with various membership tiers
- **Donation Platform**: Support open source initiatives via Razorpay
- **Program Showcase**: Explore our programs (FOSStar, FOSServe, FOSSynC, FOSStorm, FOSSart, FOSSterage, FOSSpeaks)
- **Blog & News**: Stay updated with FOSS community updates and articles
- **Admin CMS**: Comprehensive content management system for all content types
- **Member Portal**: Dedicated dashboard for members
- **Analytics Dashboard**: Track engagement and metrics

## 🚀 Quick Start

### Development

```bash
# Install dependencies
bun install

# Set up environment variables
cp .env.production .env
# Edit .env with your configuration

# Run database migrations
bunx prisma migrate dev

# Seed initial data
bunx tsx prisma/seed.ts

# Start development server
bun run dev

# Open http://localhost:3000
```

**Default Admin Credentials:**
- Email: `admin@fossandhra.org`
- Password: `admin123`
- ⚠️ Change immediately after first login!

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Docker deployment guide with PostgreSQL.

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Runtime**: Bun
- **Database**: PostgreSQL (Production) / SQLite (Development)
- **ORM**: Prisma
- **Authentication**: NextAuth
- **Payments**: Razorpay
- **Email**: Nodemailer with SMTP
- **Styling**: Tailwind CSS + Framer Motion
- **UI Components**: Radix UI
- **Rich Text Editor**: TipTap
- **Analytics**: Recharts
- **Deployment**: Docker

## 🔧 Configuration

### Environment Variables

Copy `.env.production` to `.env` and configure:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/fossandhra

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@fossandhra.org
SMTP_FROM_NAME=FOSS Andhra
```

### Generate Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

## 📂 Project Structure

```
foss-andhra-website/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin CMS pages
│   ├── api/               # API routes
│   ├── events/            # Event pages
│   ├── programs/          # Program showcase
│   └── ...
├── components/            # Reusable React components
│   ├── ui/               # UI component library
│   └── ...
├── lib/                   # Utility functions
├── prisma/               # Database schema & migrations
├── public/               # Static assets
├── Dockerfile            # Production Docker image
└── DEPLOYMENT.md         # Deployment documentation
```

## 🐳 Docker Deployment

Quick start with Docker (without Docker Compose):

```bash
# Build the Docker image
docker build -t foss-andhra-website .

# Run the container (make sure PostgreSQL is running separately)
docker run -d \
  --name foss-app \
  -p 3001:3000 \
  -e DATABASE_URL="postgresql://username:password@host:port/database_name?schema=public" \
  -e NEXTAUTH_URL="http://localhost:3001" \
  -e NEXTAUTH_SECRET="your-nextauth-secret" \
  -e NEXT_PUBLIC_APP_URL="http://localhost:3001" \
  -e NODE_ENV="production" \
  foss-andhra-website
```

For detailed deployment instructions, see [DOCKER-README.md](./DOCKER-README.md).

## 📚 Available Scripts

```bash
# Development
bun run dev              # Start dev server
bun run build            # Build for production
bun run start            # Start production server
bun run lint             # Run ESLint

# Database
bun run db:migrate       # Run database migrations
bun run db:seed          # Seed database
bun run db:studio        # Open Prisma Studio
```

## 🎯 Programs

FOSS Andhra runs several programs to promote open source:

1. **FOSStar** - Student outreach and education
2. **FOSServe** - Community service initiatives  
3. **FOSSynC** - College chapter network
4. **FOSStorm** - Hackathons and coding events
5. **FOSSart** - Startup incubation
6. **FOSSterage** - Digital archives and knowledge base
7. **FOSSpeaks** - Talks and workshops

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For issues or questions:
- **GitHub Issues**: [Repository Issues](https://github.com/your-repo/issues)
- **Email**: support@fossandhra.org
- **Website**: [fossandhra.org](https://fossandhra.org)

---

**Built with ❤️ by FOSS Andhra Community**