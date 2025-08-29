import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// const API_SMAFARM = 'http://localhost:4000';
const API_SMAFARM = 'https://3a9faba3-4e26-4988-b04a-1d21b7e8014e-00-nz4pnvue4orv.pike.replit.dev:3000';
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
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
          const loginRes = await fetch(`${API_SMAFARM}/auth/login`, {
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

          const accessTokenExpiresAt = Math.floor(Date.now() / 1000) + 3500;

          const profileRes = await fetch(`${API_SMAFARM}/users/profile`, {
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
            profile: {
              ...profileData,
              hasFarm: profileData.farms !== null,
              farmId: profileData.farms?.id
            },
          };
        } catch (err) {
          console.error("Authorize error:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // first login
      const now = Math.floor(Date.now() / 1000);
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

      // refresh token if expired access token
      if (token.expiresAt && now >= token.expiresAt) {
        try {
          const refreshRes = await fetch(`${API_SMAFARM}/auth/refreshToken`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token.refreshToken}` },
          });
          if (refreshRes.ok) {
            const newTokensRes = await refreshRes.json()
            const newTokens = newTokensRes.data;
            token.accessToken = newTokens.access_token;
            token.refreshToken = newTokens.refresh_token;

            token.expiresAt = Math.floor(Date.now() / 1000) + 3600;
            const profileRes = await fetch(`${API_SMAFARM}/users/profile`, {
              headers: { Authorization: `Bearer ${token.accessToken}` },
            });
            if (profileRes.ok) {
              const profileJson = await profileRes.json();
              token.profile = {
                ...profileJson.data,
                hasFarm: profileJson.data.farms !== null,
                farmId: profileJson.data.farms?.id
              };
            }
          }
        } catch (err) {
          console.error("Error refreshing token:", err);
        }
      }

      // handle update 
      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.role) token.role = session.user.role;
        if (session.user.profile) token.profile = { ...token.profile, ...session.user.profile };
      }

      return token;
    },

    async session({ session, token, trigger }) {
      session.user.id = token.id as number;
      session.user.name = token.name as string;
      session.user.role = token.role as string;
      session.user.idToken = token.idToken as string;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.expiresAt = new Date((token.expiresAt as number) * 1000).toISOString();
      session.user.profile = token.profile;

      // update session dari frontend
      if (trigger === "update" && session.user) {
        if (session.user.profile) session.user.profile = { ...session.user.profile, ...session.user.profile };
        if (session.user.name) session.user.name = session.user.name;
        if (session.user.role) session.user.role = session.user.role;
      }

      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
