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

  // const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const { email, password } = e.currentTarget.elements;
  //   console.log("submitted", { email: email.value, password: password.value });
  // };

  // return (
  //   <div className={s.wrapper}>
  //     <form className={s.form} onSubmit={handleSubmit}>
  //       <input name="email" type="email" placeholder="email" />
  //       <input name="password" type="password" placeholder="password" />
  //       <button type="submit" className={s.button}>
  //         Log In
  //       </button>
  //     </form>
  //   </div>
  // );
}
