import NextAuth from "next-auth";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { supabase } from "@/utils/supabase";

export const authOptions = {
  // https://next-auth.js.org/configuration/providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),
  callbacks: {
    async session({ session, user }) {
      const signingSecret = process.env.SUPABASE_JWT_SECRET;

      // create user role row for this user
      // if not exists. This is how we store and
      // fetch the user's role: user | admin | superuser
      const { data: userFromDB, error: userFromDBError } = await supabase
        .from("user")
        .select("id")
        .eq("email", user.email);

      let userID;

      if (userFromDB.length === 0) {
        const { data } = await supabase
          .from("user")
          .insert({ email: user.email })
          .select("id");
        userID = data[0].id;
      } else {
        userID = userFromDB[0].id;
      }

      if (signingSecret) {
        const payload = {
          aud: "authenticated",
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          sub: user.id,
          email: user.email,
          role: "authenticated",
        };
        session.supabaseAccessToken = jwt.sign(payload, signingSecret);
      }
      session.user.id = userID;
      return session;
    },
  },
};

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth(authOptions);
