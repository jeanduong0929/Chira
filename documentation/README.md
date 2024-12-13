# Welcome to the team

Once you've cloned your project, you'll need to set up your environment. Follow these steps to get started.

### Install all dependencies:


```bun```
```npm
bun install
```


### Set up Clerk for authentication

Clerk is responsible for user authentication. Follow these steps to configure it:


1. Go to [Clerk](https://clerk.com/) and create a new project.
2. Select **Email** and **GitHub** as your project authentication methods.
3. In the Clerk dashboard, go to **Settings** > **Configuration** and create a **TWL template**.
4. Retrieve your **Clerk Issuer ID** and API keys.

**Hint**: 
To Find **Clerk Issuer ID** follow: 

**Clerk Dashboard**> **config** > JWT **Template** > **convex** > **Issuer**

Add the following to your ``.env.local`` file:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_publishable_key>
CLERK_SECRET_KEY=<your_secret_key>
```


## Set up OPEN AI

1. Get API KEY from [OpenAI](https://openai.com/)
2. Add this to your .env.local file. 

### Set Up Convex for Backend (Server + Database)

1. Go to: [Covex](https://www.convex.dev/) and create a new account.
3. Create a new project
4. In the Convex dashboard, set up the following environment variables:

```
CLERK_ISSUER_URL=<your_clerk_issuer_url>
OPENAI_API_KEY=<your_openai_api_key>
```


4. Synchronize Convex with your project by running the following command in your project directory:

```bash
bun convex dev
```

4. Select your existing project and choose **Next.js** as the framework. After synchronization completes, you should see multiple new tables in your Convex project dashboard.


So your ```env.local``` should look like:

```

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_CLERK_PUBLISHABLE_KEY>

CLERK_SECRET_KEY=<your_CLERK_SECRET_KEY>

NEXT_PUBLIC_CONVEX_URL=<your_PUBLIC_CONVEX_URL>

CLERK_ISSUER_URL=<your_CLERK_ISSUER_URL>

NEXT_PUBLIC_OPENAI_API_KEY=<your_OPENAI_API_KEY>


# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT= <your_OCONVEX_DEPLOYMENT_URL>


```

### Run your project

```
bun run dev
```

Happy Coding!