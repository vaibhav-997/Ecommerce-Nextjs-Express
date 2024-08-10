"use client"

import { z } from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import { signIn } from "next-auth/react"
export default function SignUpForm() {
  const router = useRouter()
  const { toast } = useToast()
  const formSchema = z.object({
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6)
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  async function signUp(values: z.infer<typeof formSchema>) {
   
    try {
      let res = await axios.post('/api/register', values)
      console.log(res.data)
      toast({
      title:"Register Success",
      description:`Successfully registered with ${res?.data?.payload?.email}`,
    })
      form.reset()
    router.push('/')  
    

    } catch (error) {
      console.warn(error)
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
        <Form {...form}>
      <form onSubmit={form.handleSubmit(signUp)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="eg. Jone" {...field} />
              </FormControl>
              
              
            </FormItem>
          )}
        />
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
        <Button className="w-full" type="submit"> Create an account</Button>
      </form>
    </Form>
          
          <Button onClick={() => signIn('github')} variant="outline" className="w-full">
            Sign up with GitHub
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/signin" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}