import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return <SignIn forceRedirectUrl="/dashboard" />;
};

export default SignInPage;
