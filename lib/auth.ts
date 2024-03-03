import { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";
import type { Adapter } from "next-auth/adapters";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as Adapter,
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, 
    },
    pages: {
        signIn: '/login',
    },
providers: [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text", placeholder: "johndoe@gmail.com" },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      if(!credentials?.email || !credentials?.password ){
        return null;
      }
      const existingUser = await db.user.findUnique({
        where: {email: credentials?.email}
      });
    if(!existingUser){
      return null;
    }
    const passwordMatch = await compare(credentials.password, existingUser.password)

    if(!passwordMatch) {
      return null
    }
    return {
      id:  `${existingUser.id}`,
      username: existingUser.username,
      email: existingUser.email
    }
    }
  })
],
callbacks: {
  async jwt ({ token, user}){
    if(user){
      return {
        ...token,
        username: user.username
      }
    }
    return token
  },
  async session({ session, user, token}){
    return {
      ...session,
      user:{
        ...session.user,
        username: token.username
      }
    }
    return session
  }
}
}