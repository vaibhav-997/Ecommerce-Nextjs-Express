"use client"

import { z } from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {signIn} from 'next-auth/react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
export default function LoginForm() {
  const router = useRouter()
  const { toast } = useToast()
  const formSchema = z.object({

    email: z.string().email(),
    password: z.string().min(6)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      
      email: "",
      password: "",
    },
  })

  async function signUp(values: z.infer<typeof formSchema>) {
   
    try {
      const res = signIn('credentials',{email:values.email, password:values.password,callbackUrl:'/', redirect:false})
      res.then((resData)=> {
        if(resData?.ok !== false){
          toast({
            title:"Login Success",
            description:`Successfully Logged In`,
          })
    
          form.reset()
          router.push('/')
        }  else {
          
          toast({
            title:"Login Failure",
            description:`Please provide your correct credentials`
          })

        }
    }).catch(err => {
      console.log(err)
    })
    

    } catch (error) {
      console.warn(error)
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign In</CardTitle>
        <CardDescription>
          Enter your information to login to an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(signUp)} className="space-y-8">
       
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="eg. example@example.com" {...field} />
              </FormControl>
              
              
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} />
              </FormControl>
              
              
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit"> Login</Button>
      </form>
    </Form>
          
          <Button variant="outline" className="w-full">
            Sign up with GitHub
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}