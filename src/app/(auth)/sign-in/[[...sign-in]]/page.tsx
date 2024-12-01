"use client";

import React, { useEffect } from "react";

import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  // Delete project from local storage
  useEffect(() => {
    localStorage.removeItem("project");
  }, []);

  return <SignIn signUpUrl="/sign-up" />;
};

export default SignInPage;
