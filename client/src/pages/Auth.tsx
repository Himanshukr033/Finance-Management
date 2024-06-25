import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton, 
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

const Auth = () => {
  return (
    <div className="sign-in-container">
    <SignedOut>
        <SignUpButton mode="modal"/>
        <SignInButton mode="modal"/>
    </SignedOut>

    <SignedIn>
        {/* <UserButton/> */}
        <h1>hat bc</h1>
    </SignedIn>
    </div>
    );
};

export default Auth;
