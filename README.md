# Infusion Log

An app for Hemophiliacs to track their medication usage and ordering. Users can log infusions as well as logging when they place orders for new factor. Infusions and Orders can all be modified as well.

## ENV Values (aka: Quick Start)

```
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_PUBLIC_ANON_KEY=...
GOOGLE_OAUTH_CLIENT_ID=...
GOOGLE_OAUTH_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=...
```

Supabase keys can be found on their site.

Google OAuth can be found on the dev console for tkirpaul@gmail.com.

The Next Auth values are easier, the URL is the url of the running client. The secret can be anything at this point, since we have not deployed.

> This project was bootstrapped with [auth-template](https://github.com/trevorkirpaul/auth-template).

## Getting Started

First, install dependencies and run the development server:

```bash
pnpm i

pnpm dev
```

You will be able to use Google SSO whiles working in your local env as long as you have the adequate ENV vars set up.
