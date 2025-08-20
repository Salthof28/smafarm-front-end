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

          // 2. Fetch profile pakai access_token
          const profileRes = await fetch("http://localhost:4000/users/profile", {
            headers: {
              Authorization: `Bearer ${loginData.access_token}`,
            },
          });

          if (!profileRes.ok) return null;
          const profileJson = await profileRes.json()
          const profileData = profileJson.data;

          return {
            id: loginData.id,
            sub: loginData.id,
            name: loginData.name,
            role: loginData.role,
            idToken: loginData.id_token,
            expiresAt: loginData.expires_at,
            accessToken: loginData.access_token,
            refreshToken: loginData.refresh_token,
            profile: profileData.data, // simpan profil user di sini
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
      // saat login pertama kali
      if (user) {
        token.id = Number(user.id);
        token.name = user.name;
        token.role = user.role;
        token.idToken = user.idToken;
        token.expiresAt = Math.floor(new Date(user.expiresAt).getTime() / 1000);
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.profile = user.profile;
      }

      // cek expired token
      const now = Math.floor(Date.now() / 1000);
      if (token.expiresAt && now >= (token.expiresAt as number)) {
        try {
          // refresh token
          const refreshRes = await fetch("http://localhost:4000/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: token.refreshToken }),
          });

          if (refreshRes.ok) {
            const newTokens = await refreshRes.json();

            token.accessToken = newTokens.access_token;
            token.refreshToken = newTokens.refresh_token;
            token.expiresAt = newTokens.expires_at;

            // update profile lagi dengan token baru
            const profileRes = await fetch("http://localhost:4000/users/profile", {
              headers: {
                Authorization: `Bearer ${newTokens.access_token}`,
              },
            });

            if (profileRes.ok) {
              const profileData = await profileRes.json();
              token.profile = profileData.data;
            }
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
        session.expiresAt = new Date((token.expiresAt as number) * 1000).toISOString();
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.user.profile = token.profile; // profile user full
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};


// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions: NextAuthOptions = {
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "email",
//           placeholder: "blabla@gmail.com",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null;
//         }

//         try {
//           // hit API login (NestJS kamu)
//           const response = await fetch(
//             "http://localhost:4000/auth/login", // ganti sesuai URL NestJS
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 email: credentials.email,
//                 password: credentials.password,
//               }),
//             }
//           );

//           if (!response.ok) {
//             console.error(`Login Failed: ${await response.text()}`);
//             return null;
//           }

//           const data = await response.json();
//           console.log("login data: ", data);

//           // di Nest kamu return payloadnya gini:
//           // { id, id_token, name, role, expires_at }
//           return {
//             id: data.id,
//             sub: data.id,
//             name: data.name,
//             role: data.role,
//             idToken: data.id_token,
//             expiresAt: data.expires_at,
//             accessToken: data.access_token,
//             refreshToken: data.refresh_token,
//           };
//         } catch (error) {
//           console.error("Authorize error: ", error);
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.name = user.name;
//         token.role = user.role;
//         token.idToken = user.idToken;
//         token.expiresAt = user.expiresAt;
//         token.accessToken = user.accessToken;
//         token.refreshToken = user.refreshToken;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.id = token.id as string;
//         session.user.name = token.name as string;
//         session.user.role = token.role as string;
//         session.user.idToken = token.idToken as string;
//         session.expiresAt = token.expiresAt as string;
//         session.accessToken = token.accessToken as string;
//         session.refreshToken = token.refreshToken as string;
//       }
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login", // custom login page
//   },
// };
