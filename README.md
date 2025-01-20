# ChaleCheck

A modern restaurant discovery and review platform for Ghana.

## Features

- 🔍 Search and discover restaurants
- ⭐ Read and write reviews
- 💫 Save favorite restaurants
- 📱 Responsive design
- 🔒 User authentication
- 📧 Email verification
- 🖼️ Image uploads with Cloudinary
- 🌙 Modern UI with Tailwind CSS

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma (PostgreSQL)
- NextAuth.js
- Tailwind CSS
- Cloudinary
- Resend (Email)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chalecheck.git
cd chalecheck
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your values:
- Set up a PostgreSQL database and update `DATABASE_URL`
- Generate a random string for `NEXTAUTH_SECRET`
- Set up Cloudinary and add credentials
- Add Resend API key for email functionality

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

### Production Deployment

#### Deploying to Netlify

1. Connect your GitHub repository to Netlify

2. Add the following environment variables in Netlify:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (your production URL)
- `RESEND_API_KEY`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

3. Deploy settings:
- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 18

4. Deploy! 🚀

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
