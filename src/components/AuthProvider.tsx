'use client'
import { SessionProvider } from "next-auth/react"

interface AuthProvider {
    children: React.ReactNode
}
export default function AuthProvider ({ children }: AuthProvider) {
    return <SessionProvider>{children}</SessionProvider>
}