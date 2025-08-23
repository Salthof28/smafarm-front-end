import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      role: string;
      idToken: string;
      profile?: {
        id: number;
        name: string;
        email: string;
        phone: string;
        hasFarm: boolean;
        status: string;
        img_profile: string;
        role: string;
        created_at: string;
        updated_at: string;
      };
    } & DefaultSession["user"];
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: string;
  }

  interface User {
    id: number;
    name: string;
    role: string;
    idToken: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    profile?: {
      id: number;
      name: string;
      email: string;
      phone: string;
      hasFarm: boolean;
      status: string;
      img_profile: string;
      role: string;
      created_at: string;
      updated_at: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    name: string;
    role: string;
    idToken: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    profile?: {
      id: number;
      name: string;
      email: string;
      phone: string;
      hasFarm: boolean;
      status: string;
      img_profile: string;
      role: string;
      created_at: string;
      updated_at: string;
    };
  }
}

// import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       idToken: string;
//       name: string;
//       role: string;
//     } & DefaultSession["user"];
//     accessToken: string;
//     refreshToken: string;
//     expiresAt: string;
//     error?: string;
//   }

//   interface User extends DefaultUser {
//     accessToken: string;
//     refreshToken: string;
//     idToken: string;
//     sub: string;
//     role: string;
//     expiresAt: string;
//   }

//   interface JWT {
//     accessToken: string;
//     refreshToken: string;
//     idToken: string;
//     sub: string;
//     role: string;
//     expiresAt: string;
//     error?: string;
//   }
// }
