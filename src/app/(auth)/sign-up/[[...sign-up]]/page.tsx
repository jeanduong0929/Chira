"use client";

import React, { useEffect } from "react";

import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  // Delete project from local storage
  useEffect(() => {
    localStorage.removeItem("project");
  }, []);

  return <SignUp signInUrl="/sign-in" />;
};

export default SignUpPage;
