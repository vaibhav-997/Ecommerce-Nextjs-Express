import { prisma } from '@/utils/prismaClient'
import bcryptjs from 'bcryptjs'

export async function POST(req:Request) {
    try {
        const {username, email, password} = await req.json()

       
        if(!username || !password || !email) {
            return Response.json({message:"Error getting credentials. Please provide all the required credentials"}) 
        }
        const existingUser = await prisma.user.findFirst({
            where:{
                email:email
            }
        })

        if(existingUser){
            return Response.json({message:"User already exists. Please use another email"})
        }
        
        let hashedPassword = await bcryptjs.hash(password, 10)

        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                password:hashedPassword
            }
            
           
            
        })


        return Response.json({message:"User created successfully", payload:newUser}, )


    } catch (error) {
        return Response.json({message:"Error registering user", error})
    }
}