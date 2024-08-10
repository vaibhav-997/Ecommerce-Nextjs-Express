'use client'
import { Products } from '@/app/(admin)/all-products/page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'



export default function Category() {
    const [products, setProducts] = useState<Products[]>([])
    const router = useRouter()
    const {toast} = useToast()
    useEffect(() => {
        try {
            ;(
                async () => {
                    const res = await axios.get('http://localhost:8000/api/product/category')
                    setProducts(res.data.payload    )
                }
            )();
        } catch (error) {
            toast({
                title:"Failed",
                description:"Failed to load category"
            })
        }
    },[])
 
 
    return (
        <div className=' py-4 bg-black/10 h-screen '>
        <div className='flex flex-wrap w-full items-center  justify-center sm:items-center sm:justify-center p-4 gap-4 '>
            {
                products && products.length > 0 ? products.map((product) => (
                    <Card key={product.id}  className=' max-w-xs'>

                        <CardHeader>
                            <CardTitle>{product.category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img className='w-72 h-72'  src={ `/uploads/${product.image.split("\\")[4]}` } alt={ product.image.split("\\")[4] } />
                        </CardContent>
                        <CardFooter className='flex flex-col gap-4 w-full'>
                            <Button onClick={() => router.push(`/AllProducts/${product.category}`)} className='w-full bg-green-700'>Explore</Button>
                           

                        </CardFooter>
                    </Card>


                )) : <h1 className='font-bold text-4xl text-center w-full text-black'>Loading..... </h1>
            }
        </div>

    </div>
  )
}
