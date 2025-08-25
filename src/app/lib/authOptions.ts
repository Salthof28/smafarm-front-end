import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import { jwtDecode } from "jwt-decode";

// type DecodedToken = {
//   exp?: number;
//   iat?: number;
//   sub?: string;
//   [key: string]: any;
// };
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

          // const decoded: DecodedToken = jwtDecode(loginData.access_token);
          // const accessTokenExpiresAt = decoded.exp
          //   ? decoded.exp
          //   : Math.floor(Date.now() / 1000) + 3600;
          const accessTokenExpiresAt = Math.floor(Date.now() / 1000) + 3600;

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
          const refreshRes = await fetch("http://localhost:4000/auth/refreshToken", {
            method: "POST",
            headers: { Authorization: `Bearer ${token.refreshToken}` },
          });
          if (refreshRes.ok) {
            const newTokens = await refreshRes.json();
            token.accessToken = newTokens.access_token;
            token.refreshToken = newTokens.refresh_token;
            // const decodedNew: DecodedToken = jwtDecode(newTokens.access_token);
            // token.expiresAt = decodedNew.exp
            //   ? decodedNew.exp
            //   : Math.floor(Date.now() / 1000) + 3600;
            // token.expiresAt = new Date(newTokens.expires_at).getTime() / 1000;
            token.expiresAt = Math.floor(Date.now() / 1000) + 3600;
            const profileRes = await fetch("http://localhost:4000/users/profile", {
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
