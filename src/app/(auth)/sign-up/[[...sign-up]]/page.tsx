import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return <SignUp forceRedirectUrl="/dashboard" />;
};

export default SignUpPage;
