import { Role } from '@prisma/client'
import 'next-auth'
import  { DefaultSession } from "next-auth"
import 'next-auth/jwt'

declare module "next-auth" {
 
  interface User {
    id?:string  
    role :Role
  } 


  interface Session {
    user: {
      id?:string  
      role :Role
    }  & DefaultSession['user']
  }


}

declare module 'next-auth/jwt' {
  interface JWT {
      id?: string;
     role:Role
  }
  }