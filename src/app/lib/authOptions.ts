import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const users = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@mail.com',
        password: 'password123',
        role: 'user',
    },
    {
        id: 2,
        name: 'Admin',
        email: 'admin@mail.com',
        password: 'admin123',
        role: 'admin',
    }
]
export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: "Email", type: "email", placeholder: 'blabla@gmail.com'},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if (!credentials?.email && !credentials?.password) {
                    return null
                }
                else {
                    const { email, password } = credentials as {
                        email: string,
                        password: string
                    };
                    const user: any = users.find(user => user.email === credentials.email && user.password === credentials.password);
                    if (user) {
                        return user;
                    }
                    else {
                        return null;
                    }
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.password = user.password;
                token.role = user.role;
                token.avatar = user.avatar;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session ({ session, token }) {
            if(token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.password = token.password
                session.user.role = token.role;
                session.user.avatar = token.avatar;
                session.accessToken = token.accessToken;
            }
            return session
        }
    },
    pages: {
        signIn: '/login'
    },
}