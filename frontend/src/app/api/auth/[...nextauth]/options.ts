import { prisma } from "@/utils/prismaClient";
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from "next-auth/providers/credentials";
import bcryptjs from 'bcryptjs'
import { AuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"



export const authOptions : AuthOptions = {
  adapter:PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID !,
      clientSecret: process.env.GITHUB_SECRET !,
    
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "enter email" },
        password: { label: "enter password" },
      },
      async authorize(credentials) {
        try { 

            if(!credentials){
                throw new Error('Requested credentials not found')
            }

            const user = await prisma.user.findFirst({
                where:{
                    email:credentials?.email,
                
                }
            })

            if(!user){
                throw new Error('User not found ')
            }

            const hashedPassword = await bcryptjs.compare(credentials?.password,user?.password)
            if(hashedPassword){
                return {
                    id:String(user.id),
                    image:user.avatar,
                    email:user.email,
                    name:user.username,
                    role:user.role
                }
            }

            return null

        } catch (error) {
          throw new Error("Error while authenticating");
        }
      },
    }),
    
  ],
  callbacks:{
    async jwt({token,user}) {
        if(user){
            token.id = user.id,
            token.name = user.name
            token.email = user.email
            token.picture = user.image
            token.role = user.role
        }
        return token
    },
    async session({token, session}) {
        if(token){
            session.user.id = token.id 
            session.user.email = token.email
            session.user.name = token.name 
            session.user.image = token.picture
            session.user.role = token.role
        }
        return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: '/signin',
  // },
}
