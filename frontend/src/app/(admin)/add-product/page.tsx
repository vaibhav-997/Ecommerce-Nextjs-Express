"use client"

import {  z } from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"


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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChangeEvent, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"





export default function AddPRoductForm() {
   
    const { toast } = useToast()
    const [image, setImage] = useState<FileList | null>()
    const [imagePreview, setImagePreview] = useState<string | null>()
    const {data} = useSession()
    const router = useRouter()

   

    //   model Product {
    //     id          String @id
    //     name        String
    //     price       String
    //     description String
    //     size        Size
    //     image       String
    //   }

    const formSchema = z.object({
        productName: z.string().min(2).max(50),
        productPrice: z.string(),
        productSize: z.string(),
        productDescription: z.string().min(6),
        productCategory : z.string()
        
        
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productName: "",
            productPrice: "",
            productDescription: "",
            productSize: "",
            productCategory: "",
            
        },
    })

    const handleImageChange = (e:ChangeEvent<HTMLInputElement>) => {
        setImage(e.target.files)
    }

    async function AddProduct(values: z.infer<typeof formSchema>) {

        try {
            let formData = new FormData()
            formData.append('name', values.productName)    
            formData.append('description', values.productDescription)    
            formData.append('price', values.productPrice)    
            formData.append('size', values.productSize)    
            formData.append('category', values.productCategory)    
            if(image){
                formData.append('image', image[0])
            }    
            const res = await axios.post('http://localhost:8000/api/product/add-product', formData)
            toast({
                title:'Success',
                description: res.data?.message
            })
            form.reset()
            setImage(null)
            
            
            
        } catch (error) {
            console.warn(error)
            toast({
                title:'Failed',
                description: 'Failed to add product',
                variant: "destructive"
            })
            form.reset()
            setImage(null)
        }
    }

    useEffect(() => {
        if(image ) {
            const url = URL.createObjectURL(image[0])
            setImagePreview(url)
        }

        if(data && data?.user.role !== "ADMIN"){
            router.push('/')
        }
    },[image])


    return (
        <div className="flex py-4 items-center justify-center min-h-screen">
           {
            data?.user.role !== "ADMIN" ?
            <h1 className='font-bold text-4xl text-center w-full text-black'>Loading.....</h1>
        
            :
            <Card className="mx-auto w-full max-w-screen-lg">
            <CardHeader>
                <CardTitle className="text-center text-xl">Add Product</CardTitle>
                <CardDescription className="text-center">
                    Enter your information to add an product
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <Form { ...form }>
                        <form onSubmit={ form.handleSubmit(AddProduct) } className="space-y-8">
                            <FormField
                                control={ form.control }
                                name="productName"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="eg. Name" { ...field } />
                                        </FormControl>


                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="productDescription"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="eg. Description" { ...field } ></Textarea>
                                        </FormControl>


                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="productPrice"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Price</FormLabel>
                                        <FormControl>
                                            <Input placeholder="eg. Price" { ...field } />
                                        </FormControl>


                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="productSize"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Size</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                                <SelectTrigger className="w-[250px]">
                                                    <SelectValue placeholder="Select Product Size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem { ...field } value="S">Small</SelectItem>
                                                    <SelectItem { ...field } value="M">Medium</SelectItem>
                                                    <SelectItem { ...field } value="L">Large</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>


                                    </FormItem>
                                ) }
                            />
                            <FormField
                                control={ form.control }
                                name="productCategory"
                                render={ ({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product Category</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                                <SelectTrigger className="w-[250px]">
                                                    <SelectValue placeholder="Select Product Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem { ...field } value="MEN">MEN</SelectItem>
                                                    <SelectItem { ...field } value="WOMEN">WOMEN</SelectItem>
                                                    <SelectItem { ...field } value="KID">KID</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>


                                    </FormItem>
                                ) }
                            />
                           <div className="flex flex-wrap gap-2">
              <Input type="file" onChange={handleImageChange} />
              {imagePreview && (
                <div>
                  <img width={600} src={imagePreview} alt="product" />
                </div>
              )}
            </div>
                            <Button className="w-full" type="submit"> Add Prodcut</Button>
                        </form>
                    </Form>


                </div>

            </CardContent>
        </Card>
           }
        </div>
    )
}