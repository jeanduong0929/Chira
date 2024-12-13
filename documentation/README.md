# Welcome to the team

After you cloned your project, you have to set up your environment.

### Install all dependencies:


```bun```
```npm

bun install

```

```npm```
```bash
npm install
```

You might encounter errors, so you can use

```
npm install --force
```

or

```
npm install --legacy-peer-deps
```

### Set up Clerk for authentication

Clerk is responsible for user authentication. Follow these steps to configure it:


1. Go to [Clerk](https://clerk.com/) and create a new project.
2. Select Email and GitHub as your project authentication methods.
3. In the Clerk dashboard, go to Settings > Configuration and create a TWL template.
4. Retrieve your Clerk Issuer ID and API keys.

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
```
Add this to your .env.local file.


### Set up Convex for your backend (server + DB)

1. Go to: https://www.convex.dev/
2. Create a new account
3. Create a new project
4. Set up env variables in Convex dashboard:

```
CLERK_ISSUER_URL = khttps://example-ofIssuer-45.clerk.accout
OPENAI_API_KEY = youapikeufromopenAI

```
4. After that you have to synchronize it with Chira project by running the command in your project directory:

```bash
npx convex dev

or 

bun convex dev
```



4. Select existing project, and use next.js.
After sync is onver,  you should see mulitple new tables in your project dahboard.




### Create .env.local