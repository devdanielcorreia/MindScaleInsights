# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7ca2e1b4-af0a-4d3b-9376-e0e7ae094671

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7ca2e1b4-af0a-4d3b-9376-e0e7ae094671) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Create your local env file (copies .env.example without committing secrets).
cp .env.example .env.local

# Step 4: Fill in .env.local with the Supabase URL, Project ID and anon key.

# Step 5: Install the necessary dependencies.
npm i

# Step 6: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Deploy on Vercel

To deploy this application on Vercel, follow these steps:

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Vercel will automatically detect this is a Vite/React project and configure the build settings
5. Add the required environment variables in the Vercel dashboard (see below)
6. Click "Deploy" and your application will be live!

### Environment Variables for Vercel Deployment

When deploying on Vercel, you'll need to add these environment variables in your Vercel project settings:

- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase publishable key
- `VITE_SUPABASE_URL` - Your Supabase project URL

These should match the values from your `.env.local` (copied from `.env.example` and filled with the real credentials).

### Alternative Deployment Method

Simply open [Lovable](https://lovable.dev/projects/7ca2e1b4-af0a-4d3b-9376-e0e7ae094671) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
