const config = {
  providers: [
    {
      domain: process.env.CLERK_ISSUER_URL!,
      applicationID: "convex",
    },
  ],
};

export default config;
