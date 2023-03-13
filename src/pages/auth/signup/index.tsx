import React from "react";

const s = {
  wrapper:
    "flex flex-row min-h-screen justify-center items-center p-1 bg-gray-500",
  form: "flex flex-col",
  button: "bg-purple-500",
};

export default function SignUpPage() {
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = e.currentTarget.elements;
    console.log("submitted", { email: email.value, password: password.value });
  };

  return (
    <div className={s.wrapper}>
      <form className={s.form} onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="email" />
        <input name="password" type="password" placeholder="password" />
        <input
          name="confirm-password"
          type="password"
          placeholder="confirm password"
        />
        <button type="submit" className={s.button}>
          Sign Up
        </button>
      </form>
    </div>
  );
}
