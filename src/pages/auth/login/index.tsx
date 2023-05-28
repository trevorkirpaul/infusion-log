import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const s = {
  wrapper:
    "flex flex-row min-h-screen justify-center items-center p-1 bg-gray-500",
  form: "flex flex-col",
  button: "bg-purple-500",
};

export default function LoginPage() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        Signed in as {session.user?.email || "..."} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
