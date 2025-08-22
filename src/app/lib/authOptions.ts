import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // 1. Login
          const loginRes = await fetch("http://localhost:4000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!loginRes.ok) return null;
          const loginJson = await loginRes.json();
          const loginData = loginJson.data;

          // 2. Access token kadaluarsa
          const accessTokenExpiresAt = new Date(loginData.expires_at).getTime() / 1000;

          // 3. Fetch profile dengan access token
          const profileRes = await fetch("http://localhost:4000/users/profile", {
            headers: { Authorization: `Bearer ${loginData.access_token}` },
          });
          if (!profileRes.ok) return null;
          const profileJson = await profileRes.json();
          const profileData = profileJson.data;

          return {
            id: profileData.id,
            sub: profileData.id,
            name: profileData.name,
            role: profileData.role,
            idToken: profileData.id_token,
            accessToken: loginData.access_token,
            refreshToken: loginData.refresh_token,
            expiresAt: accessTokenExpiresAt,
            profile: profileData,
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // first login
      if (user) {
        token.id = Number(user.id);
        token.name = user.name;
        token.role = user.role;
        token.idToken = user.idToken;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        token.profile = user.profile;
      }

      // refresh token jika access token kadaluarsa
      const now = Math.floor(Date.now() / 1000);
      if (token.expiresAt && now >= token.expiresAt) {
        try {
          const refreshRes = await fetch("http://localhost:4000/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: token.refreshToken }),
          });

          if (refreshRes.ok) {
            const newTokens = await refreshRes.json();

            const newAccessTokenExpiresAt = new Date(newTokens.expires_at).getTime() / 1000;

            token.accessToken = newTokens.access_token;
            token.refreshToken = newTokens.refresh_token;
            token.expiresAt = newAccessTokenExpiresAt;

            // update profile
            const profileRes = await fetch("http://localhost:4000/users/profile", {
              headers: { Authorization: `Bearer ${newTokens.access_token}` },
            });
            if (profileRes.ok) {
              const profileJson = await profileRes.json();
              token.profile = profileJson.data;
            }
          } else {
            console.error("Failed to refresh token");
          }
        } catch (err) {
          console.error("Error refreshing token:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as number;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.idToken = token.idToken as string;
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.expiresAt = new Date((token.expiresAt as number) * 1000).toISOString();
        session.user.profile = token.profile;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
