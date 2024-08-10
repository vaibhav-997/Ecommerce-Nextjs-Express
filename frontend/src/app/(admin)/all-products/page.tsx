'use client'
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { toast, useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useSession } from 'next-auth/react'


export interface Products {
    id: string
    name: string
    description: string
    size: string
    price: string
    image: string
    category: string
}


function AllProducts({admin = true}:{admin:boolean}) {
    const { toast } = useToast()
    const [products, setProducts] = useState<Products[] | []>([])
    const router = useRouter()
    const {data} = useSession()


    


    useEffect(() => {
       

                try {
                    ; (
                        async () => {
                            
                            const res = await axios.get('http://localhost:8000/api/product/get-all-products')
                            setProducts(res.data.payload)
        
                        }
                    )();
                } catch (error) {
                    toast({
                        title:"Failed",
                        description:"Error fetching products",
                        variant:"destructive"
                    })
                }
            
        
    }, [])

    return (
        <div className=' py-4   h-screen w-full '>
            <div className='grid md:grid-cols-12 w-full items-center  justify-center sm:items-center sm:justify-center p-4 gap-4 '>
                {
                    products && products.length > 0 && data?.user.role === "ADMIN" ? products.map((product) => (
                        <Card key={ product.id } className='md:h-full md:max-w-sm lg:col-span-4 md:col-span-6    shadow-md col-span-1  '>

                            <CardHeader>
                                <CardTitle>{ product.name }</CardTitle>
                                <CardDescription>{ product.description }</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <img className='w-72 h-72' src={ `/uploads/${product.image.split('\\')[4]}` } alt={ product.name } />
                            </CardContent>
                            <CardFooter className='flex flex-col gap-4 w-full'>
                                <Button className='w-full bg-green-700'>Explore</Button>
                                {
                                    admin === true && 
                                    <>
                                    <Button className='w-full bg-yellow-500' onClick={ () => router.push(`/update-product/${product.id}`) }>Update</Button>
                                <Dialog>
                                    <DialogTrigger className='bg-red-700 w-full py-2 rounded-sm text-white'>Delete</DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure? 
                                                
                                                <Button onClick={ () => handleDelete(product.id) } className='w-full my-2 bg-red-700 '>Delete</Button>
                                                </DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </DialogDescription>
                                        </DialogHeader>
                                    </DialogContent>
                                </Dialog>
                                    </>
                                }

                            </CardFooter>
                        </Card>


                    )) : <h1 className='font-bold text-4xl text-center w-full text-black'>Loading..... </h1>
                }
            </div>

        </div>
    )
}

export default AllProducts

const handleDelete = async (id: string) => {
    try {
        await axios.delete(`http://localhost:8000/api/product/delete-product/${id}`)

        toast({
            title: "Success",
            description: "Product deleted successfully"
        })
        window.location.reload()
    } catch (error) {
        console.log(error)
        toast({
            title: 'Failed',
            description: "Error deleting the product",
            variant: "destructive"
        })
    }
}