# TikTok Clone

## Overview
This project is a TikTok clone built using Next.js, Clerk for authentication, and Supabase for backend services. The application allows users to upload videos, sign in, and explore content similar to TikTok.

## Features
- User authentication with Clerk
- Video upload functionality using Vercel Blob
- Video storage and management with Supabase
- Responsive UI with Tailwind CSS and Radix UI components

## Project Structure
- **app/**: Contains the main application files, including pages and API routes.
- **components/**: Reusable UI components.
- **middleware.ts**: Handles authentication middleware using Clerk.
- **next.config.mjs**: Configuration for Next.js.
- **.env.local**: Environment variables for Supabase and Clerk.
- **.gitignore**: Specifies files and directories to be ignored by Git.

## Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tiktok-clone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`.

## Key Technologies
- **Next.js**: A React framework for server-side rendering and static site generation.
- **Clerk**: Authentication service for managing user sessions.
- **Supabase**: Backend-as-a-service for database and storage.
- **Vercel Blob**: Storage solution for handling file uploads.

## Future Improvements
- Implement user profiles and video feeds.
- Add comments and likes functionality for videos.
- Enhance the UI/UX with animations and transitions.

## License
This project is licensed under the MIT License.